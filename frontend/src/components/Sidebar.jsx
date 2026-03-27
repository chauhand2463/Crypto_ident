import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, ArrowRightLeft, Binary, BarChart3, ShieldAlert, HelpCircle, Shield } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const menuItems = [
        { id: 'registry', label: 'Identity Vault', icon: <LayoutDashboard size={18} /> },
        { id: 'prover', label: 'Proving System', icon: <Binary size={18} /> },
        { id: 'exchange', label: 'Emerald Exchange', icon: <ArrowRightLeft size={18} /> },
        { id: 'analytics', label: 'Security Hub', icon: <BarChart3 size={18} /> },
        { id: 'diagnostics', label: 'Diagnostics', icon: <HelpCircle size={18} /> },
        { id: 'admin', label: 'Admin Portal', icon: <ShieldAlert size={18} /> }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                    <div style={{ 
                        width: '42px', 
                        height: '42px', 
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(90, 90, 254, 0.3)'
                    }}>
                        <Shield size={22} color="#000" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', letterSpacing: '-0.05em', margin: 0 }}>ZK<span style={{ color: 'var(--accent-primary)' }}>.ID</span></h1>
                        <div className="mono" style={{ fontSize: '0.5rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>CORE_PROTOCOL_v4.2</div>
                    </div>
                </motion.div>
            </div>

            <nav className="nav-list" style={{ flex: 1 }}>
                {menuItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: activeTab === item.id ? 'var(--accent-primary)' : 'var(--text-dim)'
                        }}>
                            {item.icon}
                        </div>
                        <span>{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div 
                                layoutId="activeIndicator"
                                style={{ 
                                    position: 'absolute', 
                                    right: 0, 
                                    width: '3px', 
                                    height: '60%', 
                                    background: 'var(--accent-primary)',
                                    borderRadius: '2px'
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div
                    className="nav-item"
                    onClick={onLogout}
                    style={{ color: 'var(--accent-red)', opacity: 0.7 }}
                >
                    <LogOut size={18} />
                    <span>Terminate Session</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
