
$DB_CONTAINER_NAME = "gp-system-postgres"


# Check that all executables exist
$executables = @("docker.exe", "npx.cmd", "python.exe")

for ($i = 0; $i -lt $executables.Count; $i++) {
    $cmd = $executables.Get($i)
    if (!(Get-Command $cmd)) {
        Write-Error "[-] ERROR: $cmd is not installed."
        exit 1
    }
}

if (docker.exe ps -q -f name=$DB_CONTAINER_NAME) {
    Write-Host "[+] Database is already running";
    exit 0;
}

if (docker.exe ps -a -q -f name=$DB_CONTAINER_NAME) {
    Write-Host "[+] Database is created but not running. Starting..."
    docker.exe start $DB_CONTAINER_NAME;
    exit 0;
}

Write-Host "[i] Database doesn't exist. Creating..."

# Get info from .env
Set-Location ..\gp-system

if (!(Test-Path .env)) {
    Copy-Item .env.example .env
}

# Loading env
Get-Content .env | ForEach-Object {
    $name, $value = $_.split('=')

    if ($_.split('=').Count -gt 1) {
        Set-Content Env:\$name $value    
    }
}

$DB_PASSWORD = $Env:DATABASE_URL.Split(":").Get(2).Split("@").Get(0);

docker.exe run --name $DB_CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=gp-system -d -p 5432:5432 docker.io/postgres 

Write-Host "[+] Database created. Pushing schema..."

npm.cmd install
npx.cmd drizzle-kit push:pg

Write-Host "[+] Database schema has been created."

if ($Env:NODE_ENV -eq "development") {
    Write-Host "[i] Environment set to development. Populating database..."
    Set-Location ../db-setup

    python.exe -m pip install -r requirements.txt
    python.exe populate_db.py

    Write-Host "[+] Database populated"
}
