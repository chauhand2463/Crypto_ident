import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ShieldCheck, Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { proveOnChain } from '../services/proof.service';

const STAGES = {
    IDLE: 'IDLE',
    PREPARING: 'PREPARING',
    PROVING: 'PROVING',
    SUBMITTING: 'SUBMITTING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

const ProofInterface = ({ identity, address, chainStatus }) => {
    const [status, setStatus] = useState(STAGES.IDLE);
    const [progress, setProgress] = useState(0);
    const [txHash, setTxHash] = useState(null);
    const [logs, setLogs] = useState([
        { type: 'info', msg: 'PROVING_SYSTEM_READY', time: new Date().toLocaleTimeString() }
    ]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [lastProofType, setLastProofType] = useState(null);
    const consoleRef = useRef(null);

    // Check if identity is registered on-chain
    const isRegisteredOnChain = chainStatus?.registered === true;

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev.slice(-20), { type, msg: msg.toUpperCase(), time: new Date().toLocaleTimeString() }]);
    };

    useEffect(() => {
        // Auto-log registration status
        if (chainStatus) {
            if (chainStatus.registered) {
                addLog('ONCHAIN_IDENTITY_DETECTED', 'success');
            } else {
                addLog('LOCAL_ONLY_IDENTITY', 'warn');
            }
        }
    }, [chainStatus]);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs]);

    const resetState = () => {
        setStatus(STAGES.IDLE);
        setProgress(0);
        setTxHash(null);
        setErrorMessage(null);
    };

    const executeProofFlow = async (type, label) => {
        if (!identity) {
            addLog('NO_IDENTITY_FOUND_PLEASE_CREATE_VAULT', 'error');
            setErrorMessage('Please create an identity first');
            return;
        }

        if (!isRegisteredOnChain) {
            addLog('IDENTITY_NOT_REGISTERED_ON_CHAIN', 'error');
            setErrorMessage('Your identity is not registered on-chain. Please register first or use local-only mode.');
            return;
        }

        resetState();
        setLastProofType(type);
        setStatus(STAGES.PREPARING);
        setProgress(10);
        addLog(`INITIATING_${label}_VERIFICATION`, 'warn');

        try {
            const nonce = Math.floor(Math.random() * 1000000);
            const now = new Date();
            const today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

            let inputs = {};

            if (type === 'AGE') {
                inputs = {
                    dob: identity.dob,
                    nationality: identity.nationality || 0,
                    studentId: identity.studentId || 0,
                    userSalt: BigInt('0x' + identity.salt).toString(),
                    identityHash: identity.identityHash,
                    currentDate: today,
                    minAge: 18,
                    nonce: nonce
                };
                addLog(`INPUTS_PREPARED: dob=${inputs.dob}, currentDate=${inputs.currentDate}`, 'info');
            } else if (type === 'NATIONALITY') {
                inputs = {
                    dob: identity.dob,
                    nationality: identity.nationality || 0,
                    studentId: identity.studentId || 0,
                    userSalt: BigInt('0x' + identity.salt).toString(),
                    identityHash: identity.identityHash,
                    requiredCountry: identity.nationality || 0,
                    nonce: nonce
                };
                addLog(`INPUTS_PREPARED: nationality=${inputs.nationality}`, 'info');
            } else if (type === 'UNIVERSITY') {
                inputs = {
                    dob: identity.dob,
                    nationality: identity.nationality || 0,
                    studentId: identity.studentId || 0,
                    userSalt: BigInt('0x' + identity.salt).toString(),
                    identityHash: identity.identityHash,
                    universityCode: identity.university || 0,
                    expectedUniversity: identity.university || 0,
                    nonce: nonce
                };
                addLog(`INPUTS_PREPARED: university=${inputs.universityCode}`, 'info');
            }

            setStatus(STAGES.PROVING);
            setProgress(30);
            addLog('GENERATING_ZK_PROOF', 'info');

            // Simulate proving progress
            await new Promise(r => setTimeout(r, 1000));
            setProgress(50);

            const hash = await proveOnChain(type, inputs);
            
            setStatus(STAGES.SUBMITTING);
            setProgress(80);
            addLog('TRANSACTION_SUBMITTED_AWAITING_CONFIRMATION', 'info');

            setTxHash(hash);
            setStatus(STAGES.SUCCESS);
            setProgress(100);
            addLog(`VERIFICATION_SUCCESS_TX: ${hash.slice(0, 20)}...`, 'success');
            addLog(`${label}_CLAIM_VERIFIED`, 'success');

        } catch (error) {
            console.error('Proof error:', error);
            setStatus(STAGES.ERROR);
            setProgress(0);
            setErrorMessage(error.message || 'Unknown error occurred');
            addLog(`ERROR: ${error.message}`, 'error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const isProcessing = status !== STAGES.IDLE && status !== STAGES.SUCCESS && status !== STAGES.ERROR;

    const getStatusIcon = () => {
        switch (status) {
            case STAGES.SUCCESS:
                return <CheckCircle size={16} className="success-icon" />;
            case STAGES.ERROR:
                return <XCircle size={16} style={{ color: 'var(--accent-red)' }} />;
            case STAGES.PROVING:
            case STAGES.SUBMITTING:
                return <Loader2 size={16} className="spin" />;
            default:
                return null;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case STAGES.SUCCESS:
                return 'var(--accent-mint)';
            case STAGES.ERROR:
                return 'var(--accent-red)';
            case STAGES.PROVING:
            case STAGES.SUBMITTING:
                return 'var(--accent-primary)';
            default:
                return 'var(--text-dim)';
        }
    };

    return (
        <motion.div 
            className="proof-container" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}
        >
            {/* Header */}
            <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '1rem', color: 'var(--text-main)', letterSpacing: '0.15em', margin: 0, fontFamily: 'var(--font-mono)' }}>
                        ZK_PROVING_ENGINE
                    </h2>
                    <div style={{ position: 'relative' }}>
                        <HelpCircle
                            size={14}
                            style={{ color: 'var(--accent-primary)', cursor: 'pointer', opacity: 0.7 }}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        />
                        <AnimatePresence>
                            {showTooltip && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '150%',
                                        left: '-10px',
                                        width: '260px',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--accent-primary)',
                                        padding: '1rem',
                                        zIndex: 100,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                                        Generate zero-knowledge proofs to verify your credentials without revealing sensitive data.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.6rem',
                    padding: '0.3rem 0.8rem',
                    border: '1px solid var(--border-dim)',
                    borderRadius: '4px',
                    color: getStatusColor(),
                    fontFamily: 'var(--font-mono)'
                }}>
                    {getStatusIcon()}
                    <span>{status}</span>
                </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="flex-between" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                        <span>PROCESSING</span>
                        <span>{progress}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', stiffness: 100 }}
                            style={{ height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Error Display */}
            {(status === STAGES.ERROR || errorMessage) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '1rem',
                        background: 'rgba(255, 51, 102, 0.1)',
                        border: '1px solid var(--accent-red)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                    }}
                >
                    <AlertTriangle size={18} style={{ color: 'var(--accent-red)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>
                            VERIFICATION_FAILED
                        </div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginBottom: '0.75rem' }}>
                            {errorMessage || 'Unknown error occurred'}
                        </div>
                        {status === STAGES.ERROR && !isRegisteredOnChain && (
                            <button 
                                onClick={resetState}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    background: 'var(--accent-primary)',
                                    border: 'none',
                                    color: '#000',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: '600'
                                }}
                            >
                                GO TO REGISTRY TO REGISTER
                            </button>
                        )}
                        {status === STAGES.ERROR && isRegisteredOnChain && (
                            <button 
                                onClick={resetState}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    background: 'transparent',
                                    border: '1px solid var(--accent-red)',
                                    color: 'var(--accent-red)',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-mono)'
                                }}
                            >
                                TRY_AGAIN
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Success Display */}
            {status === STAGES.SUCCESS && txHash && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '1rem',
                        background: 'rgba(0, 255, 153, 0.05)',
                        border: '1px solid var(--accent-mint)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                    }}
                >
                    <CheckCircle size={18} style={{ color: 'var(--accent-mint)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--accent-mint)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                            PROOF_VERIFIED_ONCHAIN
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                            TX: {txHash}
                        </div>
                        <a
                            href={`https://amoy.polygonscan.com/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                                display: 'inline-block',
                                marginTop: '0.75rem',
                                color: 'var(--accent-primary)', 
                                fontSize: '0.65rem',
                                textDecoration: 'underline' 
                            }}
                        >
                            VIEW_ON_EXPLORER
                        </a>
                    </div>
                </motion.div>
            )}

            {/* Proof Actions */}
            <motion.div className="proof-grid" variants={containerVariants}>
                <ProofAction
                    label="AGE_VERIFICATION"
                    desc="Prove you are over 18 without revealing your birth date"
                    loading={isProcessing && lastProofType === 'AGE'}
                    onClick={() => executeProofFlow('AGE', 'AGE')}
                    status={status}
                />
                <ProofAction
                    label="NATIONALITY"
                    desc="Verify your nationality without showing ID documents"
                    loading={isProcessing && lastProofType === 'NATIONALITY'}
                    onClick={() => executeProofFlow('NATIONALITY', 'NAT')}
                    status={status}
                />
                <ProofAction
                    label="STUDENT_STATUS"
                    desc="Prove student enrollment without exposing student ID"
                    loading={isProcessing && lastProofType === 'UNIVERSITY'}
                    onClick={() => executeProofFlow('UNIVERSITY', 'STU')}
                    status={status}
                />
            </motion.div>

            {/* Console Logs */}
            <motion.div 
                variants={itemVariants} 
                ref={consoleRef}
                style={{
                    flex: 1,
                    minHeight: '150px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-dim)',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem'
                }}
            >
                <AnimatePresence>
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                marginBottom: '0.25rem',
                                color: log.type === 'error' ? 'var(--accent-red)' : log.type === 'success' ? 'var(--accent-mint)' : log.type === 'warn' ? 'var(--accent-secondary)' : 'var(--text-dim)'
                            }}
                        >
                            <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>[{log.time}]</span>
                            <span>{log.msg}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

const ProofAction = ({ label, desc, loading, onClick, status }) => {
    const isDisabled = status === STAGES.PROVING || status === STAGES.SUBMITTING;

    return (
        <motion.div
            style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-dim)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
            }}
            whileHover={{ borderColor: 'var(--accent-primary)', transform: 'translateY(-2px)' }}
        >
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', margin: 0, fontFamily: 'var(--font-mono)' }}>
                    {label}
                </h3>
                {loading && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                            width: '12px',
                            height: '12px',
                            border: '2px solid var(--accent-primary)',
                            borderTopColor: 'transparent',
                            borderRadius: '50%'
                        }}
                    />
                )}
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginBottom: '1rem', lineHeight: '1.5', flex: 1 }}>
                {desc}
            </p>
            <button 
                onClick={onClick} 
                disabled={isDisabled}
                style={{
                    padding: '0.6rem 1rem',
                    background: isDisabled ? 'var(--text-dim)' : 'var(--accent-primary)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}
            >
                {loading ? 'PROCESSING...' : 'GENERATE_PROOF'}
            </button>
        </motion.div>
    );
};

export default ProofInterface;
