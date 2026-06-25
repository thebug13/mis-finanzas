@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ============================================
echo   PUBLICAR REGLAS DE FIRESTORE
echo ============================================
echo.
echo Se abrira Firebase Console en tu navegador.
echo Tambien se abrira el archivo firestore.rules
echo.
echo INSTRUCCIONES:
echo   1. En Firebase Console, pestana "Reglas" / "Rules"
echo   2. Borra todo el contenido actual
echo   3. Copia TODO el contenido de firestore.rules
echo   4. Pegalo en Firebase Console
echo   5. Clic en "Publicar" / "Publish"
echo   6. Recarga la app (Ctrl+F5)
echo.
pause
start https://console.firebase.google.com/project/mis-finanzas-86840/firestore/rules
notepad firestore.rules
echo.
echo Cuando hayas publicado las reglas, recarga la app.
pause
