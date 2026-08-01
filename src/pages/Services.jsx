import { useState, useEffect } from 'react';

const Services = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const servicePackages = [
        {
            icon: "🌐",
            title: "Global Asset Sourcing",
            desc: "Leverage our worldwide network to acquire rare, limited-allocation supercars and luxury specs directly from international collections.",
            features: ["Custom duties clearance", "Enclosed logistics tracking", "Full history auditing"]
        },
        {
            icon: "🛡️",
            title: "Premium Consignment",
            desc: "Maximize asset returns. Our high-tier marketing protocols expose your exotic or high-performance vehicle directly to verified buyers.",
            features: ["Professional media capture", "Showroom floor placement", "Vetted buyer handling"]
        },
        {
            icon: "⚙️",
            title: "Bespoke Performance & Tuning",
            desc: "Calibrate throttle metrics, exhaust signatures, and aerodynamic profiles through our specialized in-house technician squad.",
            features: ["ECU remapping & diagnostics", "OEM carbon installations", "Suspension geometric tuning"]
        },
        {
            icon: "💎",
            title: "VIP Fleet Management",
            desc: "Maintain your private collection effortlessly. We supervise scheduled service updates, detailing regimes, and asset valuations.",
            features: ["Climate-controlled staging", "Routine mechanical conditioning", "Valuation trend profiling"]
        }
    ];

    return (
        <div style={{ ...styles.container, padding: '3rem 1rem 4rem' }}>
            {/* Header Section */}
            <div style={styles.header}>
                <h1 style={{ ...styles.mainTitle, fontSize: '2.3rem' }}>Operational Ecosystem</h1>
                <p style={{ ...styles.subtitle, fontSize: '0.95rem' }}>
                    Elite automotive provisions engineered around procurement precision, performance optimization, and premium asset management.
                </p>
                <hr style={styles.divider} />
            </div>

            {/* Core Services Grid Matrix */}
            <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                {servicePackages.map((pkg, idx) => (
                    <div key={idx} style={styles.serviceCard}>
                        <div style={styles.iconContainer}>{pkg.icon}</div>
                        <h3 style={styles.cardTitle}>{pkg.title}</h3>
                        <p style={styles.cardDesc}>{pkg.desc}</p>
                        
                        <div style={styles.featureList}>
                            {pkg.features.map((feat, fIdx) => (
                                <div key={fIdx} style={styles.featureItem}>
                                    <span style={styles.checkMark}>✓</span> {feat}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Call to Action Section */}
            <div style={styles.ctaBox}>
                <h3 style={styles.ctaTitle}>Require Private Procurement or Operations?</h3>
                <p style={styles.ctaDesc}>
                    Initiate a direct line with our private client office to execute custom sourcing directives or schedule mechanical staging.
                </p>
                <button 
                    onClick={() => window.location.href = 'mailto:concierge@joshautos.com'} 
                    style={styles.ctaBtn}
                >
                    ✉ Contact Executive Concierge
                </button>
            </div>
        </div>
    );
};

// 🌌 High-End Luxury Design System Tokens
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#090d16',
        color: '#f8fafc',
        padding: '5rem 2rem',
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at top left, #1e1b4b 0%, #090d16 60%)'
    },
    header: {
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 4.5rem auto'
    },
    mainTitle: {
        fontSize: '3rem',
        fontWeight: '900',
        letterSpacing: '-0.05em',
        textTransform: 'uppercase',
        margin: 0,
        color: '#ffffff'
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#64748b',
        marginTop: '1rem',
        lineHeight: '1.6',
        fontWeight: '500'
    },
    divider: {
        border: 'none',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
        width: '50%',
        margin: '2rem auto 0 auto'
    },
    grid: {
        display: 'grid',
        gap: '2.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    serviceCard: {
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(51, 65, 85, 0.4)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxSizing: 'border-box',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 25px 35px -15px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s ease'
    },
    iconContainer: {
        fontSize: '2.2rem',
        marginBottom: '1.25rem'
    },
    cardTitle: {
        fontSize: '1.4rem',
        fontWeight: '800',
        color: '#ffffff',
        margin: '0 0 0.75rem 0',
        letterSpacing: '-0.02em'
    },
    cardDesc: {
        color: '#94a3b8',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        margin: '0 0 1.5rem 0'
    },
    featureList: {
        borderTop: '1px solid rgba(51, 65, 85, 0.5)',
        paddingTop: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
    },
    featureItem: {
        fontSize: '0.85rem',
        color: '#cbd5e1',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    checkMark: {
        color: '#3b82f6',
        fontWeight: '900'
    },
    ctaBox: {
        maxWidth: '700px',
        margin: '5rem auto 0 auto',
        backgroundColor: '#111827',
        border: '1px solid #3b82f6',
        borderRadius: '24px',
        padding: '2.5rem',
        textAlign: 'center',
        boxShadow: '0 0 35px rgba(59, 130, 246, 0.15)'
    },
    ctaTitle: {
        fontSize: '1.3rem',
        fontWeight: '800',
        color: '#ffffff',
        margin: '0 0 0.5rem 0'
    },
    ctaDesc: {
        color: '#94a3b8',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        margin: '0 0 1.5rem 0'
    },
    ctaBtn: {
        background: '#ffffff',
        color: '#090d16',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '14px',
        fontWeight: '800',
        fontSize: '0.95rem',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s ease'
    }
};

export default Services;