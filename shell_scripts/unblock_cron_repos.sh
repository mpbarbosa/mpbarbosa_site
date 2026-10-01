#!/bin/bash
#
# unblock_cron_repos.sh
# ---------------------
# Clears the local modifications that make the git_sync cron skip `devops`
# (11 commits behind) and `dotfiles` (148 behind) — WITHOUT discarding anything.
#
# For each repo, two recoverable copies are kept instead of `git checkout --`:
#   1. a plain file copy under /tmp, OUTSIDE the repo — an untracked file left
#      inside would itself count as a local change and re-block the cron;
#   2. a git stash entry, so `git stash pop` restores the exact working state.
#
# Deliberately does NOT touch guia_turistico. Its GitHub remote is gone and no
# copy was found on the dev laptop, so that checkout may be the only surviving
# copy of the project; its fetch error is harmless and is not worth a blind fix.
#
# Every git command runs as ubuntu. SSM sessions are root, and root-written
# files in these ubuntu-owned checkouts are exactly what stops ubuntu's own
# pulls afterwards.

set -uo pipefail

ROOT="/home/ubuntu/Documents/GitHub"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
rc=0

as_ubuntu() { sudo -u ubuntu -H "$@"; }

unblock() {
    local repo="$1" file="$2"
    local dir="$ROOT/$repo"
    local base backup
    base="$(basename "$file")"
    backup="/tmp/${repo}-${base}.${STAMP}.bak"

    echo "==============================================="
    echo "== $repo"

    if [[ ! -d "$dir/.git" ]]; then
        echo "  no checkout at $dir — skipping"; rc=1; return
    fi

    echo "-- before --"
    as_ubuntu git -C "$dir" status --porcelain | sed 's/^/   /'
    echo "   behind origin/main: $(as_ubuntu git -C "$dir" rev-list --count HEAD..origin/main 2>/dev/null)"

    if [[ -z "$(as_ubuntu git -C "$dir" status --porcelain)" ]]; then
        echo "   already clean — nothing to do"; return
    fi

    echo "-- 1. backup outside the repo --"
    if as_ubuntu cp -p "$dir/$file" "$backup" 2>/dev/null; then
        echo "   $backup ($(stat -c %s "$backup" 2>/dev/null) bytes)"
    else
        echo "   FAILED to back up — leaving $repo untouched" >&2; rc=1; return
    fi

    echo "-- 2. stash (recoverable) --"
    if as_ubuntu git -C "$dir" stash push --quiet -- "$file"; then
        as_ubuntu git -C "$dir" stash list | head -2 | sed 's/^/   /'
    else
        echo "   FAILED to stash — backup kept at $backup" >&2; rc=1; return
    fi

    echo "-- after --"
    local left bad
    left="$(as_ubuntu git -C "$dir" status --porcelain)"
    if [[ -z "$left" ]]; then
        echo "   CLEAN — the cron will pull on its next run"
    else
        echo "   STILL DIRTY, cron will keep skipping:"
        # shellcheck disable=SC2001  # prefixing every line, not one substitution
        echo "$left" | sed 's/^/     /'
        rc=1
    fi

    bad="$(find "$dir/.git" -maxdepth 2 ! -user ubuntu -printf '%u %p\n' 2>/dev/null | head -3)"
    if [[ -z "$bad" ]]; then
        echo "   .git ownership clean"
    else
        echo "   ROOT-OWNED IN .git:"
        # shellcheck disable=SC2001
        echo "$bad" | sed 's/^/     /'
        rc=1
    fi
    echo "   undo: sudo -u ubuntu -H git -C $dir stash pop"
}

unblock devops   output.txt
unblock dotfiles nginx/etc/nginx/sites-available/mpbarbosa.com

echo
echo "==============================================="
echo "== Left alone on purpose =="
echo "  guia_turistico — remote deleted on GitHub, no copy on the dev laptop."
echo "  Possibly the only surviving copy. Its fetch error is harmless."
echo
echo "exit=$rc"
exit "$rc"
