#!/bin/bash
#
# fix_www_vhost_conflict.sh
# -------------------------
# Purpose:      Finish the job commit af4554f started: make the bare apex
#               mpbarbosa.com the canonical host by 301-redirecting
#               www.mpbarbosa.com to it.
#
#               RUN THIS ON THE PROD HOST.
#
# Why this exists alongside setup_www_redirect.sh:
#
#               setup_www_redirect.sh deliberately REFUSES to run while another
#               enabled vhost still claims www.mpbarbosa.com, and tells you to
#               go edit that vhost by hand. On this host it does — the main
#               vhost reads `server_name mpbarbosa.com www.mpbarbosa.com;` in
#               both its HTTP and HTTPS blocks — which is exactly why www still
#               answers 200 for every path instead of redirecting.
#
#               This script performs that prerequisite edit (backed up, with
#               automatic rollback) and installs the redirect in ONE nginx
#               reload. Doing it as two manual steps leaves a window in which
#               www matches no vhost at all and falls through to whatever
#               default_server answers — possibly a different site's content.
#               Staging both changes on disk before a single `nginx -t` and
#               reload closes that window.
#
# Usage:        sudo ./shell_scripts/fix_www_vhost_conflict.sh [--dry-run]
#
#               Also safe to run as root without sudo, e.g. over SSM:
#                 aws ssm send-command --document-name AWS-RunShellScript ...
#
#   --dry-run   Show what would change, touch nothing.
#
# Prerequisites:
#   - nginx installed and running; root (directly or via sudo).
#   - The TLS cert already covers BOTH names. It does today:
#     CN=www.mpbarbosa.com, SAN: DNS:mpbarbosa.com, DNS:www.mpbarbosa.com.
#     This script never calls certbot.
#
# What it does:
#   1. Pre-flight: root, nginx, main vhost present, cert lineage covers both.
#   2. Idempotent: exits 0 if www already 301s to the apex.
#   3. Backs up the main vhost to a timestamped file under /root.
#   4. Drops www from every `server_name` line in the main vhost.
#   5. Installs the redirect vhost + enables it.
#   6. ONE `nginx -t`, then ONE reload. Any failure rolls back everything.
#   7. Verifies live: www 301s to the apex, and the apex itself still serves
#      200 (so a broken redirect can't silently take the site down).
#
# Exit codes:
#   0  Success, or already configured.
#   1  Pre-flight failed, or the change was rolled back.

set -uo pipefail

WWW_HOST="www.mpbarbosa.com"
CANONICAL="mpbarbosa.com"
CERT_NAME="www.mpbarbosa.com"

MAIN_VHOST="/etc/nginx/sites-available/${CANONICAL}"
REDIRECT_CONF="/etc/nginx/sites-available/${WWW_HOST}"
REDIRECT_LINK="/etc/nginx/sites-enabled/${WWW_HOST}"
CERT_FULLCHAIN="/etc/letsencrypt/live/${CERT_NAME}/fullchain.pem"

REPO_CONF="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/nginx/mpbarbosa-www-redirect.conf"

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

say()  { echo "==> $*"; }
fail() { echo "ERROR: $*" >&2; exit 1; }

# --- Pre-flight ---------------------------------------------------------------

[[ $EUID -eq 0 ]] || fail "must run as root (use sudo)."
command -v nginx >/dev/null 2>&1 || fail "nginx not installed. Run this on the prod host."

# The single most likely mistake is running this on a workstation instead of the
# prod host: a dev box may well have nginx, but it will not have this vhost.
if [[ ! -f "${MAIN_VHOST}" ]]; then
    echo "ERROR: main vhost not found at ${MAIN_VHOST}." >&2
    echo "" >&2
    echo "This host does not serve ${CANONICAL}. THIS SCRIPT MUST RUN ON THE PROD HOST." >&2
    echo "" >&2
    echo "  ssh ubuntu@${CANONICAL}          # note: user is 'ubuntu', not your local name" >&2
    echo "  # or, needing no SSH key and no open port 22:" >&2
    echo "  AWS_PROFILE=mpb aws ssm start-session --target i-0ca13c62d0d9d0d00" >&2
    echo "" >&2
    echo "Copy this script over first if it is not already there:" >&2
    echo "  scp $(basename "${BASH_SOURCE[0]}") ubuntu@${CANONICAL}:~/" >&2
    exit 1
fi
[[ -f "${CERT_FULLCHAIN}" ]] || fail "cert lineage '${CERT_NAME}' not found at ${CERT_FULLCHAIN}."

for host in "${WWW_HOST}" "${CANONICAL}"; do
    if ! openssl x509 -in "${CERT_FULLCHAIN}" -noout -text 2>/dev/null | grep -Fq "DNS:${host}"; then
        fail "cert '${CERT_NAME}' does not cover ${host}. Expand it before running this."
    fi
done
say "Pre-flight OK (root, nginx, vhost, cert covers both names)."

# --- Idempotent skip ----------------------------------------------------------

live_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://${WWW_HOST}/" 2>/dev/null || echo 000)"
live_target="$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 15 "https://${WWW_HOST}/" 2>/dev/null || true)"
if [[ "${live_code}" == "301" && "${live_target}" == "https://${CANONICAL}/" ]]; then
    say "Already configured: https://${WWW_HOST}/ -> ${live_target} (301). Nothing to do."
    exit 0
fi
say "Current state: https://${WWW_HOST}/ answers ${live_code} (expected 301). Proceeding."

# --- Show the pending vhost edit ----------------------------------------------

WWW_ESC="${WWW_HOST//./\\.}"
matches="$(grep -nE "^[[:space:]]*server_name[^;]*[[:space:]]${WWW_ESC}([[:space:]]|;)" "${MAIN_VHOST}" || true)"

if [[ -z "${matches}" ]]; then
    say "No 'server_name ... ${WWW_HOST}' line in ${MAIN_VHOST}; only installing the redirect vhost."
else
    say "Will drop ${WWW_HOST} from these lines in ${MAIN_VHOST}:"
    echo "${matches}" | sed 's/^/    /'
fi

if [[ ${DRY_RUN} -eq 1 ]]; then
    say "--dry-run: stopping before any change."
    exit 0
fi

# --- Backup -------------------------------------------------------------------

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="/root/${CANONICAL}.vhost.${STAMP}.bak"
cp -a "${MAIN_VHOST}" "${BACKUP}" || fail "could not back up ${MAIN_VHOST}."
say "Backed up main vhost -> ${BACKUP}"

rollback() {
    echo "" >&2
    echo "!! Rolling back." >&2
    cp -a "${BACKUP}" "${MAIN_VHOST}"
    rm -f "${REDIRECT_LINK}" "${REDIRECT_CONF}"
    if nginx -t >/dev/null 2>&1; then
        systemctl reload nginx
        echo "!! Rolled back cleanly; site restored to its previous config." >&2
    else
        echo "!! CRITICAL: config is still invalid after rollback. Inspect manually:" >&2
        echo "!!   nginx -t" >&2
        echo "!!   cp -a ${BACKUP} ${MAIN_VHOST} && systemctl reload nginx" >&2
    fi
    exit 1
}

# --- 1. Drop www from the main vhost's server_name lines ----------------------

sed -i -E "/^[[:space:]]*server_name/ s/[[:space:]]+${WWW_ESC}([[:space:]]|;)/\1/g" "${MAIN_VHOST}"

if grep -qE "^[[:space:]]*server_name[^;]*[[:space:]]${WWW_ESC}([[:space:]]|;)" "${MAIN_VHOST}"; then
    echo "ERROR: ${WWW_HOST} still present in a server_name line after the edit." >&2
    rollback
fi
if ! grep -qE "^[[:space:]]*server_name[^;]*${CANONICAL//./\\.}" "${MAIN_VHOST}"; then
    echo "ERROR: the edit removed ${CANONICAL} from server_name - refusing to continue." >&2
    rollback
fi
say "Main vhost now serves ${CANONICAL} only:"
grep -nE "^[[:space:]]*server_name" "${MAIN_VHOST}" | sed 's/^/    /'

# --- 2. Install the redirect vhost -------------------------------------------

if [[ -f "${REPO_CONF}" ]]; then
    say "Installing redirect vhost from repo copy: ${REPO_CONF}"
    install -m 644 "${REPO_CONF}" "${REDIRECT_CONF}" || rollback
else
    say "Repo copy not found; writing the equivalent redirect vhost inline."
    cat > "${REDIRECT_CONF}" <<EOF || rollback
# Installed by fix_www_vhost_conflict.sh on ${STAMP}.
# ${WWW_HOST} is not canonical: 301 everything to https://${CANONICAL}, keeping
# path and query (\$request_uri).

server {
    listen 80;
    listen [::]:80;
    server_name ${WWW_HOST};
    return 301 https://${CANONICAL}\$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${WWW_HOST};

    ssl_certificate     /etc/letsencrypt/live/${CERT_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${CERT_NAME}/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://${CANONICAL}\$request_uri;
}
EOF
    chmod 644 "${REDIRECT_CONF}"
fi

ln -sf "${REDIRECT_CONF}" "${REDIRECT_LINK}" || rollback
say "Enabled ${REDIRECT_LINK}"

# --- 3. One test, one reload --------------------------------------------------

say "Testing nginx config..."
if ! nginx -t; then
    echo "ERROR: nginx -t failed with the new config." >&2
    rollback
fi

say "Reloading nginx..."
if ! systemctl reload nginx; then
    echo "ERROR: nginx reload failed." >&2
    rollback
fi

# --- 4. Verify live -----------------------------------------------------------

say "Verifying..."
sleep 2

code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://${WWW_HOST}/" 2>/dev/null || echo 000)"
target="$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 15 "https://${WWW_HOST}/" 2>/dev/null || true)"
apex_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://${CANONICAL}/" 2>/dev/null || echo 000)"

echo "    https://${WWW_HOST}/  -> ${code} ${target}"
echo "    https://${CANONICAL}/ -> ${apex_code}"

if [[ "${code}" != "301" || "${target}" != "https://${CANONICAL}/" ]]; then
    echo "ERROR: expected 301 -> https://${CANONICAL}/, got ${code} -> '${target}'." >&2
    rollback
fi
if [[ "${apex_code}" != "200" ]]; then
    echo "ERROR: the apex stopped serving (got ${apex_code}) - the redirect is not worth a broken site." >&2
    rollback
fi

# Path preservation is the whole point: /mapasp/ is the URL Google flagged as
# "duplicate without user-selected canonical", and it has no canonical tag of
# its own, so only this redirect can resolve it.
for path in "/en/" "/mapasp/"; do
    p_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://${WWW_HOST}${path}" 2>/dev/null || echo 000)"
    p_target="$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 15 "https://${WWW_HOST}${path}" 2>/dev/null || true)"
    echo "    https://${WWW_HOST}${path} -> ${p_code} ${p_target}"
    if [[ "${p_code}" != "301" || "${p_target}" != "https://${CANONICAL}${path}" ]]; then
        echo "WARNING: ${path} did not redirect as expected (path may not be preserved)." >&2
    fi
done

echo ""
say "Done. https://${CANONICAL}/ is now the canonical host."
echo "    Backup of the previous main vhost: ${BACKUP}"
echo ""
echo "Next: in Search Console, open Indexação > Páginas >"
echo "  'Cópia sem página canônica selecionada pelo usuário' and click"
echo "  VALIDAR A CORREÇÃO to request a recrawl instead of waiting for one."
