@echo off
echo ========================================
echo 物流管理システムSaaS
echo Distribution Management System
echo ========================================
echo.
echo サーバーを起動しています...
echo Starting server on port 3001...
echo.

cd /d %~dp0
npm run dev

pause

