#!/bin/bash
set -e

echo "=========================================="
echo "Starting ZK Identity System"
echo "=========================================="

# Start Hardhat node in background
echo "Starting Hardhat node..."
npx hardhat node --host 0.0.0.0 &
HARDHAT_PID=$!

# Wait for Hardhat to be ready
echo "Waiting for Hardhat to be ready..."
for i in {1..30}; do
    if curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        http://localhost:8545 > /dev/null 2>&1; then
        echo "Hardhat is ready!"
        break
    fi
    sleep 2
done

# Deploy contracts
echo "Deploying contracts..."
npx hardhat run scripts/deploy.js --network localhost

# Store the deployment address
export IDENTITY_REGISTRY_ADDRESS=$(cat frontend/src/contracts/deployment.json | grep -o '"IdentityRegistry": "[^"]*"' | cut -d'"' -f4)
echo "IdentityRegistry deployed at: $IDENTITY_REGISTRY_ADDRESS"

echo "=========================================="
echo "All services started!"
echo "=========================================="
echo "Frontend: http://localhost"
echo "Backend: http://localhost:5000"
echo "Hardhat: http://localhost:8545"
echo "=========================================="

# Wait for all processes
wait $HARDHAT_PID
