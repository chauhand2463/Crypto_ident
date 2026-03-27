import React from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, AlertCircle, Cpu, ShieldCheck, Terminal, HelpCircle } from 'lucide-react';

const DiagnosticsGuide = () => {
    const errorGuides = [
        {
            title: "eth_call_LOGIC",
            desc: "Read-only simulation of a contract function. No state changed, no gas spent.",
            status: "SIMULATION_MODE"
        },
        {
            title: "UNRECOGNIZED_CONTRACT",
            desc: "The interface does not have the ABI (blueprint) for the target address.",
            status: "ABI_MISMATCH"
        },
        {
            title: "REVERT_WITHOUT_REASON",
            desc: "The EVM hit a failure condition without a custom error string. Common in legacy code.",
            status: "HARD_FAIL"
        }
    ];

    const commonCauses = [
        "Calling a function with invalid parameters.",
        "Access control violations (e.g., onlyOwner called by non-owner).",
        "Contract not deployed at address on current network.",
        "Dependent state is not initialized in contract.",
        "ABI mismatch - selector does not exist in bytecode.",
        "Revert hit in a modifier or fallback function."
    ];

    const debuggingSteps = [
        { step: "01", action: "VERIFY_NETWORK", detail: "Ensure contract is deployed at address on current chain (Hardhat/Amoy)." },
        { step: "02", action: "LOAD_CORRECT_ABI", detail: "Synchronize local ABI with deployed contract bytecode." },
        { step: "03", action: "VALIDATE_SIGNER", detail: "Check if the msg.sender has required permissions." },
        { step: "04", action: "MATCH_PARAMETERS", detail: "Verify types and ordering match the Solidity definition." },
        { step: "05", action: "ENABLE_REASONS", detail: "Compile with Solc 0.8+ and use custom error messages." }
    ];

    return (
        <div className="diagnostics-page">
            <header style={{ marginBottom: '3rem' }}>
                <div className="flex-between">
                    <div>
                        <h2 className="view-header">SYSTEM_DIAGNOSTICS</h2>
                        <p className="view-subtitle" style={{ color: 'var(--accent-secondary)' }}>EVM_ERROR_INTERPRETATION_ENGINE_v1.0</p>
                    </div>
                    <LifeBuoy size={32} color="var(--accent-secondary)" />
                </div>
            </header>

            <div className="dashboard-grid">
                <section className="col-left">
                    <div className="glass-card" style={{ marginBottom: '2rem' }}>
                        <h3 className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>ERROR_RECOGNITION_PATTERNS</h3>
                        <div className="diagnostics-grid">
                            {errorGuides.map((guide, i) => (
                                <motion.div
                                    key={i}
                                    className="diag-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                        padding: '1rem',
                                        border: '1px solid var(--border-dim)',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}
                                >
                                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-main)' }}>{guide.title}</span>
                                        <span className="mono" style={{ fontSize: '0.5rem', color: 'var(--accent-red)' }}>{guide.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>{guide.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-red)', marginBottom: '1.5rem' }}>COMMON_REVERSION_CAUSES</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {commonCauses.map((cause, i) => (
                                <li key={i} style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-dim)',
                                    marginBottom: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem'
                                }}>
                                    <AlertCircle size={12} color="var(--accent-red)" />
                                    {cause}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="col-right">
                    <div className="glass-card" style={{ height: '100%' }}>
                        <h3 className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', marginBottom: '2rem' }}>DEBUGGING_PROTOCOL</h3>
                        <div className="stepper">
                            {debuggingSteps.map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                                    <div className="step-num mono" style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: '1px solid var(--accent-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.6rem',
                                        color: 'var(--accent-secondary)',
                                        background: 'rgba(168, 85, 247, 0.1)'
                                    }}>
                                        {s.step}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{s.action}</h4>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>{s.detail}</p>
                                    </div>
                                    {i < debuggingSteps.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '11px',
                                            top: '24px',
                                            width: '1px',
                                            height: '24px',
                                            background: 'var(--border-dim)'
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            border: '1px solid var(--accent-primary)',
                            background: 'rgba(90, 90, 254, 0.05)',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center'
                        }}>
                            <Terminal size={20} color="var(--accent-primary)" />
                            <div>
                                <p className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-primary)' }}>PRO_TIP: TRACING</p>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Use `hardhat node` console logs or Tenderly to trace exact revert offsets.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DiagnosticsGuide;
