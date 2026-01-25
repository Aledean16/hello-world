@echo off
echo ========================================
echo   Iniciando servidor en localhost:8080
echo ========================================
echo.
echo El servidor se iniciara en una nueva ventana.
echo NO CIERRES esta ventana mientras uses la aplicacion.
echo.
echo Presiona cualquier tecla para iniciar...
pause >nul

start powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"

echo.
echo Servidor iniciado! Abre tu navegador en: http://localhost:8080
echo.
echo Presiona cualquier tecla para salir...
pause >nul
