#!/bin/sh
set -e

node packages/app/server/lib/index.js db:auth --retry=30
node packages/app/server/lib/index.js install -s
node packages/app/server/lib/index.js upgrade -S
node packages/app/server/lib/index.js start 
