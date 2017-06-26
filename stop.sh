#!/bin/bash

export LC_ALL=C

if [ -z "$(type -t dirname)" ]; then
    # Compute the dirname of FILE.
    dirname () {
        case ${1} in
            */*) echo "${1%/*}${2}" ;;
            *  ) echo "${3}" ;;
        esac
    }
fi

DIR="`dirname $0`"

export PM2_HOME="$DIR/.pm2"

$DIR/node-v8.1.2-linux-x64 $DIR/node_modules/.bin/pm2 stop ws2tcp
