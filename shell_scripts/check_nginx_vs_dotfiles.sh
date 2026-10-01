#!/bin/bash
#
# check_nginx_vs_dotfiles.sh
# --------------------------
# Read-only. Answers whether the dotfiles repo still records the nginx vhost the
# server is actually serving.
#
# The dotfiles checkout tracks nginx/etc/nginx/sites-available/mpbarbosa.com,
# but nothing installs from it — the setup_* scripts write /etc/nginx directly.
# So the two drift silently, and the repo can end up documenting a configuration
# that has not been live for months.
#
# Run via: AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh \
#            shell_scripts/check_nginx_vs_dotfiles.sh

set -uo pipefail

REPO_FILE="/home/ubuntu/Documents/GitHub/dotfiles/nginx/etc/nginx/sites-available/mpbarbosa.com"
LIVE_FILE="/etc/nginx/sites-available/mpbarbosa.com"
DOTFILES="/home/ubuntu/Documents/GitHub/dotfiles"

export GIT_OPTIONAL_LOCKS=0 GIT_CONFIG_COUNT=1 \
       GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0='*'

echo "== dotfiles checkout =="
echo "  HEAD    : $(git -C "$DOTFILES" log -1 --format='%h %cs %s' 2>&1)"
echo "  behind  : $(git -C "$DOTFILES" rev-list --count HEAD..origin/main 2>/dev/null) commit(s)"
echo "  dirty   : $(git -C "$DOTFILES" status --porcelain | wc -l) path(s)"
echo "  stashes : $(git -C "$DOTFILES" stash list | wc -l)"

echo
echo "== Files =="
for f in "$REPO_FILE" "$LIVE_FILE"; do
    if [[ -r "$f" ]]; then
        printf '  %-78s %6s bytes  %s\n' "$f" "$(stat -c %s "$f")" "$(stat -c %y "$f" | cut -d. -f1)"
    else
        printf '  %-78s MISSING/UNREADABLE\n' "$f"
    fi
done

echo
echo "== repo  vs  live =="
if [[ ! -r "$REPO_FILE" || ! -r "$LIVE_FILE" ]]; then
    echo "  cannot compare"
elif diff -q "$REPO_FILE" "$LIVE_FILE" >/dev/null 2>&1; then
    echo "  IDENTICAL — the repo records what is being served"
else
    echo "  DIFFERS ('<' = repo, '>' = live):"
    diff "$REPO_FILE" "$LIVE_FILE" | sed 's/^/    /'
fi

echo
echo "== Sanity: what is actually enabled =="
# shellcheck disable=SC2012  # these names are ours and plain; -l shows the symlink targets
ls -l /etc/nginx/sites-enabled/ 2>&1 | sed 's/^/  /'
echo
echo "-- server_name lines in the live vhosts --"
grep -Hn 'server_name' /etc/nginx/sites-available/mpbarbosa.com \
                        /etc/nginx/sites-available/www.mpbarbosa.com 2>/dev/null \
    | sed 's/^/  /'
