#!/bin/bash
DOCKERCMD=$2
WORKFOLDER=$1

NOW=$(date +"%T")

echo "booting admin server at $NOW - $WORKFOLDER"

cd $WORKFOLDER

$DOCKERCMD build -f _adminDockerFiles/admin/DockerfileAdmin -t local_channel_image .
$DOCKERCMD container stop local_channel_admin
$DOCKERCMD container rm local_channel_admin

# --restart=always

$DOCKERCMD run -d --network=network_ui_app -p 10000:10000 -v "$WORKFOLDER/_localChannel":/var/_localChannel \
--name local_channel_admin  local_channel_image

echo "Finished to boot admin."
