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
cd $DIR

#download https://raw.githubusercontent.com/dmrub/portable-node/master/bin/install-node.sh ./install-node.sh
#chmod +x install-node.sh
# use local version
./install-node.sh -v8.1.2

export PATH="./share/nodejs/node-v8.1.2-linux-x64/bin:$PATH"
npm install
