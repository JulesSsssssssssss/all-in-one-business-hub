@echo off
echo.
echo ========================================
echo   Test des Routes d'Authentification
echo ========================================
echo.
echo Execution du script de test...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0quick-test.ps1"

echo.
pause
