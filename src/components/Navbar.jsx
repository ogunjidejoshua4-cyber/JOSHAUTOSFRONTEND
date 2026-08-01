import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogoutClick = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Helper function to handle active route styling matrix
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Injecting media queries seamlessly without separate CSS sheets */}
            <style>{`
                @media (max-width: 768px) {
                    .nav-links-desktop {
                        display: none !important;
                    }
                    .auth-cluster-desktop {
                        display: none !important;
                    }
                    .hamburger-menu {
                        display: flex !important;
                    }
                }
            `}</style>

            <nav style={{ ...styles.navBar, padding: isMobile ? '0 1rem' : '0 2rem' }}>
                <div style={{ ...styles.navContainer, gap: isMobile ? '0.75rem' : '0' }}>

                    {/* 🚗 Left Side: Brand Logo */}
                    <Link to="/" style={{ ...styles.logoLink, fontSize: isMobile ? '1.15rem' : '1.4rem' }} onClick={closeMenu}>
                        <span style={styles.logoText}>JOSH</span>
                        <span style={styles.logoAccent}>-AUTOS</span>
                    </Link>

                    {/* 🎯 Center Grid: Desktop Links */}
                    <div className="nav-links-desktop" style={styles.navLinks}>
                        <Link to="/" style={{ ...styles.navLink, ...(isActive('/') ? styles.activeLink : {}) }}>
                            Home
                        </Link>
                        <Link to="/showroom" style={{ ...styles.navLink, ...(isActive('/showroom') ? styles.activeLink : {}) }}>
                            Explore Showroom
                        </Link>
                        <Link to="/services" style={{ ...styles.navLink, ...(isActive('/services') ? styles.activeLink : {}) }}>
                            Services
                        </Link>
                        <Link to="/about" style={{ ...styles.navLink, ...(isActive('/about') ? styles.activeLink : {}) }}>
                            About Us
                        </Link>
                    </div>

                    {/* 🔒 Right Side: Desktop User Action Cluster */}
                    <div className="auth-cluster-desktop" style={styles.authCluster}>
                        {user ? (
                            <div style={styles.userBadgeRow}>
                                <Link to="/profile" style={styles.profileLink}>
                                    <div style={styles.userIndicator}>
                                        {user.profilePic ? (
                                            <img
                                                src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000/${user.profilePic}`}
                                                alt="Nav Mini"
                                                style={styles.avatarMini}
                                            />
                                        ) : (
                                            <div style={styles.defaultAvatarMini}>
                                                {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span style={styles.navUserName}>
                                            {user.name ? user.name.split(' ')[0] : (user.username || 'Operator')}
                                        </span>
                                    </div>
                                </Link>
                                <button onClick={handleLogoutClick} style={styles.logoutBtn}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" style={styles.loginBtn}>
                                Operator Login
                            </Link>
                        )}
                    </div>

                    {/* 🍔 Mobile Hamburger/Close Trigger Button */}
                    <button className="hamburger-menu" onClick={toggleMenu} style={styles.hamburger}>
                        {isOpen ? (
                            // Close Icon
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            // Hamburger Icon
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {/* 📱 Mobile Dropdown Menu Drawer */}
                {isOpen && (
                    <div style={styles.mobileDrawer}>
                        <Link to="/" style={{ ...styles.mobileNavLink, ...(isActive('/') ? styles.activeMobileLink : {}) }} onClick={closeMenu}>
                            Home
                        </Link>
                        <Link to="/showroom" style={{ ...styles.mobileNavLink, ...(isActive('/showroom') ? styles.activeMobileLink : {}) }} onClick={closeMenu}>
                            Explore Showroom
                        </Link>
                        <Link to="/services" style={{ ...styles.mobileNavLink, ...(isActive('/services') ? styles.activeMobileLink : {}) }} onClick={closeMenu}>
                            Services
                        </Link>
                        <Link to="/about" style={{ ...styles.mobileNavLink, ...(isActive('/about') ? styles.activeMobileLink : {}) }} onClick={closeMenu}>
                            About Us
                        </Link>

                        <hr style={styles.mobileDivider} />

                        <div style={styles.mobileAuthRow}>
                            {user ? (
                                <div style={styles.mobileUserCluster}>
                                    <Link to="/profile" style={styles.profileLink} onClick={closeMenu}>
                                        <div style={styles.userIndicator}>
                                            {user.profilePic ? (
                                                <img
                                                    src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000/${user.profilePic}`}
                                                    alt="Nav Mini"
                                                    style={styles.avatarMini}
                                                />
                                            ) : (
                                                <div style={styles.defaultAvatarMini}>
                                                    {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span style={styles.navUserName}>
                                                {user.name ? user.name.split(' ')[0] : (user.username || 'Operator')}
                                            </span>
                                        </div>
                                    </Link>
                                    <button onClick={handleLogoutClick} style={styles.logoutBtnMobile}>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" style={styles.loginBtnMobile} onClick={closeMenu}>
                                    Operator Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

const styles = {
    navBar: {
        height: '75px',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '0 2rem',
        boxSizing: 'border-box'
    },
    navContainer: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoLink: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.4rem',
        fontWeight: '900',
        letterSpacing: '-0.02em'
    },
    logoText: { color: '#ffffff' },
    logoAccent: { color: '#3b82f6' },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
    },
    navLink: {
        textDecoration: 'none',
        color: '#94a3b8',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'color 0.2s ease',
        padding: '0.25rem 0'
    },
    activeLink: {
        color: '#3b82f6',
        borderBottom: '2px solid #3b82f6'
    },
    authCluster: { display: 'flex', alignItems: 'center' },
    userBadgeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
    },
    profileLink: {
        textDecoration: 'none',
        color: 'inherit'
    },
    userIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        backgroundColor: '#1e293b',
        padding: '0.45rem 0.9rem',
        borderRadius: '50px',
        border: '1px solid #334155',
        cursor: 'pointer'
    },
    avatarMini: {
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid #38bdf8'
    },
    defaultAvatarMini: {
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.75rem',
        fontWeight: '800',
        color: '#ffffff'
    },
    navUserName: {
        color: '#f8fafc',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #ef4444',
        color: '#ef4444',
        padding: '0.45rem 1rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    loginBtn: {
        textDecoration: 'none',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '0.5rem 1.25rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600'
    },

    /* 🍔 Hamburger Styling */
    hamburger: {
        display: 'none',
        background: 'transparent',
        border: 'none',
        color: '#ffffff',
        cursor: 'pointer',
        padding: '0.5rem',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
    },

    /* 📱 Mobile Drawer Styling */
    mobileDrawer: {
        position: 'absolute',
        top: '75px',
        left: 0,
        width: '100%',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '1.5rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxSizing: 'border-box',
        zIndex: 999
    },
    mobileNavLink: {
        textDecoration: 'none',
        color: '#94a3b8',
        fontSize: '1.1rem',
        fontWeight: '600',
        padding: '0.25rem 0',
        transition: 'color 0.2s ease'
    },
    activeMobileLink: {
        color: '#3b82f6'
    },
    mobileDivider: {
        border: '0',
        borderTop: '1px solid #1e293b',
        margin: '0.5rem 0'
    },
    mobileAuthRow: {
        width: '100%'
    },
    mobileUserCluster: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    logoutBtnMobile: {
        backgroundColor: '#ef4444',
        border: 'none',
        color: '#ffffff',
        padding: '0.6rem 1.25rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer'
    },
    loginBtnMobile: {
        textDecoration: 'none',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        display: 'block',
        textAlign: 'center'
    }
};

export default Navbar;