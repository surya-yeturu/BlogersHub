@echo off
echo Checking BlogHub Application Status...
echo.

echo Checking Backend Server (port 8000)...
netstat -an | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo [OK] Backend server is running on port 8000
) else (
    echo [ERROR] Backend server is not running on port 8000
)

echo.
echo Checking Frontend Server (ports 5173/5174)...
netstat -an | findstr :5173 > nul
if %errorlevel% equ 0 (
    echo [OK] Frontend server is running on port 5173
) else (
    netstat -an | findstr :5174 > nul
    if %errorlevel% equ 0 (
        echo [OK] Frontend server is running on port 5174
    ) else (
        echo [ERROR] Frontend server is not running on ports 5173 or 5174
    )
)

echo.
echo URLs:
echo Backend API: http://localhost:8000
echo Backend Docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173 (or 5174)
echo.
pause 