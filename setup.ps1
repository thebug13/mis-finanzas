# Script de configuración inicial — Mis Finanzas
# Ejecutar: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "`n=== Mis Finanzas - Setup ===" -ForegroundColor Green

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js no esta instalado." -ForegroundColor Red
    Write-Host "Descargalo desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js: $(node --version)" -ForegroundColor Cyan
Write-Host "npm: $(npm --version)" -ForegroundColor Cyan

# Crear .env si no existe
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "`nArchivo .env creado desde .env.example" -ForegroundColor Yellow
    Write-Host "EDITA .env con tus credenciales de Firebase antes de continuar." -ForegroundColor Yellow
    Write-Host "Obtén las credenciales en: https://console.firebase.google.com/`n" -ForegroundColor Yellow
    
    $abrir = Read-Host "¿Quieres abrir .env ahora? (s/n)"
    if ($abrir -eq "s") {
        notepad .env
        Read-Host "Presiona Enter cuando hayas guardado .env"
    }
} else {
    Write-Host ".env ya existe" -ForegroundColor Green
}

# Instalar dependencias
Write-Host "`nInstalando dependencias..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Setup completado ===" -ForegroundColor Green
Write-Host "Siguiente paso: npm run dev" -ForegroundColor Cyan
Write-Host "Luego abre: http://localhost:5173`n" -ForegroundColor Cyan
