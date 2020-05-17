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



if [ $USER != $SUDO_USER ] && [ $USER == "root" ] ;
then
    if [ $OSENV != "Mac" ]; then
        echo "Error : We only support Mac OS X now!"
        exit 0
    fi
    echo {"\"DOCKERCMD\"":"\"$DOCKERCMD\"", "\"ROOT\"": "\"$PWD\"", "\"OSENV\"": "\"$OSENV\""} > $PWD/_localChannel/admin/DOCKERCMD.json
    
    sed '/echo _UI_APP/d' /var/at/tabs/$SUDO_USER  > /tmp/crontab_$SUDO_USER
    cp -f /tmp/crontab_$SUDO_USER  /var/at/tabs/$SUDO_USER
    chmod 777 /etc/hosts

    echo "@reboot echo _UI_APP && sh $PWD/cronStart.sh $DOCKERCMD >> /tmp/cronjob_$SUDO_USER.log" >> /var/at/tabs/$SUDO_USER

    for (( i=1; i < 60; i+=1 ))
    do
        echo "* * * * *  (sleep $i ; echo _UI_APP && sh $PWD/cronjob.sh $DOCKERCMD >> /tmp/cronjob_$SUDO_USER.log)" >> /var/at/tabs/$SUDO_USER
    done

else
    echo "Error : Need sudo run the command!"
fi
