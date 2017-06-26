#!/bin/bash

export LC_ALL=C
unset CDPATH

abspath() {
    if [ -d "$1" ]; then
        echo "$(cd "$1"; pwd)"
    else
        case "$1" in
            "" | ".") echo "$PWD";;
            /*) echo "$1";;
            *)  echo "$PWD/$1";;
        esac
    fi
}

if [ -z "$(type -t dirname)" ]; then
    # Compute the dirname of FILE.
    dirname () {
        case ${1} in
            */*) echo "${1%/*}${2}" ;;
            *  ) echo "${3}" ;;
        esac
    }
fi

die() {
    echo >&2 "Error: $@"
    exit 1
}

if type -p curl > /dev/null; then
    download() {
	echo "Download: $1 to: $2"
	curl -fLo "$2" "$1" && [ -e "$2" ]
    }
elif type -p wget > /dev/null; then
    download() {
	echo "Download: $1 to: $2"
	wget -O "$2" "$1" && [ -e "$2" ]
    }
else
    die "No download tool found, please install wget or curl"
fi

thisDir=$(abspath "$(dirname "$0")")
cd $thisDir

#download https://raw.githubusercontent.com/dmrub/portable-node/master/bin/install-node.sh ./install-node.sh
#chmod +x install-node.sh
# use local version
./install-node.sh -v8.1.2

export PATH="$thisDir/share/nodejs/node-v8.1.2-linux-x64/bin:$PATH"
npm install
