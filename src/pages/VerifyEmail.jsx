import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { setToken, setUser } = useContext(AuthContext);

    // Retrieve email sent from the registration screen state fallback
    const email = location.state?.email || '';

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const res = await axios.post('https://josh-autos-backend.onrender.com/api/auth/verify-code', {
                email,
                code
            });

            if (res.data.status === true || res.data.success === true) {
                setCode('');

                // Store token & update AuthContext
                localStorage.setItem('token', res.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                setToken(res.data.token);
                setUser(res.data.user);
                
                // 🎯 DYNAMIC ROLE-BASED REDIRECT:
                // If the user's role is admin, route to /admin, otherwise route to /showroom
                if (res.data.user && res.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/showroom');
                }
            } else {
                setError(res.data.message || 'Invalid verification code. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Verification failed. Check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError('');
        setSuccessMessage('');
        try {
            const res = await axios.post('https://josh-autos-backend.onrender.com/api/auth/resend-code', { email });
            if (res.data.status === true || res.data.success === true) {
                setSuccessMessage('A new verification code has been sent to your Gmail!');
                setCode(''); // Clean code input on resend too
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code. Please try again later.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Check Your Gmail 📧</h2>
                <p style={styles.subtitle}>
                    We sent a verification code to <strong style={{ color: '#ffffff' }}>{email || 'your email'}</strong>. Please enter it below.
                </p>

                {error && <div style={styles.errorAlert}>⚠️ {error}</div>}
                {successMessage && <div style={styles.successAlert}>✅ {successMessage}</div>}

                <form onSubmit={handleVerify} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Enter 6-Digit Code"
                        maxLength="6"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <button type="submit" disabled={loading} style={styles.verifyBtn}>
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>

                <p style={styles.resendText}>
                    Didn't get the code?{' '}
                    <span onClick={handleResendCode} style={styles.resendLink}>
                        Resend Code
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: 'calc(100vh - 75px)',
        backgroundColor: '#0f172a',
        display: 'flex',
        justifycontent: 'center',
        alignItems: 'center',
        padding: '1rem',
        fontFamily: '"Inter", sans-serif'
    },
    card: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        padding: '2.5rem 2rem',
        borderRadius: '12px',
        maxWidth: '420px',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center'
    },
    title: { color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '800' },
    subtitle: { color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.5' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    input: {
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        color: '#ffffff',
        padding: '0.85rem 1rem',
        fontSize: '1.2rem',
        letterSpacing: '4px',
        textAlign: 'center',
        outline: 'none',
        transition: 'border 0.2s',
        width: '100%',
        boxSizing: 'border-box'
    },
    verifyBtn: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.85rem',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background 0.2s'
    },
    errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem', border: '1px solid #ef4444', fontWeight: '600' },
    successAlert: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem', border: '1px solid #10b981', fontWeight: '600' },
    resendText: { color: '#94a3b8', fontSize: '0.9rem', marginTop: '1.5rem' },
    resendLink: { color: '#38bdf8', cursor: 'pointer', fontWeight: '700', textDecoration: 'none', marginLeft: '0.25rem' }
};

export default VerifyEmail;