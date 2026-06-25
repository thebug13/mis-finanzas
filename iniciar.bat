@echo off
cd /d "%~dp0"
echo.
echo === Mis Finanzas - Servidor local ===
echo Abre: http://localhost:5173
echo.
"C:\Program Files\nodejs\npm.cmd" run dev
pause
