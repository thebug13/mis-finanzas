@echo off
cd /d "%~dp0"
echo.
echo === Verificar configuracion Firebase ===
echo.

if not exist ".env" (
    echo ERROR: No existe el archivo .env
    echo Copia .env.example a .env y completa tus credenciales.
    pause
    exit /b 1
)

echo Archivo .env encontrado.
echo.
echo IMPORTANTE: Obtén las credenciales CORRECTAS aqui:
echo https://console.firebase.google.com/project/mis-finanzas-86840/settings/general
echo.
echo 1. Baja hasta "Tus apps"
echo 2. Clic en tu app web
echo 3. Selecciona "Config" (npm)
echo 4. Copia los valores al archivo .env
echo.
echo Abriendo .env para editar...
notepad .env
echo.
echo Despues de guardar .env:
echo - Cierra el servidor (Ctrl+C en iniciar.bat)
echo - Vuelve a ejecutar iniciar.bat
echo.
pause
