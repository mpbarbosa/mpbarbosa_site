#!/bin/bash
#
# aws_allow_my_ip.sh
# ------------------
# Purpose:      Re-point the SSH rule of the security group in front of
#               mpbarbosa.com at this machine's current public IP.
#
#               SSH here is pinned to the deployer's address, which on a home
#               connection is a dynamic lease that changes without warning. When
#               it does, ssh/plink to the host simply times out — the symptom
#               reads like a dead server, but it is the security group refusing
#               a stranger.
#
# Usage:        AWS_PROFILE=mpb ./shell_scripts/aws_allow_my_ip.sh [host]
#
#   host   Hostname or IP of the target box. Default: mpbarbosa.com
#
# Adapted from portal_brasileirao/scripts/aws-allow-my-ip.sh, with one
# deliberate difference. That script hardcodes SG_NAME=portal-brasileirao, and
# the Portal runs on a DIFFERENT instance from this site:
#
#   brasileirao.mpbarbosa.com -> 54.232.242.45 -> i-03a9afc8a469edc89
#                                                 sg: portal-brasileirao
#   mpbarbosa.com / copa2026  -> 18.229.20.196 -> i-0ca13c62d0d9d0d00
#                                                 sg: launch-wizard-1
#
# Running it unchanged from this repo would open the Portal box and leave this
# one shut. So this version resolves the instance from the host's public IP and
# derives the security group from the instance — there is no name to get wrong,
# and it keeps working if either box is ever replaced.
#
# Prerequisites: aws CLI authenticated (`aws login --profile mpb`; the SSO
#                session expires and every call fails until it is renewed);
#                curl; getent.
#
# What it does:
#   1. Resolves <host> to its public IP and finds the running EC2 instance
#      carrying it.
#   2. Picks that instance's security group that actually governs port 22.
#   3. Revokes every existing port-22 rule on it.
#   4. Authorizes port 22 from this machine's current IP only.
#
# Locked out anyway? SSH is not the only way in. If the instance carries an SSM
# instance profile, this works regardless of IP or security group:
#
#     aws ssm start-session --target <instance-id>
#
# The script prints the instance id so that fallback is one copy away.
#
# Exit codes:
#   0  SSH rule now points at this machine (or already did).
#   1  Host/instance/group not resolved, or an AWS call failed.

set -euo pipefail

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    sed -n '2,50p' "$0" | sed 's/^# \{0,1\}//'
    exit 0
fi

TARGET_HOST="${1:-mpbarbosa.com}"

# --- Resolve the target box ---------------------------------------------------
target_ip="$(getent hosts "$TARGET_HOST" | awk '{print $1}' | head -1)"
if [[ -z "$target_ip" ]]; then
    echo "Error: could not resolve ${TARGET_HOST}." >&2
    exit 1
fi

# shellcheck disable=SC2016  # backticks are JMESPath literals, not shell
read -r instance_id sg_ids <<<"$(aws ec2 describe-instances \
    --filters "Name=ip-address,Values=${target_ip}" \
              "Name=instance-state-name,Values=running" \
    --query 'Reservations[0].Instances[0].[InstanceId, join(` `, SecurityGroups[].GroupId)]' \
    --output text)"

if [[ -z "${instance_id:-}" || "$instance_id" == "None" ]]; then
    echo "Error: no running instance found with public IP ${target_ip}." >&2
    echo "Check the account and region (AWS_PROFILE / AWS_REGION)." >&2
    exit 1
fi

echo "==> ${TARGET_HOST} -> ${target_ip} -> ${instance_id}"

# --- Pick the group that actually governs port 22 -----------------------------
ssh_group=""
for sg in $sg_ids; do
    # shellcheck disable=SC2016  # backticks are JMESPath literals, not shell
    has22="$(aws ec2 describe-security-groups --group-ids "$sg" \
        --query 'length(SecurityGroups[0].IpPermissions[?FromPort==`22`])' \
        --output text)"
    if [[ "$has22" != "0" ]]; then
        if [[ -n "$ssh_group" ]]; then
            echo "Error: more than one security group on ${instance_id} has a" >&2
            echo "port-22 rule (${ssh_group}, ${sg}). Resolve by hand rather than" >&2
            echo "let this script guess which one guards SSH." >&2
            exit 1
        fi
        ssh_group="$sg"
    fi
done

if [[ -z "$ssh_group" ]]; then
    # No port-22 rule anywhere yet: fall back to the instance's only group, but
    # refuse to guess when it has several.
    read -ra sg_arr <<<"$sg_ids"
    if [[ "${#sg_arr[@]}" -ne 1 ]]; then
        echo "Error: no port-22 rule on any group of ${instance_id}, and it has" >&2
        echo "${#sg_arr[@]} groups (${sg_ids}). Pick one and add the rule by hand." >&2
        exit 1
    fi
    ssh_group="${sg_arr[0]}"
    echo "==> No existing SSH rule; will open port 22 on ${ssh_group}."
fi

my_ip="$(curl -fsS --max-time 15 https://checkip.amazonaws.com | tr -d '\n')"
if [[ -z "$my_ip" ]]; then
    echo "Error: could not determine this machine's public IP." >&2
    exit 1
fi

echo "==> Security group  : ${ssh_group}"
echo "==> Current public IP: ${my_ip}"

# shellcheck disable=SC2016  # backticks are JMESPath literals, not shell
existing="$(aws ec2 describe-security-groups --group-ids "$ssh_group" \
    --query 'SecurityGroups[0].IpPermissions[?FromPort==`22`].IpRanges[].CidrIp' \
    --output text)"

if [[ "$existing" == *"${my_ip}/32"* ]]; then
    echo "Already authorized — nothing to do."
    echo "SSM fallback: aws ssm start-session --target ${instance_id}"
    exit 0
fi

for cidr in $existing; do
    echo "--> revoking SSH from ${cidr}"
    aws ec2 revoke-security-group-ingress --group-id "$ssh_group" \
        --protocol tcp --port 22 --cidr "$cidr" > /dev/null
done

echo "--> authorizing SSH from ${my_ip}/32"
aws ec2 authorize-security-group-ingress --group-id "$ssh_group" \
    --ip-permissions "IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges=[{CidrIp=${my_ip}/32,Description=deployer}]" \
    > /dev/null

echo "Done."
echo "SSM fallback (IP-independent): aws ssm start-session --target ${instance_id}"
