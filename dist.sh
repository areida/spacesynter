#!/usr/bin/env bash

mkdir dist
zip -r dist/`git rev-parse --abbrev-ref HEAD`-`git rev-parse HEAD | head -c 10` \
    application \
    build \
    docker \
    Dockerfile \
    node_modules \
    server \
    templates \
    -x "node_modules/babel-core/*" \
    "node_modules/babel-loader/*" \
    "node_modules/chai/*" \
    "node_modules/es5-shim/*" \
    "node_modules/karma/*" \
    "node_modules/karma-chrome-launcher/*" \
    "node_modules/karma-firefox-launcher/*" \
    "node_modules/karma-mocha/*" \
    "node_modules/karma-phantomjs-launcher/*" \
    "node_modules/karma-sinon-chai/*" \
    "node_modules/karma-sourcemap-loader/*" \
    "node_modules/karma-webpack/*" \
    "node_modules/mocha/*" \
    "node_modules/react-tools/*" \
    "node_modules/sinon/*" \
    "node_modules/sinon-chai/*" \
    "node_modules/css-loader/*" \
    "node_modules/6to5-core/*" \
    "node_modules/6to5-loader/*" \
    "node_modules/extract-text-webpack-plugin/*" \
    "node_modules/file-loader/*" \
    "node_modules/html-webpack-plugin/*" \
    "node_modules/json-loader/*" \
    "node_modules/jshint/*" \
    "node_modules/jshint-loader/*" \
    "node_modules/jsx-loader/*" \
    "node_modules/jsxhint-loader/*" \
    "node_modules/raw-loader/*" \
    "node_modules/react-hot-loader/*" \
    "node_modules/sass-loader/*" \
    "node_modules/style-loader/*" \
    "node_modules/url-loader/*" \
    "node_modules/webpack/*" \
    "node_modules/webpack-dev-server/*" \
    "node_modules/webpack-error-notification/*" \
    "node_modules/docker.io/*" \
    "node_modules/mongodb/*"
