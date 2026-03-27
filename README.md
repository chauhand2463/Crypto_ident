# Extreme Emerald: Zero-Knowledge Identity Protocol

**Secure. Private. Irrevocable.**

A production-grade ZK-Identity framework for privacy-preserving age-gating, nationality verification, and student verification on the Polygon blockchain.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Smart Contracts](#smart-contracts)
- [Zero-Knowledge Circuits](#zero-knowledge-circuits)
- [Frontend](#frontend)
- [Backend API](#backend-api)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [License](#license)

---

## Project Overview

Extreme Emerald solves the "Privacy Paradox" in digital verification. It allows users to prove they are over 18, have a specific nationality, or are students WITHOUT revealing their birth date, passport number, or university ID to the verifying application.

### What is Zero-Knowledge Proof?

Zero-Knowledge Proofs (ZKP) allow one party to prove to another that they know a value without revealing the value itself. In this project, users can prove:
- **Age Verification**: "I am over 18" without revealing actual age or DOB
- **Nationality Verification**: "I am a citizen of X country" without revealing passport number
- **Student Verification**: "I am a student at Y university" without revealing student ID

---

## Features

- **Privacy-Preserving Verification**: Users prove attributes without revealing sensitive data
- **On-Chain Revocation**: Admin can revoke identities for compliance (GDPR Ready)
- **Local ZK Proof Generation**: All proofs generated client-side using snarkjs
- **AES-256 Encrypted Vault**: Local storage with session-locked encryption
- **Multi-Network Support**: Hardhat Local, Polygon Amoy, Sepolia
- **Docker Support**: Full containerized deployment
- **Real-time Proving HUD**: Visual progress indicator during ZK proof generation

---

## Technical Architecture

| Layer | Technology |
|-------|------------|
| **ZK Circuits** | Circom 2.1 |
| **Proof System** | Groth16 (BN128 Curve) |
| **Blockchain** | Polygon Amoy / Sepolia / Local |
| **Smart Contracts** | Solidity + Hardhat |
| **Frontend** | React + Vite + Framer Motion |
| **Backend** | Express.js |
| **Storage** | Local AES-256 encrypted vault |
| **Container** | Docker + Docker Compose |

---

## Project Structure

```
MP hackthon/
├── backend/                    # Express.js backend API
│   ├── server.js              # Main server file
│   └── package.json
├── circuits/                  # Circom ZK circuits
│   ├── student_verification.circom
│   ├── nationality_verification.circom
│   └── build/                # Compiled circuit outputs
├── contracts/                 # Solidity smart contracts
│   ├── IdentityRegistry.sol  # Main registry contract
│   ├── *_Verifier.sol        # Auto-generated verifiers
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # Proof & identity services
│   │   ├── hooks/            # Custom React hooks
│   │   └── contracts/        # ABI & deployment info
│   └── public/
│       └── circuits/         # ZK keys & wasm files
├── scripts/                   # Deployment & utility scripts
├── docker-compose.yml         # Docker orchestration
├── Dockerfile.hardhat         # Hardhat node container
├── hardhat.config.js          # Hardhat configuration
└── package.json              # Root dependencies
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Local Development

1. **Install Dependencies**:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

2. **Start Local Blockchain**:
```bash
npx hardhat node
```

3. **Deploy Contracts**:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

4. **Start Backend**:
```bash
cd backend && npm install && npm start
```

5. **Start Frontend**:
```bash
cd frontend && npm run dev
```

The frontend will be available at `http://localhost:5173`

---

### Docker Deployment

The project includes Docker support for easy deployment.

#### Quick Start with Docker Compose

```bash
# Start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

#### Services

| Service | Port | Description |
|---------|------|-------------|
| **hardhat** | 8545, 8546 | Local blockchain node |
| **backend** | 5000 | Express API server |
| **frontend** | 80, 5173 | React application |

#### Accessing the Application

After starting with Docker:
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`
- Hardhat RPC: `http://localhost:8545`

#### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Restart a specific service
docker-compose restart frontend
```

#### Manual Docker Build

If you prefer to build manually:

**Hardhat Node:**
```bash
docker build -f Dockerfile.hardhat -t zk-identity-hardhat .
docker run -p 8545:8545 -p 8546:8546 zk-identity-hardhat
```

---

## Smart Contracts

### IdentityRegistry

The main contract managing identity records and verifications.

**Key Functions:**
- `registerIdentity(bytes32 identityHash, uint8 identityType)` - Register new identity
- `verifyProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[3] input)` - Verify ZK proof
- `revokeIdentity(bytes32 identityHash)` - Revoke identity (admin only)
- `getIdentity(bytes32 identityHash)` - Retrieve identity info

### Verifier Contracts

Auto-generated from Circom circuits:
- **Age_verificationVerifier**: Verifies age > 18
- **Nationality_verificationVerifier**: Verifies nationality claim
- **Student_verificationVerifier**: Verifies student status

---

## Zero-Knowledge Circuits

### Circuit Files

| Circuit | Purpose |
|---------|---------|
| `age_verification.circom` | Proves user is over 18 |
| `nationality_verification.circom` | Proves nationality without revealing ID |
| `student_verification.circom` | Proves student status |

### Compilation

```bash
npm run compile:circuits
```

This generates:
- `.wasm` files for client-side proving
- `.zkey` files for verification
- `Verifier.sol` contracts

---

## Frontend

### Key Components

- **LandingPage**: Hero section with project info
- **IdentityCreation**: Create new identity with ZK proofs
- **ProofInterface**: Generate and submit proofs
- **WalletConnection**: MetaMask integration
- **AdminPortal**: Revocation dashboard

### Services

- `proof.service.js`: ZK proof generation using snarkjs
- `identity.service.js`: Identity management
- `zkUtils.js`: Circuit utilities

---

## Backend API

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/identities` | List all identities |
| POST | `/api/identities` | Register new identity |
| GET | `/api/identities/:hash` | Get identity by hash |
| POST | `/api/proofs` | Submit proof for verification |
| GET | `/api/health` | Health check |

---

## Environment Variables

### Backend (.env)
```
PORT=5000
HARDHAT_URL=http://localhost:8545
CHAIN_ID=31337
```

### Frontend (.env)
```
VITE_CHAIN_ID=31337
VITE_IDENTITY_REGISTRY=0x...
VITE_BACKEND_URL=http://localhost:5000
```

### Hardhat (hardhat.config.js)
- `POLYGON_AMOY_RPC`: RPC URL for Polygon Amoy
- `PRIVATE_KEY`: Deployer wallet private key
- `POLYGONSCAN_API_KEY`: For contract verification

---

## Deployment

### Deploy to Polygon Amoy

1. Add Amoy network to MetaMask:
   - RPC: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Symbol: `MATIC`

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your Amoy RPC URL and private key
```

3. Deploy:
```bash
npm run deploy:amoy
```

### Verify on Polygonscan

```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

---

## Security Features

- **Client-Side Proofs**: Sensitive data never leaves user's browser
- **AES-256 Encryption**: Local vault is encrypted at rest
- **Session Lock**: Vault locks after inactivity
- **On-Chain Revocation**: GDPR right to be forgotten
- **No Mock Data**: Real ZK proofs, no fake verification

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile:circuits` | Compile ZK circuits |
| `npm run deploy:local` | Deploy to Hardhat |
| `npm run deploy:amoy` | Deploy to Polygon Amoy |
| `npm run test:contracts` | Run contract tests |
| `npm run chain` | Start local Hardhat node |
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build frontend for production |

---

## License

MIT License
