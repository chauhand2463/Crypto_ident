import { useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { saveIdentity, generateSalt } from '../utils/identityStorage';
import { calculateIdentityHash } from '../utils/zkUtils';
import { registerIdentityOnChain } from '../services/identity.service';

const IdentityCreation = ({ onIdentityCreated }) => {
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('1');
    const [university, setUniversity] = useState('1001');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [registerOnChain, setRegisterOnChain] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // Request signature for encryption key (FREE - no ETH)
            const message = "Sign to create your ZK Identity vault. This signature is free and does not cost any cryptocurrency.";
            const signature = await signer.signMessage(message);

            // Format DOB: YYYY-MM-DD -> YYYYMMDD
            const dobNumber = dob.replace(/-/g, '');

            // Generate identity data & cryptographic commitment
            const salt = generateSalt();
            const commitment = await calculateIdentityHash(
                dobNumber,
                nationality,
                studentId || '0',
                salt
            );

            console.log('[IDENTITY] Generated commitment:', commitment);

            const newIdentity = {
                dob: parseInt(dobNumber),
                nationality: parseInt(nationality),
                university: parseInt(university),
                studentId: parseInt(studentId) || 0,
                salt,
                identityHash: commitment,
                ageVerified: false,
                nationalityVerified: false,
                studentVerified: false
            };

            // Only register on-chain if checkbox is checked
            if (registerOnChain) {
                console.log('[IDENTITY] Registering on-chain...');
                try {
                    await registerIdentityOnChain(commitment);
                    console.log('[IDENTITY] On-chain registration successful');
                } catch (chainErr) {
                    console.warn('[IDENTITY] On-chain registration failed, continuing locally:', chainErr);
                    // Continue even if on-chain fails - user can register later
                }
            }

            // Store encrypted locally (always)
            await saveIdentity(newIdentity, signature);
            console.log('[IDENTITY] Saved to local vault');

            // Callback to parent
            onIdentityCreated(newIdentity, signature);
        } catch (error) {
            console.error('Identity creation failed:', error);
            setError(error.message || 'Failed to create identity. Make sure you are connected to the correct network.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { x: -10, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '1rem',
                        background: 'rgba(255, 51, 102, 0.1)',
                        border: '1px solid var(--accent-red)',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        color: 'var(--accent-red)',
                        fontSize: '0.8rem'
                    }}
                >
                    Error: {error}
                </motion.div>
            )}

            <motion.div className="input-group" variants={itemVariants}>
                <span className="input-label">DATE_OF_BIRTH</span>
                <input
                    type="date"
                    className="input-field"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
                <span className="input-label">NATIONALITY</span>
                <select
                    className="input-field"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                >
                    <option value="1">United States</option>
                    <option value="2">United Kingdom</option>
                    <option value="3">Germany</option>
                    <option value="4">India</option>
                    <option value="5">Other</option>
                </select>
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
                <span className="input-label">UNIVERSITY</span>
                <select
                    className="input-field"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                >
                    <option value="1001">MIT</option>
                    <option value="1002">Stanford</option>
                    <option value="1003">Harvard</option>
                    <option value="1004">Oxford</option>
                    <option value="1005">Other</option>
                </select>
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
                <span className="input-label">STUDENT_ID (OPTIONAL)</span>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
            </motion.div>

            <motion.div 
                className="input-group" 
                variants={itemVariants}
                style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}
            >
                <input
                    type="checkbox"
                    id="registerChain"
                    checked={registerOnChain}
                    onChange={(e) => setRegisterOnChain(e.target.checked)}
                    style={{ width: 'auto', margin: 0 }}
                />
                <label htmlFor="registerChain" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    Register on blockchain (requires ETH for gas)
                </label>
            </motion.div>

            <motion.button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                disabled={loading}
            >
                {loading ? 'CREATING...' : 'CREATE IDENTITY'}
            </motion.button>

            <div style={{ 
                fontSize: '0.65rem', 
                color: 'var(--text-dim)', 
                marginTop: '1rem', 
                textAlign: 'center',
                padding: '0.75rem',
                background: 'rgba(90, 90, 254, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(90, 90, 254, 0.2)'
            }}>
                {registerOnChain 
                    ? '⚠️ Signature request coming - you may be asked to sign TWICE (once for vault, once for on-chain registration)'
                    : '✓ Local-only mode: No ETH required, your identity stays in your browser vault'
                }
            </div>
        </motion.form>
    );
};

export default IdentityCreation;
