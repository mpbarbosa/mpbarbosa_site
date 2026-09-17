#!/bin/bash
#
# prod_deploy.sh
# --------------
# Purpose:   Full production deploy, started from your workstation.
#
#            Run it locally and it ships ITSELF to the prod host over SSM
#            (via run_on_prod_via_ssm.sh) and carries on running there. There
#            is nothing to run by hand on the box.
#
# Usage:     AWS_PROFILE=mpb ./shell_scripts/prod_deploy.sh [--dry-run] [--inspect]
#
#   --dry-run   Preview the remote copy without changing the webroot.
#   --inspect   Read-only: print the checkout layout and what the webroot
#               currently serves, then stop. Writes nothing.
#   --on-host   Internal. Set when the script is already running on the host;
#               do not pass it yourself.
#
# Why the path discovery: SSM runs commands as root, so `~` is /root, and the
# checkouts live in a normal user's home. The old version hardcoded
# ~/Documents/GitHub/mpbarbosa_site and died on line 4 as root. This one finds
# both checkouts wherever they are.
#
# Prerequisites: aws CLI authenticated (`aws login --profile mpb`).

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRODUCTION_DIR="${PRODUCTION_DIR:-/var/www/mpbarbosa.com}"
SEARCH_ROOTS=(/home /root /srv /opt)

ON_HOST=false
DRY_RUN=false
INSPECT=false
for arg in "$@"; do
    case "$arg" in
        --on-host) ON_HOST=true ;;
        --dry-run) DRY_RUN=true ;;
        --inspect) INSPECT=true ;;
        --help|-h) sed -n '2,28p' "${BASH_SOURCE[0]}"; exit 0 ;;
        *) echo "Unknown option: $arg" >&2; exit 2 ;;
    esac
done

# ---------------------------------------------------------------------------
# Local leg: hand the same script to the prod host and let it finish there.
# ---------------------------------------------------------------------------
if [ "$ON_HOST" = false ]; then
    RUNNER="$SCRIPT_DIR/run_on_prod_via_ssm.sh"
    if [ ! -x "$RUNNER" ]; then
        echo "ERROR: $RUNNER not found or not executable." >&2
        exit 1
    fi

    remote_args=(--on-host)
    [ "$DRY_RUN" = true ] && remote_args+=(--dry-run)
    [ "$INSPECT" = true ] && remote_args+=(--inspect)

    mode="deploy"; [ "$DRY_RUN" = true ] && mode="dry run"; [ "$INSPECT" = true ] && mode="inspect"
    echo "==> Running prod_deploy.sh ($mode) on the prod host via SSM"
    exec "$RUNNER" "${BASH_SOURCE[0]}" "${remote_args[@]}"
fi

# ---------------------------------------------------------------------------
# Remote leg: everything below this line runs on the prod host, as root.
# ---------------------------------------------------------------------------

# Root reading someone else's checkout trips git's ownership guard.
export GIT_CONFIG_COUNT=1
export GIT_CONFIG_KEY_0=safe.directory
export GIT_CONFIG_VALUE_0='*'

find_checkout() {
    # Echoes the first directory named $1 that is a git checkout.
    local name="$1" d
    for root in "${SEARCH_ROOTS[@]}"; do
        [ -d "$root" ] || continue
        while IFS= read -r d; do
            [ -d "$d/.git" ] && { echo "$d"; return 0; }
        done < <(find "$root" -maxdepth 5 -type d -name "$name" 2>/dev/null)
    done
    return 1
}

echo "==> On prod host as $(whoami)"

PUB_DIR="$(find_checkout 'mpbarbosa.com')" || true
SITE_DIR="$(find_checkout 'mpbarbosa_site')" || true

echo "    staging checkout (mpbarbosa.com): ${PUB_DIR:-NOT FOUND}"
echo "    source checkout (mpbarbosa_site): ${SITE_DIR:-NOT FOUND}"
echo "    production dir:                   $PRODUCTION_DIR"

if [ "$INSPECT" = true ]; then
    echo
    echo "=== staging HEAD ==="
    [ -n "$PUB_DIR" ] && git -C "$PUB_DIR" log --oneline -2
    echo
    echo "=== webroot ==="
    ls -ld "$PRODUCTION_DIR" 2>/dev/null
    ls -l "$PRODUCTION_DIR/cv/" 2>/dev/null | head
    echo
    echo "=== nginx roots in use ==="
    grep -rhn "root " /etc/nginx/sites-enabled/ 2>/dev/null | head
    exit 0
fi

if [ -z "$PUB_DIR" ]; then
    echo "ERROR: no mpbarbosa.com checkout on this host — nothing to publish from." >&2
    echo "       Searched: ${SEARCH_ROOTS[*]} (maxdepth 5)." >&2
    exit 1
fi

echo "==> Pulling staging in $PUB_DIR"
git -C "$PUB_DIR" pull || { echo "ERROR: git pull failed in $PUB_DIR" >&2; exit 1; }
echo "    now at: $(git -C "$PUB_DIR" log --oneline -1)"

if [ -z "$SITE_DIR" ]; then
    echo "ERROR: no mpbarbosa_site checkout on this host, so sync_to_staging.sh" >&2
    echo "       (which performs step 2) is unavailable. Clone it on the host," >&2
    echo "       or copy $PUB_DIR into $PRODUCTION_DIR by hand." >&2
    exit 1
fi

STEP2_ARGS=(--step2 --production-dir "$PRODUCTION_DIR")
[ "$DRY_RUN" = true ] && STEP2_ARGS+=(--dry-run)

echo "==> Step 2: staging -> $PRODUCTION_DIR"
"$SITE_DIR/shell_scripts/sync_to_staging.sh" "${STEP2_ARGS[@]}"
status=$?

if [ "$status" -eq 0 ] && [ "$DRY_RUN" = false ]; then
    echo "==> Deployed. Webroot check:"
    grep -c "time Scrum" "$PRODUCTION_DIR/cv/index.html" 2>/dev/null \
        | sed 's/^/    ocorrências de "time Scrum" em cv\/index.html: /'
fi

exit "$status"
