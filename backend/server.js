const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HARDHAT_URL = process.env.HARDHAT_URL || 'http://localhost:8545';
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '31337');

console.log(`[BACKEND] Starting with config:`);
console.log(`[BACKEND] - PORT: ${PORT}`);
console.log(`[BACKEND] - HARDHAT_URL: ${HARDHAT_URL}`);
console.log(`[BACKEND] - CHAIN_ID: ${CHAIN_ID}`);

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '10mb' }));

// In-memory "DB" for demonstration
let identities = [];
let logs = [];
let stats = {
    totalIdentities: 0,
    totalProofs: 0,
    successRate: 0,
    pendingVerifications: 0,
    revokedIdentities: 0
};

// Helper to update success rate
const updateSuccessRate = () => {
    if (logs.length === 0) return;
    const successes = logs.filter(l => l.success).length;
    stats.successRate = Math.floor((successes / logs.length) * 100);
};

// Routes
app.get('/api/health', async (req, res) => {
    let hardhatStatus = 'UNKNOWN';
    
    try {
        const response = await fetch(HARDHAT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1
            })
        });
        if (response.ok) {
            hardhatStatus = 'CONNECTED';
        }
    } catch (e) {
        hardhatStatus = 'DISCONNECTED';
    }

    res.json({
        status: 'HEALTHY',
        system: 'ZK_IDENTITY_BACKEND_v1.0',
        uptime: process.uptime(),
        hardhat: hardhatStatus,
        chainId: CHAIN_ID
    });
});

// Get global stats
app.get('/api/stats', (req, res) => {
    res.json({
        ...stats,
        totalIdentities: identities.length,
        totalProofs: logs.length
    });
});

// Store identity metadata
app.post('/api/identities', (req, res) => {
    const { address, identityHash, university } = req.body;

    if (!address || !identityHash) {
        return res.status(400).json({ error: 'MISSING_DATA' });
    }

    const exists = identities.find(id => id.address.toLowerCase() === address.toLowerCase());
    if (exists) {
        return res.status(200).json({ message: 'IDENTITY_ALREADY_STORED', id: exists });
    }

    const newIdentity = {
        address: address.toLowerCase(),
        identityHash,
        university,
        createdAt: new Date().toISOString()
    };

    identities.push(newIdentity);
    stats.totalIdentities++;
    console.log(`[BACKEND] Stored identity for ${address}`);

    res.status(201).json({ message: 'IDENTITY_METADATA_STORED', id: newIdentity });
});

// Get identity by address
app.get('/api/identities/:address', (req, res) => {
    const identity = identities.find(id => id.address.toLowerCase() === req.params.address.toLowerCase());
    if (!identity) {
        return res.status(404).json({ error: 'IDENTITY_NOT_FOUND' });
    }
    res.json(identity);
});

// Log ZK Proof Submission
app.post('/api/logs/proof', (req, res) => {
    const { address, type, txHash, success } = req.body;

    const logEntry = {
        address: address?.toLowerCase(),
        type,
        txHash,
        success: Boolean(success),
        timestamp: new Date().toISOString()
    };

    logs.push(logEntry);
    stats.totalProofs++;
    updateSuccessRate();
    console.log(`[BACKEND] Proof Logged: ${type} for ${address} - Success: ${success}`);

    res.status(201).json({ message: 'PROOF_LOGGED' });
});

// Get Audit Logs
app.get('/api/logs/:address', (req, res) => {
    const userLogs = logs.filter(l => l.address?.toLowerCase() === req.params.address.toLowerCase());
    res.json(userLogs);
});

// Get all logs (admin)
app.get('/api/logs', (req, res) => {
    res.json(logs);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[BACKEND] Error: ${err.message}`);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    =========================================
    🚀 ZK_IDENTITY BACKEND SERVER
    PORT: ${PORT}
    CHAIN_ID: ${CHAIN_ID}
    HARDHAT_URL: ${HARDHAT_URL}
    STATUS: ACTIVE
    =========================================
    `);
});
