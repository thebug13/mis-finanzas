@echo off
cd /d "%~dp0"
echo.
echo === Mis Finanzas - Firebase Setup ===
echo.

echo Paso 1: Iniciar sesion (se abrira el navegador)...
firebase login
if errorlevel 1 (
    echo ERROR en login. Intenta de nuevo.
    pause
    exit /b 1
)

echo.
echo Paso 2: Desplegando reglas de Firestore...
firebase deploy --only firestore

if errorlevel 1 (
    echo ERROR en deploy.
    pause
    exit /b 1
)

echo.
echo === Listo! Reglas desplegadas correctamente ===
pause
