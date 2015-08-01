#!/usr/bin/env bash

trap "pm2 delete all > /dev/null 2>&1" EXIT

echo 'Press [CMD+C] to stop servers...'
while :
do
    sleep 1
done
