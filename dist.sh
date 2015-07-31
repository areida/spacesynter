#!/usr/bin/env bash

# `git rev-parse --abbrev-ref HEAD`-`git rev-parse HEAD | head -c 10`
mkdir -p dist
zip -r dist/app \
    application \
    build \
    docker \
    Dockerfile \
    server \
    templates \
    node_modules/blueimp-tmpl \
    node_modules/body-parser \
    node_modules/connect-redis \
    node_modules/cookie-parser \
    node_modules/express \
    node_modules/express-session \
    node_modules/lodash \
    node_modules/minimist \
    node_modules/node-resque \
    node_modules/openport \
    node_modules/q \
    node_modules/querystring \
    node_modules/request \
    node_modules/synapse-common
