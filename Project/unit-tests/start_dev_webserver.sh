#!/bin/bash

set -a

# Create the docker DB container and populate it
echo "[i] Creating DB"
cd ../gp-system

if [ ! -e ".env" ]; then
    cp .env.example .env
fi

cd ../db-setup

bash create_database.sh
echo "[+] Created DB"

# Set up the web server
echo "[i] Setting up web server"
cd ../gp-system
npm i
npm run build && npm run start

