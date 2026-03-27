import { motion } from 'framer-motion';
import { Unlock, ShieldCheck, Wallet, AlertTriangle, RefreshCw, Shield, Lock, KeyRound } from 'lucide-react';

const AuthPage = ({
    isConnected,
    address,
    onConnect,
    onUnlock,
    isUnlocking,
    hasStoredIdentity,
    onEnterDashboard
}) => {
    const handleCreateNew = () => {
        localStorage.removeItem('zk_identity_profile');
        onEnterDashboard();
    };

    return (
        <div className="auth-container">
            <div className="mvc-bg-fx">
                <div className="noise-overlay" />
            </div>

            <motion.div
                className="auth-card glass-card"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                }}
                style={{
                    maxWidth: '480px',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(90, 90, 254, 0.05) 100%)'
                }}
            >
                <div className="auth-header">
                    <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 8px 30px rgba(90, 90, 254, 0.3)'
                    }}>
                        <Shield size={32} color="#000" />
                    </div>
                    <h1 className="auth-logo" style={{ fontSize: '1.8rem' }}>ZK.IDENTITY</h1>
                    <div className="auth-subtitle">SECURE ACCESS GATEWAY</div>
                </div>

                <div className="auth-status-box" style={{
                    background: isConnected 
                        ? 'linear-gradient(135deg, rgba(0, 255, 153, 0.05) 0%, rgba(0, 200, 120, 0.02) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 68, 68, 0.05) 0%, rgba(255, 0, 0, 0.02) 100%)',
                    borderLeft: isConnected ? '3px solid var(--accent-mint)' : '3px solid #ff4444'
                }}>
                    <div className="flex-between mono" style={{ fontSize: '0.7rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>NETWORK_STATUS:</span>
                        <span style={{ color: isConnected ? 'var(--accent-mint)' : '#ff4444' }}>
                            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                        </span>
                    </div>
                    {isConnected && (
                        <div className="mono" style={{ fontSize: '0.65rem', marginTop: '0.5rem', opacity: 0.6 }}>
                            <KeyRound size={10} style={{ marginRight: 4 }} />
                            WALLET: {address?.slice(0, 6)}...{address?.slice(-4)}
                        </div>
                    )}
                </div>

                {!isConnected ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            padding: '1.5rem', 
                            background: 'rgba(90, 90, 254, 0.05)', 
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            border: '1px solid var(--border-dim)'
                        }}>
                            <Lock size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                                Connect your wallet to access the ZK-Identity dashboard and manage your identity credentials with military-grade encryption.
                            </p>
                        </div>
                        <motion.button
                            className="btn-primary"
                            onClick={onConnect}
                            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(90, 90, 254, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}
                        >
                            <Wallet size={18} /> CONNECT WALLET
                        </motion.button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        {hasStoredIdentity ? (
                            <>
                                <div style={{ 
                                    padding: '1.5rem', 
                                    background: 'linear-gradient(135deg, rgba(90, 90, 254, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)', 
                                    borderRadius: '12px',
                                    marginBottom: '2rem',
                                    border: '1px solid rgba(90, 90, 254, 0.2)'
                                }}>
                                    <Unlock size={28} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', lineHeight: '1.6', margin: 0 }}>
                                        Your encrypted identity vault was found. Sign to decrypt and access your credentials.
                                    </p>
                                </div>
                                <motion.button
                                    className="btn-primary"
                                    onClick={onUnlock}
                                    disabled={isUnlocking}
                                    whileHover={{ scale: isUnlocking ? 1 : 1.02 }}
                                    whileTap={{ scale: isUnlocking ? 1 : 0.98 }}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}
                                >
                                    {isUnlocking ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                style={{ width: '16px', height: '16px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%' }}
                                            />
                                            DECRYPTING...
                                        </>
                                    ) : (
                                        <>
                                            <Unlock size={18} /> UNLOCK VAULT
                                        </>
                                    )}
                                </motion.button>
                                
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-dim)' }}>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginBottom: '1rem' }}>
                                        Using a different wallet or vault corrupted?
                                    </p>
                                    <button
                                        className="btn-secondary"
                                        onClick={handleCreateNew}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.7rem' }}
                                    >
                                        <RefreshCw size={14} /> CREATE NEW IDENTITY
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ 
                                    padding: '1.5rem', 
                                    background: 'linear-gradient(135deg, rgba(0, 255, 153, 0.05) 0%, rgba(0, 200, 120, 0.02) 100%)', 
                                    borderRadius: '12px',
                                    marginBottom: '2rem',
                                    border: '1px solid rgba(0, 255, 153, 0.1)'
                                }}>
                                    <ShieldCheck size={28} style={{ color: 'var(--accent-mint)', marginBottom: '0.75rem' }} />
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', lineHeight: '1.6', margin: 0 }}>
                                        No identity vault found. Create a new identity to get started with zero-knowledge verification.
                                    </p>
                                </div>
                                <motion.button
                                    className="btn-primary"
                                    onClick={onEnterDashboard}
                                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 255, 153, 0.4)' }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}
                                >
                                    <ShieldCheck size={18} /> CREATE IDENTITY
                                </motion.button>
                            </>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AuthPage;
