#!/bin/bash

if [ ! -e /opt/app/*.jar ]
    then
        echo "ERROR: Something went wrong and the java file does not exist."
        exit
fi

java -cp /opt/app/gp-system-0.1.jar ie.teamproject.gp.App
