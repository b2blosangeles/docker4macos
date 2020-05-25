#!/bin/bash
DOCKERCMD=$3
WORKFOLDER=$1
DATAFOLDER=$2

NOW=$(date +"%T")

echo "booting proxy server at $NOW - $WORKFOLDER"

cd $WORKFOLDER

$DOCKERCMD build -f _adminDockerFiles/proxy/DockerfileProxy -t local_proxy_image .
$DOCKERCMD container stop local_proxy_container
$DOCKERCMD container rm local_proxy_container

# --restart=always
# -v "$DATAFOLDER/sites/setting":/var/sitesSetting \

$DOCKERCMD  run -d --network=network_ui_app -p 80:80  \
-v "$DATAFOLDER/setting":/var/sitesSetting \
-v "$WORKFOLDER/_localChannel/proxyserver":/var/proxySetting \
--name local_proxy_container  local_proxy_image

echo "Finished to boot proxy."