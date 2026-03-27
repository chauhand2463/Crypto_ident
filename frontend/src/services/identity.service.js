import { ethers } from 'ethers';
import IdentityRegistryArtifact from '../contracts/IdentityRegistry.json';

// Get registry address from env or use hardcoded default
const IDENTITY_REGISTRY_ADDRESS = import.meta.env.VITE_IDENTITY_REGISTRY || "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const EXPECTED_CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID) || 31337;

console.log(`[SERVICE] Using registry at: ${IDENTITY_REGISTRY_ADDRESS}`);
console.log(`[SERVICE] Expected chain ID: ${EXPECTED_CHAIN_ID}`);

const IdentityRegistryABI = IdentityRegistryArtifact.abi;

export async function getRegistryContract(readonly = true) {
    if (!window.ethereum) {
        throw new Error("NO_ETHEREUM_PROVIDER - Please install MetaMask");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Check network
    try {
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        if (chainId !== EXPECTED_CHAIN_ID) {
            console.warn(`[SERVICE] Wrong network! Expected ${EXPECTED_CHAIN_ID}, got ${chainId}`);
        }
    } catch (e) {
        console.warn(`[SERVICE] Could not verify network:`, e.message);
    }

    const signerOrProvider = readonly ? provider : await provider.getSigner();

    return new ethers.Contract(
        IDENTITY_REGISTRY_ADDRESS,
        IdentityRegistryABI,
        signerOrProvider
    );
}

export const getIdentityVerificationStatus = async (address) => {
    if (!address) return null;

    try {
        const registry = await getRegistryContract(true);

        const [isRegistered, ageResult, natResult, stuResult, revAge, revNat, revStu] = await Promise.all([
            registry.isRegistered(address),
            registry.isVerified(address, 0),
            registry.isVerified(address, 1),
            registry.isVerified(address, 2),
            registry.isRevoked(address, 0),
            registry.isRevoked(address, 1),
            registry.isRevoked(address, 2)
        ]);

        return {
            registered: Boolean(isRegistered),
            age: Boolean(ageResult?.[0]) && !revAge,
            nationality: Boolean(natResult?.[0]) && !revNat,
            student: Boolean(stuResult?.[0]) && !revStu,
            revoked: {
                age: Boolean(revAge),
                nationality: Boolean(revNat),
                student: Boolean(revStu)
            },
            fullyVerified: Boolean(ageResult?.[0]) && !revAge && Boolean(natResult?.[0]) && !revNat && Boolean(stuResult?.[0]) && !revStu
        };
    } catch (error) {
        console.error("[SERVICE] Status fetch failed:", error);
        return {
            registered: false,
            age: false,
            nationality: false,
            student: false,
            revoked: { age: false, nationality: false, student: false },
            fullyVerified: false
        };
    }
};

export const registerIdentityOnChain = async (commitment) => {
    const registry = await getRegistryContract(false);

    let formattedCommitment;
    if (typeof commitment === 'string') {
        if (commitment.startsWith('0x')) {
            formattedCommitment = commitment;
        } else {
            formattedCommitment = "0x" + BigInt(commitment).toString(16).padStart(64, '0');
        }
    } else {
        formattedCommitment = "0x" + commitment.toString(16).padStart(64, '0');
    }

    console.log(`[SERVICE] Registering: ${formattedCommitment.substring(0, 20)}...`);
    
    const tx = await registry.registerIdentity(formattedCommitment);
    console.log(`[SERVICE] Tx hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`[SERVICE] Confirmed in block: ${receipt.blockNumber}`);
    
    return receipt.hash;
};
