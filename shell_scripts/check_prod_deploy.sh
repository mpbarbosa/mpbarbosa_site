#!/bin/bash
#
# check_prod_deploy.sh
# --------------------
# Purpose:      One-command answer to "did it deploy?" for mpbarbosa.com.
#               READ-ONLY: it changes nothing on the host. It runs ON the prod
#               host, so from a workstation send it through SSM:
#
#   AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh shell_scripts/check_prod_deploy.sh
#
#               Production is deployed by ubuntu's cron, not by a script in this
#               repo (see CLAUDE.md, "Deployment model"):
#
#                 */10 devops/scripts/git_sync.sh
#                   pulls ~/Documents/GitHub/mpbarbosa.com (the staging repo), then
#                   devops/copa_2026/prod_deploy.sh runs
#                   mpbarbosa_site/shell_scripts/sync_to_staging.sh --step2
#                       --production-dir /var/www/mpbarbosa.com
#
#               --step2 rsyncs the whole staging checkout, .git included, into
#               the web root. So the web root's HEAD is the staging commit that
#               was last copied, and "deployed" means GitHub main, the staging
#               clone and the web root all name the same commit.
#
# Usage:        check_prod_deploy.sh [--help]
#
# Environment:  PROD_GITHUB_DIR  checkouts dir  (default /home/ubuntu/Documents/GitHub)
#               PROD_WEB_DIR     nginx web root (default /var/www/mpbarbosa.com)
#               PROD_OWNER       owning user    (default ubuntu)
#
# Why git runs as the owner: SSM runs as root, and git run as root in these
# ubuntu-owned checkouts is not write-free even with `-c safe.directory='*'`.
# On 2026-09-10 a root inspection left .git/index root-owned in all three.
# Running git as the owner, with GIT_OPTIONAL_LOCKS=0, leaves nothing behind.
#
# Exit codes:
#   0  the web root is at GitHub main (or at the staging clone's HEAD, when
#      GitHub cannot be reached)
#   1  not deployed yet, deploy failed, or a HEAD could not be read
#   2  not on the prod host, wrong user, or bad usage

set -uo pipefail

GITHUB_DIR="${PROD_GITHUB_DIR:-/home/ubuntu/Documents/GitHub}"
WEB_DIR="${PROD_WEB_DIR:-/var/www/mpbarbosa.com}"
OWNER="${PROD_OWNER:-ubuntu}"
STAGING_DIR="${GITHUB_DIR}/mpbarbosa.com"
SITE_DIR="${GITHUB_DIR}/mpbarbosa_site"
PUBLIC_URL="https://mpbarbosa.com/"

case "${1:-}" in
    -h|--help) sed -n '2,/^$/s/^# \{0,1\}//p' "$0"; exit 0 ;;
    "") ;;
    *) echo "Usage: $0 [--help]" >&2; exit 2 ;;
esac

if [[ ! -d "${WEB_DIR}/.git" || ! -d "${STAGING_DIR}/.git" ]]; then
    echo "ERROR: ${WEB_DIR} or ${STAGING_DIR} is not a git checkout here." >&2
    echo "This runs on the prod host. From a workstation:" >&2
    echo "  AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh shell_scripts/check_prod_deploy.sh" >&2
    exit 2
fi

if [[ ${EUID} -ne 0 && "$(id -un)" != "${OWNER}" ]]; then
    echo "ERROR: run as root (an SSM session) or as ${OWNER}." >&2
    exit 2
fi

OWNER_HOME="$(getent passwd "${OWNER}" | cut -d: -f6)"
LOG_FILE="${OWNER_HOME:-/home/${OWNER}}/.local/log/git_sync.log"

# Run a command as the checkouts' owner, so git never writes root-owned files.
as_owner() {
    if [[ "$(id -un)" == "${OWNER}" ]]; then
        env GIT_OPTIONAL_LOCKS=0 "$@"
    else
        sudo -n -u "${OWNER}" -H env GIT_OPTIONAL_LOCKS=0 "$@"
    fi
}

git_in() {
    local dir="$1"; shift
    as_owner git -C "${dir}" "$@" 2>/dev/null
}

# commit_line <dir> <rev>: one-line summary of a commit.
commit_line() {
    git_in "$1" log -1 --format='%h  %ci  %s' "$2" || echo "(could not read $2)"
}

section() { printf '\n== %s ==\n' "$1"; }

minute=$((10#$(date -u +%M)))
next_run="$(date -u -d "+$((10 - minute % 10)) min" '+%H:%M') UTC"

# ── staging clone ────────────────────────────────────────────────────────────

section "Staging clone: ${STAGING_DIR}"
staging_head="$(git_in "${STAGING_DIR}" rev-parse HEAD)"
echo "HEAD           $(commit_line "${STAGING_DIR}" HEAD)"
echo "origin/main    $(commit_line "${STAGING_DIR}" origin/main)  (as of cron's last fetch)"

github_head="$(as_owner timeout 20 git -C "${STAGING_DIR}" ls-remote origin refs/heads/main 2>/dev/null | cut -f1)"
if [[ -n "${github_head}" ]]; then
    echo "GitHub main    ${github_head:0:7}  (live ls-remote)"
else
    echo "GitHub main    (ls-remote failed: network, or ${OWNER}'s GitHub key)"
fi

git_in "${STAGING_DIR}" diff --quiet HEAD
case $? in
    0) echo "working tree   clean" ;;
    1) echo "working tree   HAS LOCAL CHANGES: git_sync will not pull this repo until they are gone" ;;
    *) echo "working tree   (could not check)" ;;
esac

# ── web root ─────────────────────────────────────────────────────────────────

section "Web root (nginx): ${WEB_DIR}"
web_head="$(git_in "${WEB_DIR}" rev-parse HEAD)"
echo "HEAD           $(commit_line "${WEB_DIR}" HEAD)"
echo "index.html     modified $(date -u -r "${WEB_DIR}/index.html" '+%F %T UTC' 2>/dev/null || echo '(missing)')"
if command -v curl >/dev/null 2>&1; then
    last_modified="$(curl -sI --max-time 10 "${PUBLIC_URL}" | tr -d '\r' | grep -i '^last-modified:' | cut -d' ' -f2-)"
    echo "${PUBLIC_URL}  last-modified: ${last_modified:-(no answer)}"
fi

# ── deploy script checkout ───────────────────────────────────────────────────

section "Deploy script checkout: ${SITE_DIR}"
echo "HEAD           $(commit_line "${SITE_DIR}" HEAD)"
echo "(its shell_scripts/sync_to_staging.sh --step2 does the copy into the web root)"

# ── git_sync log ─────────────────────────────────────────────────────────────

section "git_sync (${OWNER}'s cron, every 10 min): ${LOG_FILE}"
logs=()
[[ -f "${LOG_FILE}.1" ]] && logs+=("${LOG_FILE}.1")
[[ -f "${LOG_FILE}" ]] && logs+=("${LOG_FILE}")
if [[ ${#logs[@]} -eq 0 ]]; then
    echo "(no log found)"
else
    echo "log covers since $(head -1 "${logs[0]}" | cut -c2-20); next run ~${next_run}"
    echo "last runs:"
    grep -h '=== git_sync done' "${logs[@]}" | tail -3 | sed 's/^/  /'
    echo "mpbarbosa pulls, deploys, skips and failures:"
    events="$(grep -hE '\] (mpbarbosa\.com|mpbarbosa_site)(: (pulled OK|pull failed|fetch failed|running |[0-9]+ commit)|/prod_deploy: .*(running sync_to_staging|\] done|ERROR|[Ff]ail))' "${logs[@]}" \
        | sed 's/\x1b\[[0-9;]*m//g' | tail -15)"
    if [[ -n "${events}" ]]; then
        echo "${events}" | sed 's/^/  /'
    else
        echo "  none: neither repo was pulled in the retained log"
    fi
fi

# ── ownership ────────────────────────────────────────────────────────────────

section "Not owned by ${OWNER} (root-owned files here can break the cron deploy)"
stray="$(find "${STAGING_DIR}" "${SITE_DIR}" "${WEB_DIR}" -name node_modules -prune -o ! -user "${OWNER}" -print 2>/dev/null | head -10)"
echo "${stray:-none}"

# ── verdict ──────────────────────────────────────────────────────────────────

section "Verdict"
if [[ -z "${staging_head}" || -z "${web_head}" ]]; then
    echo "UNKNOWN: could not read a HEAD (see above)."
    exit 1
fi
if [[ "${web_head}" != "${staging_head}" ]]; then
    echo "NOT LIVE: web root is at ${web_head:0:7}, staging clone at ${staging_head:0:7}."
    echo "The copy into the web root failed or has not run; look for prod_deploy lines above."
    exit 1
fi
if [[ -n "${github_head}" && "${github_head}" != "${staging_head}" ]]; then
    echo "NOT YET: web root and staging clone are at ${web_head:0:7}, GitHub main is at ${github_head:0:7}."
    echo "Pushed but not pulled. Expect it after the next git_sync run (~${next_run}),"
    echo "unless the staging clone has local changes (see above)."
    exit 1
fi
if [[ -n "${github_head}" ]]; then
    echo "LIVE: GitHub main, staging clone and web root are all at ${web_head:0:7}."
else
    echo "LIVE as far as the host knows: staging clone and web root are at ${web_head:0:7} (GitHub not checked)."
fi
exit 0
