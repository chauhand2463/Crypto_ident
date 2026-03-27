import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MoveRight, Plus, Twitter, Github, MessageSquare, Shield, Cpu, Zap, Database, Globe, Fingerprint, Lock, UserCheck } from 'lucide-react';

const MatrixLine = ({ text }) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <div className="matrix-line">{displayed}<span className="cursor-blink">_</span></div>;
};

const LandingPage = ({ onEnter, isConnected, address }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const [matrixData, setMatrixData] = useState([]);
    useEffect(() => {
        const lines = [
            "INITIALIZING_ZK_PROVER_V3...",
            "NODE_CONNECTED: 0x72a...f91",
            "VERIFYING_AGE_PROOF_COMPLIANCE...",
            "SECURE_ENCLAVE: ACTIVE",
            "POSEIDON_HASH: VALIDATED",
            "GAS_OPTIMIZATION: 98.4%",
            "ENTROPY_COLLECTED: VALID",
            "IDENTITY_VAULT_ENCRYPTED: TRUE"
        ];
        const interval = setInterval(() => {
            setMatrixData(prev => [...prev.slice(-15), lines[Math.floor(Math.random() * lines.length)] + " [" + Math.random().toString(16).slice(2, 8) + "]"]);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

    const sidebarVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }
    };

    const rightSidebarVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }
    };

    return (
        <div className="mvc-landing">
            {/* Top Navigation */}
            <nav className="mvc-nav">
                <div className="nav-logo">ZK.ID</div>
                <div className="nav-links desktop-only">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#technology">Technology</a>
                    <a href="#docs">Docs</a>
                </div>
                <button className="join-community-btn desktop-only">Join Community</button>
                <button className="mobile-menu-btn mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        className="mobile-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <a href="#technology" onClick={() => setMobileMenuOpen(false)}>Technology</a>
                        <a href="#docs" onClick={() => setMobileMenuOpen(false)}>Docs</a>
                        <button className="join-community-btn" onClick={() => setMobileMenuOpen(false)}>Join Community</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mvc-main-layout">
                {/* Left Sidebar */}
                <motion.div
                    className="mvc-side-left"
                    variants={sidebarVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="feature-list">
                        <div className="feature-item"><Plus size={14} /> Zero-Knowledge Proofs</div>
                        <div className="feature-item"><Plus size={14} /> Self-Sovereign Identity</div>
                        <div className="feature-item"><Plus size={14} /> Privacy Preserving</div>
                        <div className="feature-item"><Plus size={14} /> On-Chain Verification</div>
                    </div>

                    <div className="mvc-join-us">
                        <h4>Connect</h4>
                        <div className="social-links">
                            <a href="#" target="_blank" rel="noopener noreferrer"><MessageSquare size={16} /> Discord</a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><Twitter size={16} /> Twitter</a>
                            <a href="https://github.com/chauhand2463" target="_blank" rel="noopener noreferrer"><Github size={16} /> GitHub</a>
                        </div>
                    </div>
                </motion.div>

                {/* Central Hero */}
                <motion.div
                    className="mvc-hero"
                    style={{ opacity: heroOpacity, scale: heroScale }}
                >
                    <motion.div
                        className="mvc-badge"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        ZERO-KNOWLEDGE IDENTITY
                    </motion.div>

                    <h1 className="mvc-title">
                        PROVE WHO YOU ARE <br />
                        <span className="highlight-purple">WITHOUT REVEALING</span>
                    </h1>

                    <p className="hero-subtitle">
                        The future of digital identity. Verify your age, nationality, or student status 
                        without exposing your sensitive data. Powered by advanced ZK-SNARKs cryptography.
                    </p>

                    {/* Central Eye Particle Graphic */}
                    <div className="eye-container">
                        <div className="eye-outer">
                            <motion.div
                                className="eye-particle-ring"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="eye-core">
                                <div className="pupil" />
                            </div>
                        </div>
                    </div>

                    <motion.button
                        className="mvc-cta"
                        onClick={onEnter}
                        whileHover={{ scale: 1.05 }}
                    >
                        {isConnected ? 'ACCESS DASHBOARD' : 'GET STARTED'}
                        <MoveRight size={20} />
                    </motion.button>
                </motion.div>

                {/* Right Sidebar */}
                <motion.div
                    className="mvc-side-right"
                    variants={rightSidebarVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="orbital-group">
                        <div className="orbital-item">
                            <div className="planet"><Shield size={24} /></div>
                            <span>Privacy First</span>
                        </div>
                        <div className="orbital-item">
                            <div className="planet"><Lock size={24} /></div>
                            <span>Secure Vault</span>
                        </div>
                        <div className="orbital-item">
                            <div className="planet"><UserCheck size={24} /></div>
                            <span>Verified You</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* NEW EXTREME SECTIONS */}
            <div className="mvc-landing-expanded" id="features">
                {/* Tech Core Section */}
                <section className="landing-section">
                    <span className="section-tag">01 // WHY_ZK_ID</span>
                    <h2 className="section-title">RECLAIM YOUR <br /> DIGITAL IDENTITY</h2>

                    <div className="tech-core-grid">
                        {[
                            { title: 'PRIVACY_BY_DESIGN', desc: 'Your data never leaves your device. We use AES-256 encryption and local proof generation.', icon: <Shield /> },
                            { title: 'SELECTIVE_DISCLOSURE', desc: 'Share only what you need. Prove "over 18" without showing your birth date.', icon: <Fingerprint /> },
                            { title: 'NON_CUSTODIAL', desc: 'You own your identity. No centralized database. No data breaches.', icon: <Database /> },
                            { title: 'GAS_OPTIMIZED', desc: 'Built on Polygon Amoy for minimal fees. Groth16 verification costs less than $0.01.', icon: <Zap /> }
                        ].map((tech, i) => (
                            <motion.div
                                key={i}
                                className="tech-card interactive-glass"
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    delay: i * 0.15,
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="tech-icon-large">{tech.icon}</div>
                                <h3 className="mono" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>{tech.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>{tech.desc}</p>
                                <div className="card-glow-fx" />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Matrix Scrolling Section */}
                <div className="matrix-container" id="how-it-works">
                    <div className="matrix-feed">
                        <AnimatePresence>
                            {matrixData.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <MatrixLine text={line} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, transparent 20%, #000 80%)' }}>
                        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <Cpu size={40} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                            <h2 className="view-header">HOW_IT_WORKS</h2>
                            <p className="mono" style={{ fontSize: '0.7rem' }}>CREATE_PROVE_VERIFY_IN_SECONDS</p>
                        </div>
                    </div>
                </div>

                {/* How It Works Steps */}
                <section className="landing-section" style={{ background: 'rgba(90, 90, 254, 0.02)' }}>
                    <span className="section-tag">02 // HOW_IT_WORKS</span>
                    <h2 className="section-title" style={{ textAlign: 'center' }}>THREE_SIMPLE_STEPS</h2>

                    <div className="steps-container">
                        {[
                            { num: '01', title: 'CREATE_VAULT', desc: 'Generate your encrypted identity vault locally. Your data is encrypted with AES-256-GCM.' },
                            { num: '02', title: 'GENERATE_PROOF', desc: 'Create a ZK proof that verifies your claim without revealing underlying data.' },
                            { num: '03', title: 'VERIFY_ONCHAIN', desc: 'Submit the proof to the blockchain. Verifiers check validity without seeing your data.' }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                className="step-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <div className="step-num">{step.num}</div>
                                <h3 className="mono" style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{step.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Architecture Deep-Dive */}
                <section className="landing-section" id="technology">
                    <span className="section-tag">03 // TECHNOLOGY</span>
                    <h2 className="section-title" style={{ textAlign: 'center' }}>TECHNICAL_STACK</h2>

                    <div className="arch-visual">
                        {[
                            { name: 'FRONTEND', sub: 'React + Vite + Framer Motion', color: 'var(--accent-secondary)' },
                            { name: 'ZK_CIRCUITS', sub: 'Circom 2.1 + Poseidon Hash', color: 'var(--accent-primary)' },
                            { name: 'SMART_CONTRACTS', sub: 'Solidity + UUPS Upgradeable', color: 'var(--accent-primary)' },
                            { name: 'BLOCKCHAIN', sub: 'Polygon Amoy Testnet', color: 'var(--text-dim)' }
                        ].map((layer, i) => (
                            <React.Fragment key={i}>
                                <motion.div
                                    className="arch-layer"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    style={{ borderColor: layer.color }}
                                >
                                    <h3 className="mono" style={{ color: layer.color }}>{layer.name}</h3>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>{layer.sub}</p>
                                </motion.div>
                                {i < 3 && <div className="arch-connector" />}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="landing-section" style={{ borderTop: 'var(--border-width) solid var(--border-dim)' }} id="docs">
                    <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <div className="nav-logo" style={{ marginBottom: '1rem' }}>ZK.ID</div>
                            <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                                © 2026 ZK Identity Protocol. <br />
                                SECURE_PRIVATE_SELF-SOVEREIGN.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                            <div className="mono" style={{ fontSize: '0.8rem' }}>
                                <p style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>RESOURCES</p>
                                <a href="#" style={{ display: 'block', marginBottom: '0.5rem', transition: 'color 0.3s' }} className="hover-link">Whitepaper</a>
                                <a href="#" style={{ display: 'block', marginBottom: '0.5rem', transition: 'color 0.3s' }} className="hover-link">Documentation</a>
                                <a href="https://github.com/chauhand2463" target="_blank" rel="noopener noreferrer" style={{ display: 'block', transition: 'color 0.3s' }} className="hover-link">GitHub</a>
                            </div>
                            <div className="mono" style={{ fontSize: '0.8rem' }}>
                                <p style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>COMMUNITY</p>
                                <a href="#" style={{ display: 'block', marginBottom: '0.5rem', transition: 'color 0.3s' }} className="hover-link">Discord</a>
                                <a href="#" style={{ display: 'block', marginBottom: '0.5rem', transition: 'color 0.3s' }} className="hover-link">Twitter</a>
                                <a href="#" style={{ display: 'block', transition: 'color 0.3s' }} className="hover-link">Telegram</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Background Effects */}
            <div className="mvc-bg-fx">
                <div className="noise-overlay" />
                <motion.div
                    className="mouse-glow"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(90, 90, 254, 0.08), transparent 40%)`
                    }}
                />
            </div>
        </div>
    );
};

export default LandingPage;
