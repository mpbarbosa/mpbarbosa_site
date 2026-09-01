#!/bin/bash
#
# setup_www_redirect.sh
# ---------------------
# Purpose:      Enforce mpbarbosa.com (bare apex) as the canonical host by
#               301-redirecting www.mpbarbosa.com to it. Before this runs, both
#               hosts answer 200 with identical content — duplicate content that
#               splits ranking signals between two URLs for every page.
#               RUN THIS ON THE PROD HOST.
#
#               Supersedes setup_apex_redirect.sh, which redirected the apex to
#               www. That direction contradicted every canonical the site emits.
#               The AdSense "ads.txt — Não encontrado" it was written for is
#               already fixed: the apex resolves and serves /ads.txt directly.
#
# Usage:        ./shell_scripts/setup_www_redirect.sh [www-host] [canonical] [cert-name]
#
#   www-host   Host to redirect away.              Default: www.mpbarbosa.com
#   canonical  Redirect target (the real site).    Default: mpbarbosa.com
#   cert-name  certbot lineage covering both.      Default: www.mpbarbosa.com
#
# Prerequisites:
#   - sudo access; nginx running.
#   - The certificate already covers BOTH names. It does today:
#     CN=www.mpbarbosa.com, SAN: DNS:mpbarbosa.com, DNS:www.mpbarbosa.com.
#     No certbot expansion is needed, so this script never calls certbot.
#   - The main vhost must serve the apex. If it still lists both names
#     (`server_name mpbarbosa.com www.mpbarbosa.com;`), www would match two
#     server blocks and nginx would resolve the tie by load order. This script
#     refuses to proceed in that case and tells you which file to edit.
#
# What it does:
#   1. Pre-flight: nginx present, both hosts resolve, cert lineage exists and
#      covers both names, and no other enabled vhost still claims <www-host>.
#   2. Idempotent: exits cleanly when the redirect vhost is already installed.
#   3. Installs shell_scripts/nginx/mpbarbosa-www-redirect.conf, tests, reloads.
#   4. Verifies the live redirect actually returns 301 to the canonical host.
#
# Exit codes:
#   0  Success (or already configured).
#   1  Prerequisite check failed, or nginx failed to test/reload.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

WWW_HOST="${1:-www.mpbarbosa.com}"
CANONICAL="${2:-mpbarbosa.com}"
CERT_NAME="${3:-www.mpbarbosa.com}"

CONF_SRC="${SCRIPT_DIR}/nginx/mpbarbosa-www-redirect.conf"
CONF_FILE="/etc/nginx/sites-available/${WWW_HOST}"
CERT_LIVE_DIR="/etc/letsencrypt/live/${CERT_NAME}"
CERT_FULLCHAIN="${CERT_LIVE_DIR}/fullchain.pem"

# --- Pre-flight ---------------------------------------------------------------
if ! command -v nginx >/dev/null 2>&1; then
    echo "ERROR: nginx is not installed. Run this on the prod host." >&2
    exit 1
fi
if [[ ! -f "${CONF_SRC}" ]]; then
    echo "ERROR: ${CONF_SRC} not found." >&2
    exit 1
fi
for host in "${WWW_HOST}" "${CANONICAL}"; do
    if ! getent ahosts "${host}" >/dev/null 2>&1; then
        echo "ERROR: ${host} does not resolve." >&2
        exit 1
    fi
done
if ! sudo test -f "${CERT_FULLCHAIN}"; then
    echo "ERROR: certificate lineage '${CERT_NAME}' not found at ${CERT_LIVE_DIR}." >&2
    echo "See: sudo certbot certificates" >&2
    exit 1
fi

cert_covers() {
    sudo openssl x509 -in "${CERT_FULLCHAIN}" -noout -text 2>/dev/null \
        | grep -Fq "DNS:$1"
}
for host in "${WWW_HOST}" "${CANONICAL}"; do
    if ! cert_covers "${host}"; then
        echo "ERROR: certificate '${CERT_NAME}' does not cover ${host}." >&2
        echo "Expand it first:" >&2
        echo "  sudo certbot certonly --nginx --cert-name ${CERT_NAME} --expand \\" >&2
        echo "    -d ${CANONICAL} -d ${WWW_HOST}" >&2
        exit 1
    fi
done

# --- Refuse to create an ambiguous server_name match --------------------------
# Any OTHER enabled vhost that still claims WWW_HOST would compete with the
# redirect block; nginx would pick by load order, not intent.
conflicts="$(sudo grep -RlE "^[[:space:]]*server_name[^;]*(^|[[:space:]])${WWW_HOST//./\\.}([[:space:]]|;)" \
    /etc/nginx/sites-enabled/ 2>/dev/null \
    | grep -v "/${WWW_HOST}\$" || true)"
if [[ -n "${conflicts}" ]]; then
    echo "ERROR: another enabled vhost still claims ${WWW_HOST}:" >&2
    echo "${conflicts}" | sed 's/^/  /' >&2
    echo "" >&2
    echo "Edit it so the site is served on ${CANONICAL} only, e.g." >&2
    echo "  server_name ${CANONICAL} ${WWW_HOST};   ->   server_name ${CANONICAL};" >&2
    echo "then re-run this script." >&2
    exit 1
fi

# --- Idempotent skip ----------------------------------------------------------
if sudo test -L "/etc/nginx/sites-enabled/${WWW_HOST}" \
    && sudo cmp -s "${CONF_SRC}" "${CONF_FILE}"; then
    echo "✓ Redirect already configured: ${WWW_HOST} -> https://${CANONICAL}"
    exit 0
fi

# --- Install ------------------------------------------------------------------
echo "==> Installing redirect vhost from ${CONF_SRC} (requires sudo)..."
sudo install -m 644 "${CONF_SRC}" "${CONF_FILE}"
sudo ln -sf "${CONF_FILE}" "/etc/nginx/sites-enabled/${WWW_HOST}"
sudo nginx -t
sudo systemctl reload nginx

# --- Verify -------------------------------------------------------------------
echo "==> Verifying..."
code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://${WWW_HOST}/" || echo 000)"
target="$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 15 "https://${WWW_HOST}/" || true)"
if [[ "${code}" == "301" && "${target}" == "https://${CANONICAL}/" ]]; then
    echo ""
    echo "✓ Redirect live: https://${WWW_HOST}/ -> ${target} (301)"
    echo "  Canonical host is now https://${CANONICAL}/"
else
    echo "" >&2
    echo "WARNING: expected 301 -> https://${CANONICAL}/, got ${code} -> '${target}'." >&2
    echo "  Check that no other vhost answers for ${WWW_HOST}." >&2
    exit 1
fi
