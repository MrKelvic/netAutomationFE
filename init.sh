#!/bin/bash

cur_path=$(pwd)

if [ ! -d $cur_path/"node_modules" ]; then
    echo "Running NPM install "
    npm i --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "Failed to install npm packages "
        exit 0
    fi
fi

npm run serve