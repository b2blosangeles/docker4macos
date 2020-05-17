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

    fnAdmin=$PWD/_localChannel/bootup/adminServer.sh
    fnProxy=$PWD/_localChannel/bootup/proxyServer.sh

    COMM="sh $fnProxy $BASEDIR $DOCKERCMD && sh $fnAdmin $BASEDIR $DOCKERCMD"
    eval " $COMM"
    echo "Success : Done!"
else
    echo "Error : Need sudo run the command!"
fi
