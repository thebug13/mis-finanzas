# Script para evitar el error de PowerShell con npm
# Ejecutar: powershell -ExecutionPolicy Bypass -File iniciar.ps1

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Set-Location $PSScriptRoot

Write-Host "`n=== Mis Finanzas - Iniciar servidor ===" -ForegroundColor Green
Write-Host "Abre: http://localhost:5173`n" -ForegroundColor Cyan

& "C:\Program Files\nodejs\npm.cmd" run dev
