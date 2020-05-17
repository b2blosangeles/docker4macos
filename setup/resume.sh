#!/bin/bash

DOCKERCMD=$(command -v docker)

SCRIPTDIR=$(cd `dirname $0` && pwd)
ROOTPATH="$(dirname "$SCRIPTDIR")"

if [ $DOCKERCMD == '' ]; then
    echo "Error : Docker installation and running is required!"
    exit 0
fi

if [ $USER != $SUDO_USER ] && [ $USER == "root" ] ;
then

    docker network rm network_ui_app &> /dev/null

    docker network create \
        --driver=bridge \
        --subnet=10.10.10.0/16 \
        --ip-range=10.10.10.0/24 \
        --gateway=10.10.10.254 \
        network_ui_app &> /dev/null
        
    fnAdmin=$ROOTPATH/_localChannel/bootup/adminServer.sh
    fnProxy=$ROOTPATH/_localChannel/bootup/proxyServer.sh

    COMM="sh $fnProxy $ROOTPATH $DOCKERCMD && sh $fnAdmin $ROOTPATH $DOCKERCMD"
    eval " $COMM"
    echo "Success : Done!"
else
    echo "Error : Need sudo run the command!"
fi
