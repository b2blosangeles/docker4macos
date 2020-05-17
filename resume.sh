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
        
    fnAdmin=$PWD/_localChannel/bootup/adminServer.sh
    fnProxy=$PWD/_localChannel/bootup/proxyServer.sh

    COMM="sh $fnProxy $PWD $DOCKERCMD && sh $fnAdmin $PWD $DOCKERCMD"
    eval " $COMM"
    echo "Success : Done!"
else
    echo "Error : Need sudo run the command!"
fi
