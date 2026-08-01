import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard'; 
import Showroom from './pages/Showroom'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import Navbar from './components/Navbar'; 
import VehicleDetails from './pages/VehicleDetails';
import Profile from './pages/Profile';
import Register from './pages/Register';
import AcquisitionEngagement from './pages/AcquisitionEngagement';
import Services from './pages/Services';
import About from './pages/About';
import VerifyEmail from './pages/VerifyEmail';
import LoginSuccess from './pages/LoginSuccess';
import ForgotPassword from './pages/ForgotPassword';

// 🏎️ 3D Canvas Model Component
import ThreeCanvas from './components/ThreeCanvas';

// 🏠 Home Landing Hero Component
const Home = () => {
    const { user } = useContext(AuthContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            style={styles.container}
        >
            <div style={styles.ambientGlow} />

            <div style={{ ...styles.contentWrapper, padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
                
                {/* 🚀 Hero Header Section with 3D Canvas */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
                    gap: '2.5rem',
                    alignItems: 'center',
                    marginBottom: '3.5rem',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    {/* Left Column: Copy & CTAs */}
                    <motion.header 
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        style={styles.brandHeader}
                    >
                        <div style={styles.accentBar}></div>
                        <span style={styles.badgeText}>⚡ Next-Gen Asset Control</span>
                        <h1 style={{ ...styles.mainTitle, fontSize: isMobile ? '2.5rem' : '3.8rem' }}>
                            JOSH AUTOS <span style={styles.badge}>PRO</span>
                        </h1>
                        <p style={{ ...styles.subtitle, fontSize: isMobile ? '1rem' : '1.2rem' }}>
                            Drive Precision. Own Excellence.
                        </p>
                        <h3 style={styles.heroHeadline}>
                            Drive your dream car and experience the road like never before.
                        </h3>
                    </motion.header>

                    {/* Right Column: Interactive 3D Canvas Model */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        style={{ width: '100%', height: '360px' }}
                    >
                        <ThreeCanvas />
                    </motion.div>
                </div>

                {/* 📊 Feature Cards Grid */}
                <div style={{ ...styles.featureGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                    <motion.div 
                        whileHover={{ y: -5 }}
                        style={styles.featureCard}
                    >
                        <span style={styles.cardIcon}>🏁</span>
                        <h3 style={styles.cardTitle}>Pristine Inventory</h3>
                        <p style={styles.cardText}>Explore our curated collection of verified exotic, luxury, and high-performance domestic vehicles.</p>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        style={styles.featureCard}
                    >
                        <span style={styles.cardIcon}>🛡️</span>
                        <h3 style={styles.cardTitle}>Secure Acquisition</h3>
                        <p style={styles.cardText}>Direct real-time digital inquiries straight to our professional dealership concierge team.</p>
                    </motion.div>
                </div>

                {/* 🔘 User Session Action Section */}
                <div style={styles.actionSection}>
                    {user ? (
                        <div style={styles.sessionView}>
                            <div style={styles.userStatusBlock}>
                                <div style={styles.avatarGlow}>⚡</div>
                                <div>
                                    <p style={styles.statusLabel}>Active System Session</p>
                                    <h3 style={styles.userName}>{user.name}</h3>
                                    <span style={styles.roleTag}>{user.role.toUpperCase()} LEVEL ACCESS</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', flexDirection: isMobile ? 'column' : 'row' }}>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
                                    <Link to="/showroom" style={{ ...styles.baseBtn, ...styles.showroomBtn, width: '100%' }}>
                                        Explore Showroom 🚀
                                    </Link>
                                </motion.div>

                                {user.role === 'admin' && (
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
                                        <Link to="/admin" style={{ ...styles.baseBtn, ...styles.dashboardBtn, width: '100%' }}>
                                            Control Suite Dashboard
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={styles.loggedOutView}>
                            <p style={styles.promptText}>
                                Ready to acquire your next exceptional vehicle? Click below to view specifications.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Link to="/showroom" style={{ ...styles.baseBtn, ...styles.showroomBtn, width: isMobile ? '100%' : 'auto' }}>
                                        Browse Public Showroom
                                    </Link>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Link to="/login" style={{ ...styles.baseBtn, ...styles.loginBtn, width: isMobile ? '100%' : 'auto' }}>
                                        System Operator Portal
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

// 🔀 Animated Routes Wrapper
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/showroom" element={<Showroom />} />
                <Route path="/cars/:id" element={<VehicleDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/acquisition-engagement" element={<AcquisitionEngagement />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Router>
            <Navbar /> 
            <AnimatedRoutes />
        </Router>
    );
}

const styles = {
    container: { 
        minHeight: 'calc(100vh - 70px)', 
        backgroundColor: '#020617', 
        color: '#f8fafc', 
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(30, 41, 59, 0.3) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)'
    },
    ambientGlow: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
        top: '-100px',
        right: '-100px',
        pointerEvents: 'none'
    },
    contentWrapper: {
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    brandHeader: {
        display: 'flex',
        flexDirection: 'column',
    },
    accentBar: {
        width: '60px',
        height: '4px',
        backgroundColor: '#3b82f6',
        borderRadius: '2px',
        marginBottom: '1rem'
    },
    badgeText: {
        color: '#38bdf8',
        fontSize: '0.8rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem'
    },
    mainTitle: { 
        margin: 0, 
        fontWeight: '900', 
        letterSpacing: '-0.05em', 
        color: '#ffffff',
        lineHeight: '1.1'
    },
    badge: { 
        fontSize: '1rem', 
        fontWeight: '800', 
        backgroundColor: '#3b82f6', 
        color: '#fff', 
        padding: '0.3rem 0.8rem', 
        borderRadius: '8px', 
        marginLeft: '0.5rem', 
        verticalAlign: 'middle',
        letterSpacing: '0.05em',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    subtitle: { 
        color: '#94a3b8', 
        margin: '0.75rem 0 0 0', 
        fontWeight: '500',
        lineHeight: '1.5'
    },
    heroHeadline: {
        margin: '1rem 0 0',
        color: '#f8fafc',
        fontSize: '1.1rem',
        fontWeight: '600',
        lineHeight: '1.6',
        maxWidth: '550px',
        background: 'linear-gradient(90deg, #f8fafc 0%, #cbd5e1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    featureGrid: {
        display: 'grid',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto 3.5rem auto',
        width: '100%'
    },
    featureCard: {
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'left',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
    },
    cardIcon: {
        fontSize: '1.75rem',
        display: 'block',
        marginBottom: '0.75rem'
    },
    cardTitle: {
        margin: '0 0 0.5rem 0',
        color: '#ffffff',
        fontSize: '1.2rem',
        fontWeight: '700'
    },
    cardText: {
        margin: 0,
        color: '#64748b',
        fontSize: '0.9rem',
        lineHeight: '1.5'
    },
    actionSection: {
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '24px',
        padding: '2.5rem',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
        textAlign: 'center'
    },
    sessionView: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        alignItems: 'center'
    },
    userStatusBlock: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.25rem', 
        backgroundColor: '#1e293b', 
        padding: '1.25rem', 
        borderRadius: '16px', 
        border: '1px solid #334155', 
        textAlign: 'left',
        width: '100%',
        boxSizing: 'border-box'
    },
    avatarGlow: { 
        width: '45px', 
        height: '45px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        border: '1px solid #3b82f6', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontSize: '1.2rem', 
        boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' 
    },
    statusLabel: { margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' },
    userName: { margin: '0.2rem 0', color: '#ffffff', fontSize: '1.25rem', fontWeight: '800' },
    roleTag: { display: 'inline-block', fontSize: '0.65rem', fontWeight: '800', color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px', letterSpacing: '0.05em' },
    
    // Buttons System
    baseBtn: {
        textDecoration: 'none', 
        textAlign: 'center', 
        padding: '0.9rem 2rem', 
        borderRadius: '10px', 
        fontWeight: '700', 
        fontSize: '0.95rem', 
        display: 'inline-block',
        boxSizing: 'border-box'
    },
    showroomBtn: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
        color: '#ffffff', 
        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
    },
    dashboardBtn: {
        background: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)', 
        color: '#ffffff', 
        boxShadow: '0 4px 14px rgba(251, 191, 36, 0.2)'
    },
    loginBtn: {
        backgroundColor: 'transparent',
        color: '#94a3b8',
        border: '1px solid #334155'
    },
    loggedOutView: { padding: '0.5rem 0' },
    promptText: { color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }
};

export default App;