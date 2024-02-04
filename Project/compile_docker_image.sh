#!/bin/bash

# Build the JAR file
cd gp-system
mvn package
mv target/*.jar ../docker_files

# Compile the docker image
cd ..
docker build -t gp_system .
