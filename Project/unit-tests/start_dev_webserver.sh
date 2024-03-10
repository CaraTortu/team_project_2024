#!/bin/bash

set -a

# Create the docker DB container and populate it
echo "[i] Creating DB"
cd ../gp-system

if [ -x ".env" ]; then
    cp .env.example .env
fi

cd ../db-setup

bash create_database.sh
echo "[+] Created DB"

# Set up the web server
echo "[i] Setting up web server"
cd ../gp-system

if [ ! -d "node_modules" ]; then
    npm ci 
fi

npm run dev 
echo "[+] Web server running at 127.0.0.1:3000"

