#!/bin/bash
# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS: 
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

DB_CONTAINER_NAME="gp-system-postgres"

if ! [ -x "$(command -v docker)" ]; then
  echo "[-] ERROR: Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if ! [ -x "$(command -v npx)" ]; then
  echo "[-] ERROR: Npm is not installed. Please install node.js and try again.\nNode.js install guide: https://nodejs.org/en/download"
  exit 1
fi

if ! [ -x "$(command -v python3)" ]; then
  echo "[-] ERROR: Python is not installed. Please install try again."
  exit 1
fi

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  docker start $DB_CONTAINER_NAME
  echo "[+] Database container started"
  exit 0
fi

# import env variables from .env
set -a
cd ../gp-system

if ! [ -x ".env" ]; then
    echo "[-] ERROR: Please create the .env file in ../gp-system from the template .env.example"
    exit 1
fi

source .env

DB_PASSWORD=$(echo $DATABASE_URL | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

docker run --name $DB_CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=gp_system -d -p 5432:5432 docker.io/postgres

echo "[+] Database container was succesfuly created... Pushing schema"

npx drizzle-kit push:pg

echo "[+] Database schema has been pushed to the container"

cd ../db_setup
if [[ $NODE_ENV == "development" ]]; then
    echo "[i] Environment is set to development. Populating database..."
    
    if ! [ -x ".venv" ]; then
        python3 -m venv .venv
        python3 -m pip install -r requirements.txt
    fi

    source .venv/bin/activate
    python3 populate_db.py
    echo "[+] Database populated"
fi
