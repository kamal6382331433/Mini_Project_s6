@echo off
echo ========================================
echo DAED - Digital Academic Evaluation Dashboard
echo ========================================
echo.

echo Checking MySQL Service...
sc query MySQL80 | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo MySQL is not running. Please start MySQL Server first.
    echo You can start it from Services or run: net start MySQL80
    pause
    exit /b 1
)
echo MySQL is running!
echo.

echo Opening Frontend in Browser...
start "" "index.html"
echo.

echo ========================================
echo DAED Frontend is now open!
echo.
echo Default Login Credentials:
echo   Admin:   admin / password123
echo   Faculty: faculty / password123
echo   Student: student / password123
echo.
echo Make sure the Backend is running in Eclipse!
echo ========================================
pause
