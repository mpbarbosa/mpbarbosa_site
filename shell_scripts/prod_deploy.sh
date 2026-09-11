#!/bin/bash
#
# prod_deploy.sh: RETIRED. It refuses to run; the file stays so the old command
# explains itself instead of failing obscurely.
#
# It used to `cd ~/Documents/GitHub/mpbarbosa_site`, `git pull` the staging repo
# and run `sync_to_staging.sh --step2 --production-dir /var/www/mpbarbosa.com`.
# On the real prod host that was wrong twice over:
#
#   - Production already deploys itself. ubuntu's cron runs
#     ~/Documents/GitHub/devops/scripts/git_sync.sh every 10 minutes; when it
#     pulls the staging repo it runs devops/copa_2026/prod_deploy.sh, which runs
#     that same --step2, as ubuntu. Pushing the staging repo IS the deploy.
#   - Run through SSM it runs as root, so `~` is /root and it died on its first
#     `cd`. Had it got further, `git pull` as root would have left root-owned
#     object directories in ubuntu's staging clone that the cron's pulls cannot
#     write into, and --step2 as root restarts nginx and the unrelated
#     busca_vagas_node_app service.
#
# See CLAUDE.md, "Deployment model".

cat >&2 <<'EOF'
prod_deploy.sh is retired: mpbarbosa.com production deploys itself.

  1. ./shell_scripts/sync_to_staging.sh --step1        (on your workstation)
  2. cd ../mpbarbosa.com && git add -A && git commit && git push
  3. Within ~10 minutes ubuntu's cron on the prod host pulls the staging repo
     and runs sync_to_staging.sh --step2 into /var/www/mpbarbosa.com.

Did it land?
  AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh shell_scripts/check_prod_deploy.sh

Never run sync_to_staging.sh --step2 on the prod host as root.
EOF
exit 1
