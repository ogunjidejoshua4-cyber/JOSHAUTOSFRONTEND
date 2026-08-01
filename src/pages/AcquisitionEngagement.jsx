import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AcquisitionEngagement = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Wait until AuthContext finishes checking if the user token is valid
        if (!loading && !user) {
            // 🛑 Strict Guard: Direct, instantaneous redirect to the login terminal
            navigate('/login', { replace: true });
        }
    }, [user, loading, navigate]);

    // Show an empty layout or brief loading state while context resolves
    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingPulse}>Authenticating Terminal Session...</div>
            </div>
        );
    }

    // 🟢 Render the engagement panel ONLY if the user successfully passes authentication
    if (user) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.successTitle}>⚡ Acquisition Engagement Portal</h2>
                    <p style={styles.text}>
                        Welcome back, <strong>{user.name}</strong>. Your session is authorized to initiate vehicle acquisition protocols or secure inventory listings.
                    </p>
                    <button style={styles.actionBtn} onClick={() => navigate('/cars')}>
                        Back to Showroom
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 75px)', 
        backgroundColor: '#020617', 
        padding: '1rem' 
    },
    loadingPulse: {
        color: '#3b82f6',
        fontSize: '1rem',
        fontWeight: '700',
        letterSpacing: '0.05em'
    },
    card: { 
        backgroundColor: '#0f172a', 
        border: '1px solid #1e293b', 
        borderRadius: '16px', 
        padding: '2.5rem', 
        maxWidth: '500px', 
        width: '100%', 
        textAlign: 'center', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' 
    },
    successTitle: { color: '#3b82f6', margin: '0 0 1rem 0', fontWeight: '800' },
    text: { color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' },
    actionBtn: { 
        backgroundColor: '#3b82f6', 
        color: '#ffffff', 
        border: 'none', 
        padding: '0.75rem 1.5rem', 
        borderRadius: '8px', 
        fontWeight: '600', 
        cursor: 'pointer', 
        fontSize: '0.9rem',
        transition: 'background-color 0.2s'
    }
};

export default AcquisitionEngagement;