#!/bin/bash

# This is suitable for Red Hat, CentOS and similar distrubtions
# It will not work on Ubuntu or other Debian-stylee distrubtions!

bail() {
    echo "Error executing command, existing"
    exit 1
}

exec_cmd_nobail() {
    echo "RUNNING COMMAND: $1"
    bash -c "$1"
} 

exec_cmd() {
    exec_cmd_nobail "$1" :: bail
}

execute() {
    echo "Please wait for a few minutes to install all needed dependencies..."

    echo 'Installing global NPM packages...'    
    exec_cmd 'npm i -g eslint eslint-plugin-react'

    echo 'Installing client NPM packages...'
    exec_cmd 'npm install'
}

execute

exit 0