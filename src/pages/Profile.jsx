import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const contextData = useContext(AuthContext); 
    const user = contextData?.user;
    
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [bio, setBio] = useState('Premium Client Interface User.'); // Added default editable bio parameter
    const [isEditingBio, setIsEditingBio] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user?.profilePic) {
            const fullUrl = user.profilePic.startsWith('http') 
                ? user.profilePic 
                : `https://josh-autos-backend.onrender.com/${user.profilePic}`;
            setProfilePicUrl(fullUrl);
        }
    }, [user]);

    if (!user) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorCard}>
                    <h2>🚨 Security Alert</h2>
                    <p>You must be authenticated to view account parameters.</p>
                </div>
            </div>
        );
    }

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localPreviewUrl = URL.createObjectURL(file);
        setProfilePicUrl(localPreviewUrl);

        const formData = new FormData();
        formData.append('images', file);

        setUploading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await axios.put('https://josh-autos-backend.onrender.com/api/users/profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                const savedPath = res.data.user.profilePic;
                const finalBackendUrl = savedPath.startsWith('http') ? savedPath : `https://josh-autos-backend.onrender.com/${savedPath}`;
                setProfilePicUrl(finalBackendUrl);
                
                if (typeof contextData?.setUser === 'function') contextData.setUser(res.data.user);
                else if (typeof contextData?.setCurrentUser === 'function') contextData.setCurrentUser(res.data.user);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to complete upload backend sync.');
            if (user?.profilePic) {
                setProfilePicUrl(user.profilePic.startsWith('http') ? user.profilePic : `https://josh-autos-backend.onrender.com/${user.profilePic}`);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ ...styles.profileCard, padding: '2rem 1rem' }}>
                
                {/* Header Cluster */}
                <div style={styles.avatarHeader}>
                    <div style={styles.avatarContainerWrapper}>
                        <div onClick={handleAvatarClick} style={styles.avatarWrapper} title="Click to change photo">
                            {profilePicUrl ? (
                                <img src={profilePicUrl} alt={user.name} style={styles.avatarImg} />
                            ) : (
                                <div style={styles.largeAvatar}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <div style={styles.avatarOverlay}>
                                <span>{uploading ? '...' : 'CHANGE'}</span>
                            </div>
                        </div>

                        {profilePicUrl && (
                            <button onClick={() => setIsPreviewOpen(true)} style={styles.viewLargeBtn}>
                                View Full Image 🔍
                            </button>
                        )}
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />

                    <h2 style={styles.fullName}>{user.name}</h2>
                    <span style={styles.roleBadge}>{user.role ? user.role.toUpperCase() : 'CUSTOMER'} ACCESS</span>
                </div>

                {/* 🎯 NEW: Interactive Bio Box Section */}
                <div style={styles.bioContainer}>
                    {isEditingBio ? (
                        <div style={styles.bioEditBlock}>
                            <textarea 
                                value={bio} 
                                onChange={(e) => setBio(e.target.value)} 
                                style={styles.bioInput}
                                maxLength={120}
                            />
                            <button onClick={() => setIsEditingBio(false)} style={styles.saveBioBtn}>Save Bio</button>
                        </div>
                    ) : (
                        <p style={styles.bioText} onClick={() => setIsEditingBio(true)} title="Click to edit bio">
                            "{bio}" <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>✍️</span>
                        </p>
                    )}
                </div>

                {/* 🎯 NEW: System Metric Tracking Data Grid Row */}
                <div style={{ ...styles.metricsRow, flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={styles.metricCard}>
                        <span style={styles.metricValue}>0</span>
                        <span style={styles.metricLabel}>Inquiries Sent</span>
                    </div>
                    <div style={styles.metricCard}>
                        <span style={styles.metricValue}>Active</span>
                        <span style={styles.metricLabel}>Account State</span>
                    </div>
                </div>

                <hr style={styles.divider} />

                {/* Info Block */}
                <div style={styles.detailsGrid}>
                    <div style={styles.infoRow}>
                        <span style={styles.fieldLabel}>Registered Email Address</span>
                        <strong style={styles.fieldValue}>{user.email}</strong>
                    </div>
                </div>
            </div>

            {/* Modal Lightbox */}
            {isPreviewOpen && (
                <div style={styles.modalOverlay} onClick={() => setIsPreviewOpen(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.closeModalBtn} onClick={() => setIsPreviewOpen(false)}>×</button>
                        <img src={profilePicUrl} alt="Full Profile Matrix View" style={styles.bigModalImage} />
                        <div style={styles.modalFooterText}>{user.name} - Profile Picture</div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', backgroundColor: '#020617', padding: '3rem 1rem', boxSizing: 'border-box' },
    profileCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '3rem 2rem', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'center' },
    avatarHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' },
    avatarContainerWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
    avatarWrapper: { position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '3px solid #3b82f6', backgroundColor: '#1e293b' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    largeAvatar: { width: '100%', height: '100%', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: '900', color: '#ffffff' },
    avatarOverlay: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '35%', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.65rem', fontWeight: '800', color: '#38bdf8' },
    viewLargeBtn: { backgroundColor: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.25rem', textDecoration: 'underline' },
    fullName: { margin: '0.5rem 0 0 0', color: '#ffffff', fontSize: '1.5rem', fontWeight: '800' },
    roleBadge: { fontSize: '0.7rem', fontWeight: '800', padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#38bdf8', border: '1px solid #38bdf8' },
    
    // Bio Styling Matrix Objects
    bioContainer: { marginTop: '1rem', padding: '0 1rem' },
    bioText: { fontStyle: 'italic', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', margin: 0 },
    bioEditBlock: { display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' },
    bioInput: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', padding: '0.5rem', width: '100%', minHeight: '50px', resize: 'none', fontSize: '0.85rem', outline: 'none', textAlign: 'center' },
    saveBioBtn: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' },

    // Metrics Row Grid Framework
    metricsRow: { display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'space-between' },
    metricCard: { flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    metricValue: { fontSize: '1.2rem', fontWeight: '800', color: '#3b82f6' },
    metricLabel: { fontSize: '0.65rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },

    divider: { border: 'none', height: '1px', backgroundColor: '#1e293b', margin: '1.5rem 0' },
    detailsGrid: { display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' },
    infoRow: { backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' },
    fieldLabel: { fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
    fieldValue: { color: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', display: 'block', marginTop: '0.25rem', wordBreak: 'break-all' },
    
    errorContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', backgroundColor: '#020617' },
    errorCard: { backgroundColor: '#0f172a', border: '1px solid #ef4444', padding: '2rem', borderRadius: '16px', color: '#f8fafc', textAlign: 'center' },
    
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(2, 6, 23, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
    modalContent: { position: 'relative', width: '90%', maxWidth: '450px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    closeModalBtn: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '2rem', cursor: 'pointer' },
    bigModalImage: { width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px' },
    modalFooterText: { color: '#94a3b8', marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600' }
};

export default Profile;