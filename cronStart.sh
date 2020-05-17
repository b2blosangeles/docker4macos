#!/bin/bash
DOCKERCMD=$1
BASEDIR="$( cd "$( dirname "$0" )" && pwd )"

sts=1
until [ $sts == 0 ]
do 
     docker_state=$($DOCKERCMD ps -q &> /dev/null)
     status=$?
     sts=$status
     echo "Wait 1 sec as $DOCKERCMD is not ready ..."
     sleep 1
done

fnAdmin=$BASEDIR/_localChannel/bootup/adminServer.sh
fnProxy=$BASEDIR/_localChannel/bootup/proxyServer.sh

COMM="sh $fnProxy $BASEDIR $DOCKERCMD && sh $fnAdmin $BASEDIR $DOCKERCMD"
eval " $COMM"
