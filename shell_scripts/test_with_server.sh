#!/bin/bash
#
# test_with_server.sh
# -------------------
# Purpose:      Run the full Jest suite with a dev server up for the duration,
#               then tear it down. The accessibility project drives a real
#               Chrome against http://127.0.0.1:8080, so without a server its 26
#               tests fail; every other project passes regardless.
#
# Usage:        ./shell_scripts/test_with_server.sh [extra jest args...]
#
# Why a script rather than a one-liner:
#
#   - `live-server` does NOT fail when its port is taken. It prints "already in
#     use. Trying another port." and serves somewhere else, so a pasted
#     one-liner can report a green suite that was served by something entirely
#     different — or hang waiting on a port nothing will ever answer. This
#     script refuses to start a second server and says which case it is in.
#   - Waiting on the server with `sleep 2` races it. This polls until it
#     actually answers, and gives up with a clear message instead of hanging.
#   - The `until ...; do` form gets mangled when pasted through layers that
#     escape the `;` after a URL.
#   - It runs from the repo root no matter where it is invoked from.
#
# Exit codes: the suite's own exit code, or 1 if the server never came up.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT=8080
URL="http://127.0.0.1:${PORT}/"
STARTED_SERVER=0
SERVER_PID=""
LOG="$(mktemp -t live-server.XXXXXX.log)"

# shellcheck disable=SC2329  # invoked indirectly, by the EXIT trap below
cleanup() {
    if [[ "$STARTED_SERVER" == "1" && -n "${SERVER_PID:-}" ]]; then
        echo "==> Stopping the dev server (pid ${SERVER_PID})..."
        kill "$SERVER_PID" 2>/dev/null
        wait "$SERVER_PID" 2>/dev/null
    fi
}
trap cleanup EXIT

if curl -sfo /dev/null --max-time 3 "$URL"; then
    echo "==> Something already serves ${URL} — using it, and leaving it running."
else
    echo "==> Starting live-server on ${PORT}..."
    # Invoke the binary directly rather than through npx. npx stays in the
    # process tree as the parent and spawns live-server as a child, so $! is
    # npx's pid and killing it leaves the real server holding the port — a
    # second run then finds 8080 busy and silently reuses an orphan.
    LIVE_SERVER="$REPO_ROOT/src/node_modules/.bin/live-server"
    if [[ ! -x "$LIVE_SERVER" ]]; then
        echo "ERROR: $LIVE_SERVER not found. Run 'npm install' in src/." >&2
        exit 1
    fi
    ( cd "$REPO_ROOT/src" && exec "$LIVE_SERVER" --port="$PORT" --no-browser ) \
        > "$LOG" 2>&1 &
    SERVER_PID=$!
    STARTED_SERVER=1

    # live-server migrates ports instead of failing, so trust the probe, not it.
    for _ in $(seq 1 60); do
        curl -sfo /dev/null --max-time 2 "$URL" && break
        kill -0 "$SERVER_PID" 2>/dev/null || break
        sleep 0.5
    done

    if ! curl -sfo /dev/null --max-time 3 "$URL"; then
        echo "ERROR: nothing is answering ${URL} after 30s." >&2
        if grep -qi 'already in use' "$LOG" 2>/dev/null; then
            echo "  live-server moved to another port rather than failing:" >&2
            grep -i 'serving\|already in use' "$LOG" | sed 's/^/    /' >&2
        else
            tail -5 "$LOG" | sed 's/^/    /' >&2
        fi
        exit 1
    fi
    echo "==> Server is answering."
fi

echo "==> Running the suite..."
( cd "$REPO_ROOT/src" && npm test -- "$@" )
exit $?
