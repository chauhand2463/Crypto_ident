const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const IDENTITY_REGISTRY_ADDRESS = process.env.IDENTITY_REGISTRY || '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

async function waitForRpc(url, maxAttempts = 30) {
    console.log(`Waiting for RPC at ${url}...`);
    
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const provider = new ethers.JsonRpcProvider(url);
            const blockNumber = await provider.getBlockNumber();
            console.log(`RPC ready! Current block: ${blockNumber}`);
            return provider;
        } catch (e) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    throw new Error('RPC not available');
}

async function main() {
    const HARDHAT_URL = process.env.HARDHAT_URL || 'http://localhost:8545';
    const provider = await waitForRpc(HARDHAT_URL);
    
    // Get the deployer account
    const signer = await provider.getSigner(0);
    const deployerAddress = await signer.getAddress();
    console.log(`Deploying from: ${deployerAddress}`);
    
    // Get contract artifact
    const artifactPath = path.join(__dirname, 'artifacts', 'contracts', 'IdentityRegistry.sol', 'IdentityRegistry.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    // Deploy IdentityRegistry
    console.log('Deploying IdentityRegistry...');
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    const contract = await factory.deploy();
    
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    
    console.log(`IdentityRegistry deployed at: ${address}`);
    
    // Save deployment info
    const deployment = {
        network: 'localhost',
        deployer: deployerAddress,
        timestamp: new Date().toISOString(),
        contracts: {
            IdentityRegistry: address,
            AgeVerifier: '0x0000000000000000000000000000000000000001',
            NationalityVerifier: '0x0000000000000000000000000000000000000002',
            StudentVerifier: '0x0000000000000000000000000000000000000003'
        }
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'frontend', 'src', 'contracts', 'deployment.json'),
        JSON.stringify(deployment, null, 2)
    );
    
    console.log('Deployment complete!');
}

main().catch(console.error);
