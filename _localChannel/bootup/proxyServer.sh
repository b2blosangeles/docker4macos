#!/bin/bash
DOCKERCMD=$2
WORKFOLDER=$1

NOW=$(date +"%T")

echo "booting proxy server at $NOW - $WORKFOLDER"

cd $WORKFOLDER

$DOCKERCMD build -f _adminDockerFiles/proxy/DockerfileProxy -t local_proxy_image .
$DOCKERCMD container stop local_proxy_container
$DOCKERCMD container rm local_proxy_container

# --restart=always

$DOCKERCMD  run -d --network=network_ui_app -p 80-10000:80-10000 -v "$WORKFOLDER/_localChannel/proxyserver/sites":/usr/local/apache2/conf/sites/ \
-v "$WORKFOLDER/_localChannel/proxyserver/proxyDefaultDocs":/var/proxyDefaultDocs \
--name local_proxy_container  local_proxy_image

echo "Finished to boot proxy."