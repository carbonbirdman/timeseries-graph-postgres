#!/bin/bash --login
# login is important for ensuring configuration is loaded
set -euo pipefail
cd /home/birdman/app
exec yarn start >>  /home/birdman/app/server.log
