# Script para configurar Firebase (reglas + indices)
# Ejecutar: powershell -ExecutionPolicy Bypass -File firebase-setup.ps1

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Set-Location $PSScriptRoot

Write-Host "`n=== Mis Finanzas - Firebase Setup ===" -ForegroundColor Green

# Vincular proyecto (ya configurado en .env)
Write-Host "`nVinculando proyecto mis-finanzas-86840..." -ForegroundColor Cyan
firebase use mis-finanzas-86840

Write-Host "`nDesplegando reglas de Firestore..." -ForegroundColor Cyan
firebase deploy --only firestore

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Firebase configurado correctamente ===" -ForegroundColor Green
} else {
    Write-Host "`nERROR: Si no has iniciado sesion, ejecuta primero:" -ForegroundColor Red
    Write-Host "  firebase login" -ForegroundColor Yellow
}
