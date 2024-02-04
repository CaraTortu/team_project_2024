#!/bin/bash

if [ ! -e /opt/app/*.jar ]
    then
        echo "ERROR: Something went wrong and the java file does not exist."
        exit
fi

java -jar /opt/app/gp-system.jar
