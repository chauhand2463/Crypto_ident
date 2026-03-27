import { motion } from 'framer-motion';
import { Unlock, ShieldCheck, Wallet, AlertTriangle, RefreshCw } from 'lucide-react';

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
            {/* Visual background noise/glow from landing style */}
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
            >
                <div className="auth-header">
                    <h1 className="auth-logo">SECURITY_GATE</h1>
                    <div className="auth-subtitle">IDENTITY_VERIFICATION</div>
                </div>

                <div className="auth-status-box">
                    <div className="flex-between mono" style={{ fontSize: '0.7rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>NETWORK_STATUS:</span>
                        <span style={{ color: isConnected ? 'var(--accent-mint)' : '#ff4444' }}>
                            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                        </span>
                    </div>
                    {isConnected && (
                        <div className="mono" style={{ fontSize: '0.65rem', marginTop: '0.5rem', opacity: 0.6 }}>
                            WALLET: {address?.slice(0, 6)}...{address?.slice(-4)}
                        </div>
                    )}
                </div>

                {!isConnected ? (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Connect your wallet to access the ZK-Identity dashboard and manage your identity credentials.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={onConnect}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                        >
                            <Wallet size={18} /> CONNECT_WALLET
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        {hasStoredIdentity ? (
                            <>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                    Your encrypted identity vault was found. Sign to decrypt and access your credentials.
                                </p>
                                <button
                                    className="btn-primary"
                                    onClick={onUnlock}
                                    disabled={isUnlocking}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                                >
                                    {isUnlocking ? (
                                        <>DECRYPTING...</>
                                    ) : (
                                        <>
                                            <Unlock size={18} /> UNLOCK_VAULT
                                        </>
                                    )}
                                </button>
                                
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-dim)' }}>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '1rem' }}>
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
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                    No identity vault found. Create a new identity to get started with ZK verification.
                                </p>
                                <button
                                    className="btn-primary"
                                    onClick={onEnterDashboard}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                                >
                                    <ShieldCheck size={18} /> CREATE_IDENTITY
                                </button>
                            </>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AuthPage;
