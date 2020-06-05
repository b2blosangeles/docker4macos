#!/bin/bash
DOCKERCMD=$1

SCRIPTDIR=$(cd `dirname $0` && pwd)
ROOTPATH="$(dirname "$SCRIPTDIR")"
DATAPATH="$(dirname "$ROOTPATH")"/data

mkdir -p $DATAPATH/tasks
folder=$DATAPATH/tasks
mkdir -p /tmp/_localChannel
markfile=/tmp/_localChannel/mark.data

cmd="$DOCKERCMD -v &> /dev/null"

# --- clean longer time task -----
for file in $(find $markfile -not -newermt '-120 seconds') ;do
   rm -fr $file >/dev/null 2>&1
done

for f in "$folder"/*; do
  if [ -f "$markfile" ]; then
    break;
  fi

  if [ -f "$f" ]; then

    echo $f >  $markfile

    fn=/tmp/SH_$(basename $f)_$(date +%s%N).sh
    cmdd="cp -fr $f $fn && rm -fr $f && sh $fn $BASEDIR $DOCKERCMD && rm -fr $fn && rm -fr $markfile "
    echo "-- Ran script $fn -- at $(date +"%m/%d/%Y %H:%M:%S")"
    eval " $cmdd"
  fi
done