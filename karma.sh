#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Karma Server (https://github.com/karma-runner/karma/)"
echo "-------------------------------------------------------------------"

npm install
node_modules/karma/bin/karma start $BASE_DIR/src/test/ui/valintalaskenta-test.conf.js --browsers Chrome $*
