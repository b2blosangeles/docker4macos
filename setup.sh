#!/bin/bash
docker network rm network_ui_app

docker network create \
    --driver=bridge \
    --subnet=10.10.10.0/16 \
    --ip-range=10.10.10.0/24 \
    --gateway=10.10.10.254 \
    network_ui_app

# docker stop $(ps docker -q -a)

# --------- cron job ------------

user=$1
DOCKERCMD=$(command -v docker)

echo {"\"DOCKERCMD\"":"\"$DOCKERCMD\"", "\"ROOT\"": "\"$PWD\""} > $PWD/ui-trinet-local/admin/DOCKERCMD.json

chmod 777 /etc/hosts

sed '/echo _UI_APP/d' /var/at/tabs/$user > /tmp/crontab_$user
cp -f /tmp/crontab_$user /var/at/tabs/$user

echo "@reboot echo _UI_APP && sh $PWD/cronStart.sh $DOCKERCMD >> /tmp/cronjob_$user.log" >> /var/at/tabs/$user

for (( i=1; i < 60; i+=1 ))
do
    echo "* * * * *  (sleep $i ; echo _UI_APP && sh $PWD/cronjob.sh $DOCKERCMD >> /tmp/cronjob_$user.log)" >> /var/at/tabs/$user
 done
