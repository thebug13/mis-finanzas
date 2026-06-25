@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================
echo   SUBIR MIS FINANZAS A GITHUB
echo ============================================
echo.

set /p GITHUB_USER="Escribe tu usuario de GitHub: "
set /p REPO_NAME="Nombre del repositorio (Enter = mis-finanzas): "
if "%REPO_NAME%"=="" set REPO_NAME=mis-finanzas

echo.
echo Repositorio: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo URL final:   https://%GITHUB_USER%.github.io/%REPO_NAME%/
echo.
echo IMPORTANTE: Si el nombre del repo NO es "mis-finanzas",
echo edita vite.config.js linea 7 con el nombre correcto.
echo.
pause

echo.
echo [1/4] Preparando archivos...
git add .
git status

echo.
echo [2/4] Creando commit...
git commit -m "Mis Finanzas - app de finanzas personales con React y Firebase"

echo.
echo [3/4] Configurando rama main...
git branch -M main

echo.
echo [4/4] Conectando con GitHub...
echo.
echo Si aun NO creaste el repo, abre este enlace:
echo https://github.com/new?name=%REPO_NAME%
echo (NO marques README, .gitignore ni licencia)
echo.
pause

git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR al hacer push. Posibles causas:
    echo   - El repositorio no existe en GitHub
    echo   - No iniciaste sesion en Git
    echo   - Nombre de usuario incorrecto
    echo.
    echo Crea el repo en: https://github.com/new?name=%REPO_NAME%
    pause
    exit /b 1
)

echo.
echo ============================================
echo   CODIGO SUBIDO CORRECTAMENTE
echo ============================================
echo.
echo SIGUIENTE: Configura GitHub Pages y Firebase
echo.
echo 1. Secrets en GitHub:
echo    https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/secrets/actions
echo    Agrega los 6 secrets (mismos valores que tu archivo .env):
echo      VITE_FIREBASE_API_KEY
echo      VITE_FIREBASE_AUTH_DOMAIN
echo      VITE_FIREBASE_PROJECT_ID
echo      VITE_FIREBASE_STORAGE_BUCKET
echo      VITE_FIREBASE_MESSAGING_SENDER_ID
echo      VITE_FIREBASE_APP_ID
echo.
echo 2. Activar GitHub Pages:
echo    https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/pages
echo    Source: GitHub Actions
echo.
echo 3. Ejecutar deploy:
echo    https://github.com/%GITHUB_USER%/%REPO_NAME%/actions
echo    Clic en "Deploy to GitHub Pages" - Run workflow
echo.
echo 4. Firebase - dominio autorizado:
echo    https://console.firebase.google.com/project/mis-finanzas-86840/authentication/settings
echo    Agrega: %GITHUB_USER%.github.io
echo.
echo Tu app estara en:
echo https://%GITHUB_USER%.github.io/%REPO_NAME%/
echo.
start https://github.com/%GITHUB_USER%/%REPO_NAME%/settings/secrets/actions
pause
