#!/bin/bash

export PM2_HOME=".pm2"

./node-v8.1.2-linux-x64 node_modules/.bin/pm2 stop ws2tcp
