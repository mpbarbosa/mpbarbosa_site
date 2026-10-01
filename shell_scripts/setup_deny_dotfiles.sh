#!/bin/bash
#
# setup_deny_dotfiles.sh
# ----------------------
# Purpose:      Stop nginx serving dot-paths (/.git/, /.gitignore, /.claude/,
#               /.backups/, ...) from the mpbarbosa.com web root, while keeping
#               /.well-known/ reachable. RUN THIS ON THE PROD HOST, as root:
#
#   AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh shell_scripts/setup_deny_dotfiles.sh --dry-run
#
#               Why the files are there: sync_to_staging.sh --step2 rsyncs the
#               whole staging checkout, .git included, into the web root, and
#               check_prod_deploy.sh reads that .git to tell whether a deploy
#               landed. So they stay on disk and nginx refuses to serve them.
#               The rule, and why it is a server-level `if` rather than a
#               `location`, is explained in nginx/mpbarbosa-deny-dotfiles.conf.
#
#               The snippet is embedded below (a test keeps it byte-identical
#               to the repo file), because run_on_prod_via_ssm.sh ships this
#               script alone. Like every nginx config here, it is NOT deployed
#               by sync_to_staging.sh: merging changes nothing until this runs.
#
# Usage:        setup_deny_dotfiles.sh [--dry-run]
#
#   --dry-run   Print the vhost edit as a diff; change nothing.
#
# What it does:
#   1. Parses every enabled vhost and finds each top-level server block that
#      serves the web root (`root /var/www/mpbarbosa.com;`). Detection and
#      editing use the same parser, so they cannot disagree. Refuses to edit a
#      server block that opens and closes on one line.
#   2. Idempotent: exits 0 when the snippet is installed unchanged, every such
#      block already includes it, and /.git/HEAD already answers 403.
#   3. Backs up each vhost it edits, and any previous snippet, to /root.
#   4. Installs the snippet to /etc/nginx/snippets/ and inserts its `include`
#      as the first line of each of those server blocks.
#   5. ONE `nginx -t`, ONE reload. Any failure restores the backups and reloads.
#   6. Verifies live: dot-paths answer 403, /.well-known/ is not refused, and the
#      site still answers 200. A failed check rolls back as well.
#
# Environment:  Defaults are the prod host. Override them only to rehearse the
#               whole run against a scratch nginx.
#   NGINX_DIR           /etc/nginx
#   WEB_ROOT            /var/www/mpbarbosa.com
#   SITE_URL            https://mpbarbosa.com
#   DEFAULT_SERVER_URL  https://127.0.0.1   (bare-IP requests; "" skips the check)
#   BACKUP_DIR          /root
#   NGINX_TEST_CMD      nginx -t
#   NGINX_RELOAD_CMD    systemctl reload nginx
#
# Exit codes:
#   0  Success, already configured, or --dry-run.
#   1  Pre-flight failed, or the change was rolled back.

set -uo pipefail

NGINX_DIR="${NGINX_DIR:-/etc/nginx}"
WEB_ROOT="${WEB_ROOT:-/var/www/mpbarbosa.com}"
WEB_ROOT="${WEB_ROOT%/}"
SITE_URL="${SITE_URL:-https://mpbarbosa.com}"
DEFAULT_SERVER_URL="${DEFAULT_SERVER_URL-https://127.0.0.1}"
BACKUP_DIR="${BACKUP_DIR:-/root}"
NGINX_TEST_CMD="${NGINX_TEST_CMD:-nginx -t}"
NGINX_RELOAD_CMD="${NGINX_RELOAD_CMD:-systemctl reload nginx}"

SNIPPET_NAME="mpbarbosa-deny-dotfiles.conf"
SNIPPET="${NGINX_DIR}/snippets/${SNIPPET_NAME}"
INCLUDE_LINE="include ${SNIPPET};"

say()  { echo "==> $*"; }
fail() { echo "ERROR: $*" >&2; exit 1; }

DRY_RUN=0
case "${1:-}" in
    --dry-run) DRY_RUN=1 ;;
    -h|--help) sed -n '2,/^$/s/^# \{0,1\}//p' "$0"; exit 0 ;;
    "") ;;
    *) echo "Usage: $0 [--dry-run]" >&2; exit 1 ;;
esac

# Byte-identical to shell_scripts/nginx/mpbarbosa-deny-dotfiles.conf
# (enforced by src/__tests__/shell_scripts.test.js).
snippet_body() {
    cat <<'SNIPPET'
# mpbarbosa-deny-dotfiles.conf
# ----------------------------
# Refuse every URI that has a dot-segment: /.git/, /.gitignore, /.claude/,
# /.agents/, /.backups/, /.env, and the same at any depth (/guia_js/.git/HEAD).
# The one exception is /.well-known/ at the root, which certbot's HTTP-01
# challenge and security.txt rely on.
#
# Why the web root holds dot-paths at all: sync_to_staging.sh --step2 rsyncs the
# whole staging checkout, .git included, into /var/www/mpbarbosa.com, and
# check_prod_deploy.sh reads that .git to tell whether a deploy landed. So the
# files stay on disk and nginx refuses to serve them.
#
# Two rules with one pattern, because each covers a gap in the other:
#
#   The server-level `if` runs in the server-rewrite phase, before any location
#   is chosen, and again after try_files, index and error_page redirects. A
#   location-only rule is skipped whenever a `^~` prefix location, an earlier
#   regex location, or a regex nested in a prefix location matches first, so a
#   later edit to the vhost could silently reopen the hole. `return` inside a
#   server-level `if` is one of the uses nginx documents as safe.
#
#   The `location` catches what the `if` cannot see: a `rewrite ... last` inside
#   a location re-selects a location without re-running server-level rewrites.
#   Being included first, it precedes the vhost's own regex locations. A rewrite
#   whose target falls in a `^~` prefix location still escapes both, so never
#   write one that targets a dot-path.
#
# $uri is percent-decoded and normalised before either rule runs, so
# /%2egit/HEAD, //.git/HEAD and /x/../.git/HEAD are caught too.
#
# 403 rather than 404 so a refused request is distinguishable in the access log
# from a missing file. It reveals nothing about whether the path exists: every
# dot-path gets 403.
#
# Must be the FIRST directive of every server block that serves the web root:
#     include /etc/nginx/snippets/mpbarbosa-deny-dotfiles.conf;
# Install / refresh with: shell_scripts/setup_deny_dotfiles.sh

if ($uri ~ "^/\.(?!well-known/)|/[^/]+/\.") {
    return 403;
}

location ~ "^/\.(?!well-known/)|/[^/]+/\." {
    return 403;
}
SNIPPET
}

# rewrite_vhost <vhost> <out>: write <vhost> to <out> with INCLUDE_LINE inserted
# right after the opening brace of every top-level server block that serves
# WEB_ROOT and does not include the snippet yet. Prints
# "<blocks serving WEB_ROOT> <includes added>". Exits 3, with the reason on
# stderr, on a layout it will not edit.
rewrite_vhost() {
    WEB_ROOT="${WEB_ROOT}" INCLUDE_LINE="${INCLUDE_LINE}" \
    awk -v out="$2" -v q="'" '
    function flush(   i, indent) {
        if (has_root) serving++
        if (has_root && !has_include) {
            if (open == nbuf) { bad = "server block at line " start " opens and closes on one line"; exit 3 }
            indent = buf[open + 1]; sub(/[^ \t].*$/, "", indent)
            if (indent == "") indent = "    "
            for (i = 1; i <= open; i++) print buf[i] > out
            print indent ENVIRON["INCLUDE_LINE"] > out
            for (i = open + 1; i <= nbuf; i++) print buf[i] > out
            added++
        } else {
            for (i = 1; i <= nbuf; i++) print buf[i] > out
        }
    }
    {
        code = $0; sub(/#.*/, "", code)
        if (!in_server && depth == 0 && code ~ /^[ \t]*server[ \t]*(\{|$)/) {
            in_server = 1; nbuf = 0; open = 0; has_root = 0; has_include = 0; start = NR
        }
        if (in_server) {
            buf[++nbuf] = $0
            if (!open && code ~ /\{/) open = nbuf
            # A directive can share its line with others: look at every statement.
            n = split(code, stmt, /[;{}]/)
            for (k = 1; k <= n; k++) {
                s = stmt[k]; sub(/^[ \t]+/, "", s); sub(/[ \t]+$/, "", s)
                if (s ~ /^root[ \t]/) {
                    sub(/^root[ \t]+/, "", s); gsub(/"/, "", s); gsub(q, "", s); sub(/\/$/, "", s)
                    if (s == ENVIRON["WEB_ROOT"]) has_root = 1
                }
                if (s ~ /^include[ \t].*mpbarbosa-deny-dotfiles\.conf$/) has_include = 1
            }
        } else {
            print $0 > out
        }
        depth += gsub(/\{/, "{", code) - gsub(/\}/, "}", code)
        if (in_server && open && depth == 0) { flush(); in_server = 0 }
    }
    END {
        if (bad != "") { print bad > "/dev/stderr"; exit 3 }
        if (in_server || depth != 0) { print "unbalanced braces" > "/dev/stderr"; exit 3 }
        print serving + 0, added + 0
    }' "$1"
}

http_code() {
    curl -s --path-as-is -o /dev/null -w '%{http_code}' --max-time 15 "$@" 2>/dev/null
}

# --- Pre-flight ---------------------------------------------------------------

command -v nginx >/dev/null 2>&1 || fail "nginx not installed. Run this on the prod host."
command -v curl >/dev/null 2>&1 || fail "curl not found; it is needed to verify the change."
[[ -d "${NGINX_DIR}/sites-enabled" ]] || fail "${NGINX_DIR}/sites-enabled not found. Run this on the prod host."
[[ -w "${NGINX_DIR}" ]] || fail "no write access to ${NGINX_DIR}: run as root."

WORK="$(mktemp -d)" || fail "mktemp failed."
trap 'rm -rf "${WORK}"' EXIT

# --- Plan ---------------------------------------------------------------------

snippet_body > "${WORK}/snippet"
needs_change=0
if [[ -f "${SNIPPET}" ]] && cmp -s "${WORK}/snippet" "${SNIPPET}"; then
    say "${SNIPPET} is installed and current."
else
    needs_change=1
    if [[ -f "${SNIPPET}" ]]; then
        say "Will replace ${SNIPPET}:"
        diff -u --label "${SNIPPET}" --label "${SNIPPET} (new)" "${SNIPPET}" "${WORK}/snippet" | sed 's/^/    /'
    else
        say "Will install ${SNIPPET}."
    fi
fi

targets=()
candidates=()
seen=" "
while IFS= read -r link; do
    file="$(readlink -f "${link}")"
    [[ -f "${file}" && "${seen}" != *" ${file} "* ]] || continue
    seen+="${file} "
    cand="${WORK}/vhost.${#targets[@]}"

    if ! counts="$(rewrite_vhost "${file}" "${cand}" 2>"${WORK}/why")"; then
        if grep -qF "${WEB_ROOT}" "${file}"; then
            echo "ERROR: will not edit ${file} automatically: $(cat "${WORK}/why")." >&2
            echo "Put '${INCLUDE_LINE}' as the first line of each server block there" >&2
            echo "that has 'root ${WEB_ROOT};', then: nginx -t && systemctl reload nginx" >&2
            exit 1
        fi
        say "Skipping ${file} (does not mention ${WEB_ROOT}; parser: $(cat "${WORK}/why"))."
        continue
    fi

    read -r serving added <<< "${counts}"
    if [[ "${serving}" -eq 0 ]]; then
        if grep -qF "${WEB_ROOT}" "${file}"; then
            echo "WARNING: ${file} mentions ${WEB_ROOT} but has no server block with" >&2
            echo "  'root ${WEB_ROOT};' (an alias?). Not edited: check it by hand." >&2
        fi
        continue
    fi

    targets+=("${file}")
    candidates+=("${cand}")
    if [[ "${added}" -gt 0 ]]; then
        needs_change=1
        say "${file}: ${serving} server block(s) serve ${WEB_ROOT}; adding the include to ${added}:"
        diff -u --label "${file}" --label "${file} (new)" "${file}" "${cand}" | sed 's/^/    /'
    else
        say "${file}: all ${serving} server block(s) serving ${WEB_ROOT} already include the snippet."
    fi
done < <(find "${NGINX_DIR}/sites-enabled" -mindepth 1 -maxdepth 1 \( -type f -o -type l \) | sort)

if [[ ${#targets[@]} -eq 0 ]]; then
    echo "ERROR: no enabled vhost in ${NGINX_DIR}/sites-enabled has 'root ${WEB_ROOT};'." >&2
    echo "This host does not serve the site. THIS SCRIPT MUST RUN ON THE PROD HOST:" >&2
    echo "  AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh shell_scripts/$(basename "$0") --dry-run" >&2
    exit 1
fi

for conf in "${NGINX_DIR}"/conf.d/*.conf; do
    [[ -f "${conf}" ]] && grep -qF "${WEB_ROOT}" "${conf}" || continue
    echo "WARNING: ${conf} also mentions ${WEB_ROOT} and is NOT edited by this script." >&2
done

if [[ ${needs_change} -eq 0 ]]; then
    live="$(http_code "${SITE_URL}/.git/HEAD")"
    if [[ "${live}" == "403" ]]; then
        say "Already configured: ${SITE_URL}/.git/HEAD answers 403. Nothing to do."
        exit 0
    fi
    say "Config on disk is in place, but ${SITE_URL}/.git/HEAD answers ${live}; nginx may not have been reloaded."
fi

if [[ ${DRY_RUN} -eq 1 ]]; then
    say "--dry-run: stopping before any change."
    exit 0
fi

# --- Backup -------------------------------------------------------------------

STAMP="$(date +%Y%m%d-%H%M%S)"
backups=()
for file in "${targets[@]}"; do
    backup="${BACKUP_DIR}/$(basename "${file}").vhost.${STAMP}.bak"
    cp -a "${file}" "${backup}" || fail "could not back up ${file}."
    backups+=("${backup}")
    say "Backed up ${file} -> ${backup}"
done
SNIPPET_BACKUP=""
if [[ -f "${SNIPPET}" ]]; then
    SNIPPET_BACKUP="${BACKUP_DIR}/${SNIPPET_NAME}.${STAMP}.bak"
    cp -a "${SNIPPET}" "${SNIPPET_BACKUP}" || fail "could not back up ${SNIPPET}."
fi

rollback() {
    echo "" >&2
    echo "!! Rolling back." >&2
    local idx
    for idx in "${!targets[@]}"; do
        cp -a "${backups[$idx]}" "${targets[$idx]}"
    done
    if [[ -n "${SNIPPET_BACKUP}" ]]; then
        cp -a "${SNIPPET_BACKUP}" "${SNIPPET}"
    else
        rm -f "${SNIPPET}"
    fi
    if bash -c "${NGINX_TEST_CMD}" >/dev/null 2>&1 && bash -c "${NGINX_RELOAD_CMD}"; then
        echo "!! Rolled back cleanly; nginx is back on its previous config." >&2
    else
        echo "!! CRITICAL: nginx does not accept the restored config. Inspect by hand:" >&2
        echo "!!   nginx -t" >&2
        for idx in "${!targets[@]}"; do
            echo "!!   cp -a ${backups[$idx]} ${targets[$idx]}" >&2
        done
    fi
    exit 1
}

# --- Apply --------------------------------------------------------------------

mkdir -p "${NGINX_DIR}/snippets" || rollback
install -m 644 "${WORK}/snippet" "${SNIPPET}" || rollback
for idx in "${!targets[@]}"; do
    # cat > keeps the vhost's inode, owner and mode.
    cat "${candidates[$idx]}" > "${targets[$idx]}" || rollback
done

say "Testing nginx config..."
if ! bash -c "${NGINX_TEST_CMD}"; then
    echo "ERROR: nginx -t failed with the new config." >&2
    rollback
fi

say "Reloading nginx..."
if ! bash -c "${NGINX_RELOAD_CMD}"; then
    echo "ERROR: nginx reload failed." >&2
    rollback
fi

# --- Verify live --------------------------------------------------------------

say "Verifying..."
sleep 2
failed=0

for path in /.git/HEAD /.git/config /.gitignore /%2egit/HEAD; do
    code="$(http_code "${SITE_URL}${path}")"
    echo "    ${SITE_URL}${path} -> ${code}"
    [[ "${code}" == "403" ]] || { echo "ERROR: expected 403 for ${path}." >&2; failed=1; }
done

# Nothing is written to the web root: a missing probe must come back 404 (or
# whatever nginx would normally say), just not 403.
probe="/.well-known/acme-challenge/deny-dotfiles-probe-${STAMP}"
code="$(http_code "${SITE_URL}${probe}")"
echo "    ${SITE_URL}${probe} -> ${code}"
if [[ "${code}" == "403" || "${code}" == "000" ]]; then
    echo "ERROR: /.well-known/ must stay reachable for certbot renewals." >&2
    failed=1
fi

for path in / /en/; do
    code="$(http_code "${SITE_URL}${path}")"
    echo "    ${SITE_URL}${path} -> ${code}"
    [[ "${code}" == "200" ]] || { echo "ERROR: the site stopped serving ${path}." >&2; failed=1; }
done

[[ ${failed} -eq 0 ]] || rollback

# The bare-IP default server can be a different vhost that answers 200 for every
# path (on prod it is copa2026's Express app returning its SPA shell), so only a
# body that really is a git HEAD counts as a leak.
if [[ -n "${DEFAULT_SERVER_URL}" ]]; then
    head_body="$(curl -sk --path-as-is --max-time 15 "${DEFAULT_SERVER_URL}/.git/HEAD" 2>/dev/null | head -c 45)"
    if [[ "${head_body}" =~ ^(ref:\ |[0-9a-f]{40}) ]]; then
        echo "WARNING: ${DEFAULT_SERVER_URL}/.git/HEAD still returns a git HEAD: the bare-IP" >&2
        echo "  default server is not one of the blocks edited above. Add '${INCLUDE_LINE}' to it by hand." >&2
    else
        echo "    ${DEFAULT_SERVER_URL}/.git/HEAD (bare-IP default server) -> not a git HEAD"
    fi
fi

echo ""
say "Done. Dot-paths under ${WEB_ROOT} are refused; /.well-known/ is not."
echo "    Backups: ${backups[*]}${SNIPPET_BACKUP:+ ${SNIPPET_BACKUP}}"
