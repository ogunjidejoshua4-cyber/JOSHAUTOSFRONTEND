import { useEffect, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginSuccess = () => {
    const [searchParams] = useSearchParams();
    const { setUser } = useContext(AuthContext); 
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const token = searchParams.get('token');
        const action = searchParams.get('action'); 

        if (action === 'register') {
            setIsLogin(false);
        }

        if (token) {
            // 1. Store the token safely
            localStorage.setItem('token', token);
            
            // 2. Force a full page reload to the dashboard/showroom
            // This forces your AuthContext to mount fresh, read the token, and fetch the user!
            setTimeout(() => {
                window.location.href = '/showroom'; // 👈 Change this to your main logged-in route (e.g. '/' or '/showroom')
            }, 1500);
        } else {
            window.location.href = '/login';
        }
    }, [searchParams]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.spinner}></div>
                <h2>✔️ Authorization Success</h2>
                <p style={styles.message}>
                    {isLogin 
                        ? 'Secure login established successfully!' 
                        : 'Registration processed! Welcome to the system.'}
                </p>
                <p style={styles.subtext}>Syncing secure user terminal credentials...</p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#020617' },
    card: { backgroundColor: '#0f172a', padding: '3rem', borderRadius: '16px', border: '1px solid #1e293b', textAlign: 'center', color: '#ffffff', maxWidth: '400px', width: '90%' },
    message: { fontSize: '1.1rem', color: '#38bdf8', margin: '1rem 0', fontWeight: '600' },
    subtext: { color: '#64748b', fontSize: '0.85rem' },
    spinner: { width: '40px', height: '40px', border: '4px solid #1e293b', borderTop: '4px solid #3b82f6', borderRadius: '50%', margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite' }
};

// Quick CSS insertion for the loading spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default LoginSuccess;