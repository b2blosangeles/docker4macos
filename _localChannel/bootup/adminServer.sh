#!/bin/bash
DOCKERCMD=$2
WORKFOLDER=$1

NOW=$(date +"%T")

echo "booting admin server at $NOW - $WORKFOLDER"

cd $WORKFOLDER

$DOCKERCMD build -f _adminDockerFiles/admin/DockerfileAdmin -t local_admin_image .
$DOCKERCMD container stop local_admin_container
$DOCKERCMD container rm local_admin_container

# --restart=always

$DOCKERCMD run -d --network=network_ui_app -p 10000:10000 -v "$WORKFOLDER/_localChannel":/var/_localChannel \
--name local_admin_container  local_admin_image

echo "Finished to boot admin."
