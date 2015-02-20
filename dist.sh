#!/usr/bin/env bash

rm -rf ./build && \
APP_ENV=production webpack -p && \
zip -r `git rev-parse --abbrev-ref HEAD`-`git rev-parse HEAD | head -c 10` \
    application \
    build \
    docker \
    Dockerfile \
    node_modules \
    server \
    server.js \
    templates \
    -x node_modules/chai/**\* \
    -x node_modules/es5-shim/**\* \
    -x node_modules/karma/**\* \
    -x node_modules/karma-chrome-launcher/**\* \
    -x node_modules/karma-firefox-launcher/**\* \
    -x node_modules/karma-mocha/**\* \
    -x node_modules/karma-phantomjs-launcher/**\* \
    -x node_modules/karma-sinon-chai/**\* \
    -x node_modules/karma-sourcemap-loader/**\* \
    -x node_modules/karma-webpack/**\* \
    -x node_modules/mocha/**\* \
    -x node_modules/react-tools/**\* \
    -x node_modules/sinon/**\* \
    -x node_modules/sinon-chai/**\* \
    -x node_modules/css-loader/**\* \
    -x node_modules/6to5-core/**\* \
    -x node_modules/6to5-loader/**\* \
    -x node_modules/extract-text-webpack-plugin/**\* \
    -x node_modules/file-loader/**\* \
    -x node_modules/html-webpack-plugin/**\* \
    -x node_modules/json-loader/**\* \
    -x node_modules/jshint-loader/**\* \
    -x node_modules/jsx-loader/**\* \
    -x node_modules/jsxhint-loader/**\* \
    -x node_modules/raw-loader/**\* \
    -x node_modules/react-hot-loader/**\* \
    -x node_modules/sass-loader/**\* \
    -x node_modules/style-loader/**\* \
    -x node_modules/url-loader/**\* \
    -x node_modules/webpack/**\* \
    -x node_modules/webpack-dev-server/**\* \
    -x node_modules/webpack-error-notification/**\* 