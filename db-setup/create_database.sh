#!/bin/bash
# Use this script to start a docker container for a local development database
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

# Check if container already exists and is already running
if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "[+] Database container is already running"
  exit 0
fi

if [ "$(docker ps -a -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "[+] Container already exists. Starting container..."
  docker start $DB_CONTAINER_NAME
  echo "[+] Done"
  exit 0
fi

# Container does not exist, create it and run it
set -a
cd ../gp-system

if ! [ -e ".env" ]; then
    echo "[-] ERROR: Please create the .env file in ../gp-system from the template .env.example"
fi

source .env

DB_PASSWORD=$(echo $DATABASE_URL | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

docker run --name $DB_CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=gp-system -d -p 5432:5432 docker.io/postgres

echo "[+] Database container was succesfuly created... Pushing schema"

npm i
npx drizzle-kit push:pg

echo "[+] Database schema has been pushed to the container"

# Populate database if running in development mode
cd ../db-setup
if [[ $NODE_ENV == "development" ]]; then
    echo "[i] Environment is set to development. Populating database..."

    if [ "$(command -v apt)" ]; then 
        apt install python3-dev -y
    fi

    if [ ! -e ".venv" ]; then
        python3 -m venv .venv
        source .venv/bin/activate
        python3 -m pip install -r requirements.txt
        deactivate
    fi

    source .venv/bin/activate
    python3 populate_db.py
    echo "[+] Database populated"
fi
