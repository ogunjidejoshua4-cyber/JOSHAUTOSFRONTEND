import { useState, useEffect } from 'react';

const About = () => {
    const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
    const [isTablet, setIsTablet] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const performanceMetrics = [
        { metric: "150+", label: "Assets Procured" },
        { metric: "₦4.5B+", label: "Transaction Volume" },
        { metric: "99.4%", label: "Vetted Authentication" },
        { metric: "24/7", label: "Concierge Coverage" }
    ];

    return (
        <div style={{ ...styles.container, padding: isMobile ? '3rem 1rem 4rem' : isTablet ? '4rem 1.5rem 4.5rem' : '5rem 2rem' }}>
            {/* Context/Header Segment */}
            <div style={{ ...styles.header, marginBottom: isMobile ? '3rem' : '4.5rem' }}>
                <h1 style={{ ...styles.mainTitle, fontSize: isMobile ? '2rem' : isTablet ? '2.6rem' : '3rem' }}>Our Legacy</h1>
                <p style={{ ...styles.subtitle, fontSize: isMobile ? '0.95rem' : '1.05rem' }}>
                    Redefining luxury automotive acquisitions through mechanical transparency, structural integrity, and elite transactional security.
                </p>
                <hr style={{ ...styles.divider, width: isMobile ? '80%' : '50%' }} />
            </div>

            {/* Split Content Section: Narrative & Statistics Grid */}
            <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? '2.25rem' : '4rem' }}>
                
                {/* Left Side: Brand Narrative Statement */}
                <div style={{ ...styles.narrativeColumn, gap: isMobile ? '1rem' : '1.25rem' }}>
                    <h2 style={{ ...styles.sectionHeading, fontSize: isMobile ? '1.4rem' : '1.75rem' }}>The Operational Standard</h2>
                    <p style={{ ...styles.paragraph, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                        Founded on the principles of extreme engineering precision and absolute client transparency, Josh Autos stands as a premier digital terminal for exotic, luxury, and high-performance vehicles. We reject the paradigms of traditional dealerships, replacing high-pressure sales with structured asset valuation metrics.
                    </p>
                    <p style={{ ...styles.paragraph, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                        Every unit cataloged within our digital repository passes through an extensive physical audit, multi-point diagnostic assessment, and strict provenance verification pipeline before it ever touches our showroom floor or web ledger.
                    </p>
                    <p style={{ ...styles.paragraph, fontSize: isMobile ? '0.95rem' : '1rem' }}>
                        Whether managing multi-asset private collections, routing discrete international sourcing inquiries, or executing automated tokenized holding deposits via our secure Paystack architecture, we scale our ecosystem around your absolute peace of mind.
                    </p>
                </div>

                {/* Right Side: Analytical Data Grid */}
                <div style={styles.metricsColumn}>
                    <div style={{ ...styles.metricsCardGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '0.85rem' : '1rem' }}>
                        {performanceMetrics.map((item, idx) => (
                            <div key={idx} style={styles.metricCard}>
                                <div style={styles.metricNumber}>{item.metric}</div>
                                <div style={styles.metricLabel}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Core Values / Pillar Section */}
            <div style={{ ...styles.valuesSection, margin: isMobile ? '4.5rem auto 0 auto' : '7rem auto 0 auto', paddingTop: isMobile ? '3rem' : '4rem' }}>
                <h3 style={{ ...styles.valuesMainTitle, fontSize: isMobile ? '1.25rem' : '1.5rem', marginBottom: isMobile ? '2rem' : '3rem' }}>Our Operational Pillars</h3>
                <div style={{ ...styles.valuesGrid, gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '1rem' : '2rem' }}>
                    <div style={{ ...styles.pillarCard, padding: isMobile ? '1.5rem' : '2rem' }}>
                        <div style={styles.pillarIcon}>🔒</div>
                        <h4 style={styles.pillarTitle}>Absolute Security</h4>
                        <p style={styles.pillarText}>Every transaction, financial deposit, and inquiry routing packet runs through fully authenticated, encrypted pipelines.</p>
                    </div>
                    <div style={{ ...styles.pillarCard, padding: isMobile ? '1.5rem' : '2rem' }}>
                        <div style={styles.pillarIcon}>🏎️</div>
                        <h4 style={styles.pillarTitle}>Uncompromising Quality</h4>
                        <p style={styles.pillarText}>We completely audit technical specifications, actual wear profiles, and engine mappings prior to catalog onboarding.</p>
                    </div>
                    <div style={{ ...styles.pillarCard, padding: isMobile ? '1.5rem' : '2rem' }}>
                        <div style={styles.pillarIcon}>💼</div>
                        <h4 style={styles.pillarTitle}>Discretionary Focus</h4>
                        <p style={styles.pillarText}>Bespoke global asset logistics and private client interface architectures tailored around executive schedules.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 🌌 High-Performance Elite Design System UI Tokens
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
        gap: '4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'center'
    },
    narrativeColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
    },
    sectionHeading: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#ffffff',
        margin: '0 0 0.5rem 0',
        letterSpacing: '-0.02em'
    },
    paragraph: {
        color: '#cbd5e1',
        fontSize: '1rem',
        lineHeight: '1.7',
        margin: 0
    },
    metricsColumn: {
        width: '100%'
    },
    metricsCardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
    },
    metricCard: {
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(51, 65, 85, 0.4)',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5)'
    },
    metricNumber: {
        fontSize: '2.25rem',
        fontWeight: '900',
        color: '#38bdf8',
        letterSpacing: '-0.03em'
    },
    metricLabel: {
        color: '#94a3b8',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginTop: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    valuesSection: {
        maxWidth: '1200px',
        margin: '7rem auto 0 auto',
        borderTop: '1px solid rgba(51, 65, 85, 0.3)',
        paddingTop: '4rem'
    },
    valuesMainTitle: {
        fontSize: '1.5rem',
        fontWeight: '850',
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: '3rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    valuesGrid: {
        display: 'grid',
        gap: '2rem'
    },
    pillarCard: {
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '2rem',
        transition: 'border 0.3s ease'
    },
    pillarIcon: {
        fontSize: '1.75rem',
        marginBottom: '1rem'
    },
    pillarTitle: {
        fontSize: '1.15rem',
        fontWeight: '700',
        color: '#ffffff',
        margin: '0 0 0.5rem 0'
    },
    pillarText: {
        color: '#94a3b8',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        margin: 0
    }
};

export default About;