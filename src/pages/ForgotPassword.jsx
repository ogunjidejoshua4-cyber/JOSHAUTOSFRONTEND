import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert } from '../utils/swal';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // Step 1: Request Code | Step 2: Reset Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Request Reset Code
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://joshautos.onrender.com/api/auth/forgot-password', { email });
            if (res.data.status || res.data.success) {
                showSuccessAlert('Code Sent! 📧', 'Check your email for the 6-digit reset code.');
                setStep(2);
            }
        } catch (err) {
            showErrorAlert('Error', err.response?.data?.message || 'Email request failed.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Submit New Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://joshautos.onrender.com/api/auth/reset-password', {
                email,
                code,
                newPassword
            });
            if (res.data.status || res.data.success) {
                await showSuccessAlert('Success! 🔐', 'Password updated successfully. Please log in.');
                navigate('/login');
            }
        } catch (err) {
            showErrorAlert('Reset Failed', err.response?.data?.message || 'Invalid security code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
                <p style={styles.subtitle}>
                    {step === 1 
                        ? 'Enter your registered email to receive a reset authorization code.' 
                        : 'Enter the code sent to your email along with your new password.'}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleRequestCode} style={styles.form}>
                        <div style={styles.group}>
                            <label style={styles.label}>Registered Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="name@company.com" 
                                required 
                                style={styles.input} 
                            />
                        </div>
                        <button type="submit" disabled={loading} style={styles.btn}>
                            {loading ? 'Sending Code...' : 'Send Security Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} style={styles.form}>
                        <div style={styles.group}>
                            <label style={styles.label}>6-Digit Security Code</label>
                            <input 
                                type="text" 
                                value={code} 
                                onChange={(e) => setCode(e.target.value)} 
                                placeholder="123456" 
                                required 
                                style={styles.input} 
                            />
                        </div>
                        <div style={styles.group}>
                            <label style={styles.label}>New Password</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                placeholder="••••••••" 
                                required 
                                style={styles.input} 
                            />
                        </div>
                        <button type="submit" disabled={loading} style={styles.btn}>
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div style={styles.footer}>
                    Remembered your passcode? <Link to="/login" style={styles.link}>Return to Login</Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', backgroundColor: '#0f172a', padding: '1rem', fontFamily: '"Inter", sans-serif' },
    card: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' },
    title: { margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', textAlign: 'center' },
    subtitle: { color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center', lineHeight: '1.4', marginBottom: '2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    group: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    label: { fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase' },
    input: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
    btn: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem' },
    footer: { marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' },
    link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }
};

export default ForgotPassword;