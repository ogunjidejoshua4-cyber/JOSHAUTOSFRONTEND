import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert } from '../utils/swal';

const Register = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminSecretCode: '' // 🎯 Match backend expectation exactly
    });

    const [showAdminField, setShowAdminField] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, confirmPassword, adminSecretCode } = formData;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        setLoading(true);

        try {
            const res = await axios.post('https://josh-autos-backend.onrender.com/api/auth/register', {
                name,
                email,
                password,
                adminSecretCode: showAdminField ? adminSecretCode : undefined
            });

            if (res.data.status === true || res.data.success === true) {
                if (res.data.role === 'admin') {
                    await showSuccessAlert(
                        'Admin Access Granted 👑',
                        'System administrator profile created successfully. Proceeding to terminal login.'
                    );
                    navigate('/login');
                } else {
                    await showSuccessAlert(
                        'Verification Code Sent 📧',
                        'Please check your Gmail inbox to complete authentication.'
                    );
                    navigate('/verify-email', { state: { email: email } });
                }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failure.';
            showErrorAlert('Registration Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ ...styles.registerCard, padding: '1.5rem 1rem' }}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Join the JOSH-AUTOS asset allocation network</p>

                {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

                <form onSubmit={handleFormSubmit} style={styles.formStructure}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                            style={styles.inputField}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="operator@domain.com"
                            required
                            style={styles.inputField}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password Matrix</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                            style={styles.inputField}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                            style={styles.inputField}
                        />
                    </div>

                    {/* 🛠️ Admin Clearance Mode Option Switch */}
                    <div style={styles.adminToggleRow}>
                        <input
                            type="checkbox"
                            id="adminCheckbox"
                            checked={showAdminField}
                            onChange={(e) => setShowAdminField(e.target.checked)}
                            style={styles.checkbox}
                        />
                        <label htmlFor="adminCheckbox" style={styles.checkboxLabel}>
                            Registering as System Administrator?
                        </label>
                    </div>

                    {showAdminField && (
                        <div style={styles.inputGroup}>
                            <label style={{ ...styles.label, color: '#f59e0b' }}>Admin Secret Code Verification</label>
                            <input
                                type="password"
                                name="adminSecretCode" // 🎯 Updated name attribute
                                value={adminSecretCode}
                                onChange={handleInputChange}
                                placeholder="Enter secure admin system token"
                                required={showAdminField}
                                style={{ ...styles.inputField, borderColor: '#f59e0b' }}
                            />
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? 'Processing Registry...' : 'Register Operator'}
                    </button>

                    {/* 🌐 GOOGLE OAUTH PIPELINE TRIGGER */}
                    <div style={styles.dividerContainer}>
                        <span style={styles.dividerLine}></span>
                        <span style={styles.dividerText}>OR</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.location.href = 'https://josh-autos-backend.onrender.com/api/auth/google/register'
                        style={styles.googleBtn}
                    >
                        <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.423 1.487 15.62 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-2.405H12.24z" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <div style={styles.footerRow}>
                    Already have an operative account?{' '}
                    <Link to="/login" style={styles.loginLink}>
                        Login Here
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 75px)', backgroundColor: '#020617', padding: '2rem 1rem', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' },
    registerCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
    title: { margin: '0 0 0.25rem 0', color: '#ffffff', fontSize: '1.75rem', fontWeight: '800', textAlign: 'center', letterSpacing: '-0.02em' },
    subtitle: { color: '#64748b', fontSize: '0.85rem', fontWeight: '500', textAlign: 'center', margin: '0 0 2rem 0' },
    errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' },
    formStructure: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    label: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' },
    inputField: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box' },

    adminToggleRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' },
    checkbox: { cursor: 'pointer', accentColor: '#3b82f6' },
    checkboxLabel: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' },

    submitBtn: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.85rem', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem', transition: 'background-color 0.2s' },
    footerRow: { marginTop: '1.75rem', borderTop: '1px solid #1e293b', paddingTop: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: '500' },
    loginLink: { color: '#38bdf8', fontWeight: '700', textTransform: 'none', textDecoration: 'none', marginLeft: '0.25rem' },

    dividerContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.25rem 0', gap: '1rem' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: '#1e293b' },
    dividerText: { color: '#64748b', fontSize: '0.75rem', fontWeight: '700' },
    googleBtn: { width: '100%', padding: '0.85rem', backgroundColor: '#ffffff', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
};

export default Register;