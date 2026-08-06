import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { showToast, showErrorAlert } from '../utils/swal';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 500);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const trimmedEmail = email.trim().toLowerCase();

        try {
            // ⚡ Grab response payload returned from AuthContext
            const responseData = await login(trimmedEmail, password);
            setLoading(false);

            if (responseData && (responseData.success || responseData.status)) {
                setPassword('');
                const redirectPath = location.state?.from || '/showroom';

                // Route dynamically based on user role
                if (responseData.user && responseData.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate(redirectPath, { replace: true });
                }
            } else {
                setError('Invalid credentials. Access Denied.');
            }
        } catch (err) {
            setLoading(false);
            const responseData = err.response?.data;

            if (responseData?.unverified === true) {
                showToast('Account unverified. Redirecting to verification...', 'warning');
                return navigate('/verify-email', {
                    state: { email: responseData.email || trimmedEmail }
                });
            }

            showErrorAlert('Authentication Failed', responseData?.message || 'Invalid credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ ...styles.loginCard, padding: isMobile ? '2rem 1.5rem' : '3rem' }}>
                <header style={styles.header}>
                    <h2 style={styles.title}>System Authorization</h2>
                    <p style={styles.subtitle}>Provide terminal keys to verify administrative privileges.</p>
                </header>

                {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Secure Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            style={styles.input}
                            placeholder="name@company.com"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={styles.label}>Access Key Passcode</label>
                            <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={loading ? styles.btnDisabled : styles.btn}>
                        {loading ? 'Verifying Credentials...' : 'Authenticate Identity'}
                    </button>

                    <div style={styles.dividerContainer}>
                        <span style={styles.dividerLine}></span>
                        <span style={styles.dividerText}>OR</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => window.location.href = 'https://josh-autos-backend.onrender.com/api/auth/google'}
                        style={styles.googleBtn}
                    >
                        <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.423 1.487 15.62 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-2.405H12.24z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Register Here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', backgroundColor: '#0f172a', padding: '1rem', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' },
    loginCard: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)', width: '100%', maxWidth: '450px', boxSizing: 'border-box' },
    header: { textAlign: 'center', marginBottom: '2rem' },
    title: { margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em' },
    subtitle: { color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: '1.4' },
    errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' },
    forgotLink: { fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none', fontWeight: '600' },
    input: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border 0.2s' },
    btn: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)', marginTop: '0.5rem' },
    btnDisabled: { background: '#475569', color: '#94a3b8', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'not-allowed', marginTop: '0.5rem' },
    dividerContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0', gap: '1rem' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: '#334155' },
    dividerText: { color: '#64748b', fontSize: '0.75rem', fontWeight: '700' },
    googleBtn: { width: '100%', padding: '0.85rem', backgroundColor: '#ffffff', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
};

export default Login;