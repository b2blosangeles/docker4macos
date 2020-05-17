#!/bin/bash

DOCKERCMD=$1
ROOTPATH="$(dirname "$PWD")"

sts=1
until [ $sts == 0 ]
do 
     docker_state=$($DOCKERCMD ps -q &> /dev/null)
     status=$?
     sts=$status
     echo "Wait 1 sec as $DOCKERCMD is not ready ..."
     sleep 1
done

echo "running adminServer.sh and proxyServer.sh"

fnAdmin=$ROOTPATH/_localChannel/bootup/adminServer.sh
fnProxy=$ROOTPATH/_localChannel/bootup/proxyServer.sh

COMM="sh $fnProxy $ROOTPATH $DOCKERCMD && sh $fnAdmin $ROOTPATH $DOCKERCMD"
eval " $COMM"

echo "Done adminServer.sh and proxyServer.sh"