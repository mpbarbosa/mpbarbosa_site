#!/bin/bash
#
# run_on_prod_via_ssm.sh
# ----------------------
# Purpose:      Run a local shell script on the prod host via AWS SSM, without
#               SSH. RUN THIS FROM YOUR WORKSTATION.
#
#               SSH to this box is not usable: the instance has no EC2 key pair
#               (`KeyName: null`), so authorized_keys was populated by hand, and
#               neither `mpb` nor `ubuntu` authenticates from here. SSM needs no
#               key and no open port 22 — the agent dials out — so it is the
#               reliable path in. SSM commands run as root, so the script being
#               sent does not need (and should not use) sudo.
#
# Usage:        AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh <script> [args...]
#
#   script     Local path to the shell script to execute on the prod host.
#   args       Optional arguments passed through to it.
#
# Example:
#   AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh \
#       shell_scripts/fix_www_vhost_conflict.sh --dry-run
#
# Prerequisites: aws CLI authenticated (`aws login --profile mpb`; the SSO
#                session expires and every call fails until it is renewed);
#                python3; base64.
#
# What it does:
#   1. base64-encodes the local script (so quoting/newlines survive the trip).
#   2. Sends one SSM command that decodes it to a temp file and runs it.
#   3. Polls until the invocation finishes.
#   4. Prints the remote stdout and stderr, and exits with the remote exit code.
#
# Exit codes:
#   The remote script's exit code, or 1 if the invocation could not be run.

set -uo pipefail

INSTANCE_ID="${PROD_INSTANCE_ID:-i-0ca13c62d0d9d0d00}"

if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <local-script> [args...]" >&2
    exit 1
fi

SCRIPT_PATH="$1"; shift
REMOTE_ARGS="$*"

[[ -f "${SCRIPT_PATH}" ]] || { echo "ERROR: ${SCRIPT_PATH} not found." >&2; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "ERROR: aws CLI not found." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 not found." >&2; exit 1; }

echo "==> Sending $(basename "${SCRIPT_PATH}") to ${INSTANCE_ID} via SSM..."

# Build the SSM payload in python so quoting inside the script can't corrupt the
# JSON. The script travels base64-encoded for the same reason.
PAYLOAD="$(python3 - "${SCRIPT_PATH}" "${REMOTE_ARGS}" "${INSTANCE_ID}" <<'PY'
import base64, json, sys

path, args, instance = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path, 'rb') as fh:
    blob = base64.b64encode(fh.read()).decode()

remote = f"/tmp/{path.split('/')[-1]}"
commands = [
    "set -e",
    f"echo {blob} | base64 -d > {remote}",
    f"chmod +x {remote}",
    f"{remote} {args}".strip(),
]
json.dump({
    "InstanceIds": [instance],
    "DocumentName": "AWS-RunShellScript",
    "Comment": f"run {path.split('/')[-1]}"[:100],
    "Parameters": {"commands": commands, "executionTimeout": ["600"]},
}, sys.stdout)
PY
)" || { echo "ERROR: could not build the SSM payload." >&2; exit 1; }

TMP_JSON="$(mktemp)"
trap 'rm -f "${TMP_JSON}"' EXIT
printf '%s' "${PAYLOAD}" > "${TMP_JSON}"

CMD_ID="$(aws ssm send-command --cli-input-json "file://${TMP_JSON}" \
    --query 'Command.CommandId' --output text 2>&1)"
if [[ -z "${CMD_ID}" || "${CMD_ID}" == *"error"* || "${CMD_ID}" == "None" ]]; then
    echo "ERROR: send-command failed: ${CMD_ID}" >&2
    exit 1
fi
echo "    CommandId: ${CMD_ID}"

echo "==> Waiting for completion..."
STATUS="Pending"
for _ in $(seq 1 60); do
    sleep 3
    STATUS="$(aws ssm get-command-invocation --command-id "${CMD_ID}" \
        --instance-id "${INSTANCE_ID}" --query 'Status' --output text 2>/dev/null || echo Pending)"
    case "${STATUS}" in
        Success|Failed|Cancelled|TimedOut) break ;;
    esac
done

OUT="$(aws ssm get-command-invocation --command-id "${CMD_ID}" \
    --instance-id "${INSTANCE_ID}" --query 'StandardOutputContent' --output text 2>/dev/null)"
ERR="$(aws ssm get-command-invocation --command-id "${CMD_ID}" \
    --instance-id "${INSTANCE_ID}" --query 'StandardErrorContent' --output text 2>/dev/null)"
CODE="$(aws ssm get-command-invocation --command-id "${CMD_ID}" \
    --instance-id "${INSTANCE_ID}" --query 'ResponseCode' --output text 2>/dev/null)"

echo ""
echo "----- remote stdout -----------------------------------------------------"
[[ -n "${OUT}" && "${OUT}" != "None" ]] && echo "${OUT}"
if [[ -n "${ERR}" && "${ERR}" != "None" ]]; then
    echo "----- remote stderr -----------------------------------------------------"
    echo "${ERR}"
fi
echo "-------------------------------------------------------------------------"
echo "Status: ${STATUS}  (exit code ${CODE})"

[[ "${CODE}" =~ ^[0-9]+$ ]] || exit 1
exit "${CODE}"
