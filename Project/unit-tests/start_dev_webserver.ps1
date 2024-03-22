# Check for executables
if (!(Get-Command "node")) {
    Write-Error "[-] ERROR: Node.js is not installed"
    exit 1
}

# First check for the .env file and if it does not exist, then create it
Set-Location ..\gp-system

if (!(Test-Path .env)) {
    Copy-Item .env.example .env
}

# Install node modules
if (!(Test-Path .\node_modules)) {
    npm.cmd i
}

# Set up docker database
Set-Location ..\db-setup
. .\create_database.ps1

# Set up webserver
Set-Location ..\gp-system
npm.cmd install
npm.cmd run build
npm.cmd run start
