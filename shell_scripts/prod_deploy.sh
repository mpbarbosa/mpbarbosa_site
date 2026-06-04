#!/bin/bash

pwd
cd Documents/GitHub/mpbarbosa_site
pwd
cd ../mpbarbosa.com && git pull && cd ../mpbarbosa_site
pwd
./shell_scripts/sync_to_staging.sh --step2 --production-dir "/var/www/mpbarbosa.com"

