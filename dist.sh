#!/usr/bin/env bash

mkdir dist
zip -r dist/`git rev-parse --abbrev-ref HEAD`-`git rev-parse HEAD | head -c 10` \
    application/config \
    application/config.js \
    build \
    docker \
    Dockerfile \
    server \
    templates \
    node_modueles/body-parser \
    node_modueles/connect-redis \
    node_modules/cookie-parser \
    node_modules/express \
    node_modules/express-session \
    node_modules/lodash \
    node_modules/mongoose \
    node_modules/q \
    node_modules/querystring \
    node_modules/request \
    node_modules/synapse-common \
    > /dev/null