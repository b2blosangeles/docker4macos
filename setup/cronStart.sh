#!/bin/bash

DOCKERCMD=$1
SCRIPTDIR=$(cd `dirname $0` && pwd)
ROOTPATH="$(dirname "$SCRIPTDIR")"

sts=1
until [ $sts == 0 ]
do 
     docker_state=$($DOCKERCMD ps -q &> /dev/null)
     status=$?
     sts=$status
     echo "Wait 1 sec as $DOCKERCMD is not ready ..."
     sleep 1
done

echo "\n=== $(date +"%m/%d/%Y %H:%M:%S") -- Running -- adminServer.sh and proxyServer.sh ==="

fnAdmin=$ROOTPATH/_localChannel/bootup/adminServer.sh
fnProxy=$ROOTPATH/_localChannel/bootup/proxyServer.sh

COMM="sh $fnProxy $ROOTPATH $DOCKERCMD && sh $fnAdmin $ROOTPATH $DOCKERCMD"
eval " $COMM"

echo "===$(date +"%m/%d/%Y %H:%M:%S") -- Done -- adminServer.sh and proxyServer.sh ===\n\n"