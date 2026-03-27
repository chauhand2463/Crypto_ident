@echo off
echo ==========================================
echo Starting ZK Identity System
echo ==========================================

echo.
echo Starting Hardhat node...
start "Hardhat" cmd /k "npx hardhat node --host 0.0.0.0"

echo Waiting for Hardhat...
timeout /t 10 /nobreak

echo.
echo Deploying contracts...
npx hardhat run scripts\deploy.js --network localhost

echo.
echo ==========================================
echo All services ready!
echo ==========================================
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000  
echo Hardhat: http://localhost:8545
echo ==========================================
echo.
echo Press any key to exit...
pause >nul
