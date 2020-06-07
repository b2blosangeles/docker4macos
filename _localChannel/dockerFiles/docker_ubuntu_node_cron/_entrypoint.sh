#!/bin/bash
markfile="/var/_cronData/mark.data"
folder="/var/_cronData/inBound"
while true; do 
   sleep 5
   for file in $(find $markfile -not -newermt '-300 seconds') ;do
      rm -fr $file >/dev/null 2>&1
   done
   
   for f in "$folder"/*; do
     if [ -f "$markfile" ]; then
       break;
     fi
     if [ -f "$f" ]; then
       echo $f >  $markfile

       fn=/tmp/$(basename $f)_$(date +%s%N).data
       echo "-- Start process $f -- at $(date +"%m/%d/%Y %H:%M:%S")" >> /var/_cronData/dataCron.log
       cmdd="mv $f $fn && sh /var/_localApp/entrypoint.sh $fn && rm -fr $fn && rm -fr $markfile "
       eval "$cmdd"  >> /var/_cronData/dataCron.log
       echo "-- Done $f -- at $(date +"%m/%d/%Y %H:%M:%S")" >> /var/_cronData/dataCron.log
     fi
   done
done
#makBBB