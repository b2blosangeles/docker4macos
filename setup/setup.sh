#!/bin/bash
DOCKERCMD=$(command -v docker)
OSENV=""
case "$(uname -s)" in

   Darwin)
     OSENV='Mac'
     ;;
   Linux)
     OSENV='Linux'
     ;;

   CYGWIN*|MINGW32*|MSYS*|MINGW*)
     OSENV='MS Windows'
     ;;
   *)
     OSENV='' 
     ;;
esac

SCRIPTDIR=$(cd `dirname $0` && pwd)
ROOTPATH="$(dirname "$SCRIPTDIR")"
DATAPATH="$(dirname "$ROOTPATH")"/data

if [ $DOCKERCMD == '' ]; then
    echo "Error : Docker installation and running is required!"
    exit 0
fi

if [ $OSENV != "Mac" ]; then
    echo "Error : We only support Mac OS X now!"
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
        
    mkdir -p $DATAPATH/log
    mkdir -p $DATAPATH/sites
    mkdir -p $DATAPATH/setting
    mkdir -p $DATAPATH/bootup
    chmod -R 777 $DATAPATH

    echo {"\"DOCKERCMD\"":"\"$DOCKERCMD\"", "\"ROOT\"": "\"$ROOTPATH\"", "\"DATAPATH\"": "\"$DATAPATH\"", "\"OSENV\"": "\"$OSENV\""} > $DATAPATH/DOCKERCMD.json
    
    sed '/echo _UI_APP/d' /var/at/tabs/$SUDO_USER  > /tmp/crontab_$SUDO_USER
    cp -f /tmp/crontab_$SUDO_USER  /var/at/tabs/$SUDO_USER
    chmod 777 /etc/hosts

    echo "@reboot echo _UI_APP && sh $ROOTPATH/setup/cronStart.sh $DOCKERCMD >> $DATAPATH/log/cronjob_$SUDO_USER.log" >> /var/at/tabs/$SUDO_USER

    for (( i=1; i < 60; i+=1 ))
    do
      COMM="sh $ROOTPATH/setup/cronjob.sh $DOCKERCMD >> $DATAPATH/log/crontask_$SUDO_USER.log"
      echo "* * * * *  (sleep $i ; echo _UI_APP && $COMM)" >> /var/at/tabs/$SUDO_USER
    done

    sed '/#--UI_ADMIN_LOCAL_S--/, /#--UI_ADMIN_LOCAL_E--/d' /etc/hosts  > /tmp/etc_hosts
    echo "#--UI_ADMIN_LOCAL_S--\n127.0.0.1\tadmin.local\n127.0.0.1\tadmin_local\n#--UI_ADMIN_LOCAL_E--" >>  /tmp/etc_hosts
    cp -f /tmp/etc_hosts /etc/hosts 

    echo "Success : your application is ready!"
else
    echo "Error : Need sudo run the command!"
fi
