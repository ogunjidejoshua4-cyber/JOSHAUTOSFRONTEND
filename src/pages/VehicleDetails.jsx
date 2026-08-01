import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
// 💳 IMPORT PAYSTACK POPUP HOOK
import { usePaystackPayment } from 'react-paystack';

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Tracks if the user is authenticated

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // 📸 Active image selector state hook
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Lead Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [leadStatus, setLeadStatus] = useState('');

    // Edit Mode State toggles
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    // 🔗 Helper to fix broken image URLs dynamically
    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/600x400';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return `https://josh-autos-backend.onrender.com${path}`;
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        // ⚡ FIX 1: Safely sanitize the incoming ID to exactly 24 hex characters
        const cleanId = id && id.length > 24 ? id.substring(0, 24) : id;

        axios.get(`https://josh-autos-backend.onrender.com/api/cars/${cleanId}`)
            .then(res => {
                if (res.data.success) {
                    setCar(res.data.car);
                    setEditData(res.data.car); // Pre-fill edit inputs
                }
            })
            .catch(err => console.error("Error fetching vehicle profile:", err))
            .finally(() => {
                setLoading(false);
            });

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [id]);

    // 💳 PAYSTACK TRANSACTION PIPELINE ARCHITECTURE
    // 💳 DYNAMIC PAYSTACK TRANSACTION PIPELINE
    const PAYSTACK_KEY =
        import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_c2d6da39a575c554d57f84d6658d8ea7e18a2b59';

    // 🎯 Grab the car's actual price dynamically (or fallback to 0 if car isn't loaded yet)
    const carPrice = car?.price ? Number(car.price) : 0;

    const paymentConfig = {
        reference: `RES-${id?.substring(18, 24)}-${new Date().getTime()}`,
        email: user?.email || "customer@showroom.com",
        amount: carPrice * 100, // 💵 Dynamic car price scaled into Paystack Kobo units (Price * 100)
        publicKey: PAYSTACK_KEY,
    };

    const initializePayment = usePaystackPayment(paymentConfig);

    // 🏆 Success Callback Routine
    const handlePaymentSuccess = async (reference) => {
        setLeadStatus('🔒 Deposit verification processing...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`https://josh-autos-backend.onrender.com/api/cars/${id}`, {
                ...car,
                existingImages: JSON.stringify(car.images),
                status: 'Reserved' // Update database status
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                alert(`Asset Secured Successfully! Receipt Reference: ${reference.reference}`);
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to commit reservation field update:", err);
            alert(`Payment verified but database sync dropped. Keep Reference ID: ${reference.reference}`);
        }
    };

    const handlePaymentClose = () => {
        console.log("Secure payment viewport terminated by user.");
    };

    // Handle Lead submission for customers
    const handleLeadSubmit = async (e) => {
        e.preventDefault();

        // Prevent execution if not logged in
        const token = localStorage.getItem('token');
        if (!token || !user) {
            setLeadStatus('🚨 Access Denied: You must be logged in to route intent packets.');
            navigate('/login', { state: { from: `/showroom/${id}` } });
            return;
        }

        setLeadStatus('Processing offer parameters...');
        try {
            const res = await axios.post('https://josh-autos-backend.onrender.com/api/inquiries',
                { name, email, phone, message, carId: car._id },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (res.data.success) {
                setLeadStatus('🎉 Inquiry routed successfully! Our concierge team will reach out.');
                setName(''); setEmail(''); setPhone(''); setMessage('');

                setTimeout(() => {
                    setLeadStatus('');
                }, 5000);
            }
        } catch (err) {
            setLeadStatus(err.response?.data?.message || 'Inquiry routing failed. Check network connections.');
        }
    };

    // Handle Admin Edit Mode changes
    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // Submit Put Request (Update)
    const handleUpdateCar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();

        formData.append('title', editData.title || '');
        formData.append('brand', editData.brand || '');
        formData.append('model', editData.model || '');
        formData.append('year', editData.year || '');
        formData.append('price', editData.price || '');
        formData.append('mileage', editData.mileage || '');
        formData.append('transmission', editData.transmission || 'Automatic');
        formData.append('fuelType', editData.fuelType || 'Petrol');
        formData.append('description', editData.description || '');

        if (editData.images && editData.images instanceof FileList) {
            for (let i = 0; i < editData.images.length; i++) {
                formData.append('images', editData.images[i]);
            }
        } else if (Array.isArray(editData.images)) {
            formData.append('existingImages', JSON.stringify(editData.images));
        }

        try {
            const res = await axios.put(`https://josh-autos-backend.onrender.com/api/cars/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.success) {
                setCar(res.data.car);
                setEditData(res.data.car);
                setIsEditing(false);
                setActiveImageIndex(0);
                alert('Vehicle updated successfully!');
            }
        } catch (err) {
            console.error("Submission Error Details:", err.response?.data);
            alert(err.response?.data?.message || 'Failed to update vehicle record.');
        }
    };

    // Submit Delete Request
    const handleDeleteCar = async () => {
        if (!window.confirm('🚨 Are you absolutely certain you want to purge this asset from storage permanently?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await axios.delete(`https://josh-autos-backend.onrender.com/api/cars/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.data.success) {
                alert('Vehicle deleted successfully.');
                navigate('/showroom');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Purge routine rejected.');
        }
    };

    if (loading) return <div style={styles.loading}>Resolving localized asset array parameters...</div>;
    if (!car) return <div style={styles.empty}>Requested inventory record does not exist.</div>;

    return (
        <div style={{ ...styles.container, padding: isMobile ? '1rem' : '2rem 1.5rem' }}>
            {/* Admin Override Controller Bar */}
            {user && user.role === 'admin' && (
                <div style={styles.adminBar}>
                    <span style={styles.adminText}>⚡ System Authority Mode Unlocked</span>
                    <div style={styles.adminActions}>
                        <button onClick={() => setIsEditing(!isEditing)} style={styles.editToggleBtn}>
                            {isEditing ? 'Cancel Modification' : 'Modify Specifications'}
                        </button>
                        <button onClick={handleDeleteCar} style={styles.deleteBtn}>
                            Purge Asset File
                        </button>
                    </div>
                </div>
            )}

            {isEditing ? (
                /* Admin Edit Overlay Form Layout */
                <form onSubmit={handleUpdateCar} style={styles.editCard}>
                    <h2 style={styles.panelTitle}>Modify Specification Parameters</h2>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Title</label>
                        <input type="text" name="title" value={editData.title || ''} onChange={handleEditChange} style={styles.input} required />
                    </div>

                    <div style={styles.flexRow}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Brand</label>
                            <input type="text" name="brand" value={editData.brand || ''} onChange={handleEditChange} style={styles.input} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Model</label>
                            <input type="text" name="model" value={editData.model || ''} onChange={handleEditChange} style={styles.input} required />
                        </div>
                    </div>

                    <div style={styles.flexRow}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Year</label>
                            <input type="number" name="year" value={editData.year || ''} onChange={handleEditChange} style={styles.input} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Price ($)</label>
                            <input type="number" name="price" value={editData.price || ''} onChange={handleEditChange} style={styles.input} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Mileage (km)</label>
                            <input type="number" name="mileage" value={editData.mileage || ''} onChange={handleEditChange} style={styles.input} required />
                        </div>
                    </div>

                    <div style={styles.flexRow}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Transmission</label>
                            <select name="transmission" value={editData.transmission || 'Automatic'} onChange={handleEditChange} style={styles.input} required>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Fuel Configuration</label>
                            <select name="fuelType" value={editData.fuelType || 'Petrol'} onChange={handleEditChange} style={styles.input} required>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Upload New Media Packages</label>
                        <input
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={(e) => setEditData({ ...editData, images: e.target.files })}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Detailed Description</label>
                        <textarea name="description" value={editData.description || ''} onChange={handleEditChange} style={styles.textarea} required />
                    </div>

                    <button type="submit" style={styles.saveBtn}>Commit Operational Changes</button>
                </form>
            ) : (
                /* Core Customer Showcase Layout */
                <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: isMobile ? '1.5rem' : '2.5rem' }}>

                    {/* Left: Interactive Media Wall & Specs */}
                    <div>
                        <div style={styles.heroImageContainer}>
                            <img
                                src={getImageUrl(car.images?.[activeImageIndex])}
                                alt={car.title}
                                style={styles.heroImg}
                            />
                        </div>

                        {car.images && car.images.length > 1 && (
                            <div style={styles.galleryRibbon}>
                                {car.images.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={getImageUrl(imgUrl)}
                                        alt={`${car.title} preview asset ${index + 1}`}
                                        onClick={() => setActiveImageIndex(index)}
                                        style={{
                                            ...styles.thumbnailAsset,
                                            border: activeImageIndex === index ? '2px solid #3b82f6' : '2px solid #334155',
                                            opacity: activeImageIndex === index ? 1 : 0.6
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        <div style={styles.profileMeta}>
                            <h1 style={styles.carTitle}>{car.title}</h1>
                            <div style={styles.priceStrip}>#{car.price?.toLocaleString()}</div>
                        </div>

                        <div style={styles.specsTable}>
                            <div style={styles.specCell}><span>Brand</span><strong>{car.brand}</strong></div>
                            <div style={styles.specCell}><span>Model</span><strong>{car.model}</strong></div>
                            <div style={styles.specCell}><span>Year</span><strong>{car.year}</strong></div>
                            <div style={styles.specCell}><span>Mileage</span><strong>{car.mileage?.toLocaleString()} km</strong></div>
                            <div style={styles.specCell}><span>Transmission</span><strong>{car.transmission}</strong></div>
                            <div style={styles.specCell}><span>Fuel Configuration</span><strong>{car.fuelType}</strong></div>
                        </div>

                        <div style={styles.descriptionSection}>
                            <h3 style={styles.secTitle}>Condition Overview</h3>
                            <p style={styles.descText}>{car.description}</p>
                        </div>
                    </div>

                    {/* Right Side: Interactive Panel Column Stack (Sticky) */}
                    <div style={styles.stickyColumn}>

                        {/* 🌟 1. PAYSTACK DEPOSIT GATEWAY WIDGET */}
                        <div style={styles.paystackCard}>
                            <h3 style={styles.captureTitle}>🔒 Secure This Vehicle</h3>
                            <p style={styles.captureDesc}>
                                High demand asset. Place a refundable holding fee to freeze this listing instantly.
                            </p>
                            {!user ? (
                                <button
                                    onClick={() => navigate('/login', { state: { from: `/showroom/${id}` } })}
                                    style={styles.paystackBtn}
                                >
                                    Log In to Place Deposit
                                </button>
                            ) : (
                                <button
                                    onClick={() => initializePayment(handlePaymentSuccess, handlePaymentClose)}
                                    style={styles.paystackBtn}
                                >
                                    Pay Vehicle Deposit (₦{car?.price?.toLocaleString() || '0'})
                                </button>
                            )}
                        </div>

                        {/* 2. Standard Acquisition Engagement Form */}
                        <div style={styles.captureCard}>
                            <h3 style={styles.captureTitle}>Acquisition Engagement</h3>
                            <p style={styles.captureDesc}>Transmit pricing negotiations or scheduling requests securely below.</p>

                            {!user ? (
                                <div style={styles.authShield}>
                                    <p style={styles.authShieldText}>🔒 Authentication Required to engage acquisition pipeline protocols.</p>
                                    <button
                                        onClick={() => navigate('/login', { state: { from: `/showroom/${id}` } })}
                                        style={styles.formBtn}
                                    >
                                        Log In / Register
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {leadStatus && <div style={styles.statusNotification}>{leadStatus}</div>}
                                    <form onSubmit={handleLeadSubmit} style={styles.form}>
                                        <input type="text" placeholder="Your Legal Name" value={name} onChange={e => setName(e.target.value)} style={styles.formInput} required />
                                        <input type="email" placeholder="Your Email Address" value={email} onChange={e => setEmail(e.target.value)} style={styles.formInput} required />
                                        <input type="tel" placeholder="Your Contact Line" value={phone} onChange={e => setPhone(e.target.value)} style={styles.formInput} required />
                                        <textarea placeholder="State your delivery or specification negotiations here..." value={message} onChange={e => setMessage(e.target.value)} style={styles.formTextarea} required />
                                        <button type="submit" style={styles.formBtn}>Route Intent Packet</button>
                                    </form>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '2rem 1.5rem', fontFamily: '"Inter", sans-serif', boxSizing: 'border-box' },
    loading: { textAlign: 'center', color: '#94a3b8', padding: '6rem 0', fontWeight: '600' },
    empty: { textAlign: 'center', color: '#94a3b8', padding: '6rem 0' },
    adminBar: { backgroundColor: '#1e293b', border: '1px dashed #fbbf24', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
    adminText: { color: '#fbbf24', fontWeight: '700', fontSize: '0.9rem' },
    adminActions: { display: 'flex', gap: '0.75rem' },
    editToggleBtn: { padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' },
    deleteBtn: { padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' },
    grid: { display: 'grid', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'flex-start' },
    heroImageContainer: { width: '100%', height: '400px', backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' },
    heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
    galleryRibbon: { display: 'flex', gap: '0.75rem', marginTop: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' },
    thumbnailAsset: { width: '90px', height: '65px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease-in-out' },
    profileMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0', flexWrap: 'wrap', gap: '1rem' },
    carTitle: { fontSize: '2rem', fontWeight: '900', margin: 0, color: '#ffffff' },
    priceStrip: { fontSize: '1.75rem', fontWeight: '800', color: '#38bdf8' },
    specsTable: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    specCell: { backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    secTitle: { fontSize: '1.3rem', color: '#ffffff', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', margin: '0 0 1rem 0' },
    descText: { color: '#cbd5e1', lineHeight: '1.6', fontSize: '1rem' },

    stickyColumn: { display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' },

    paystackCard: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #22c55e', boxShadow: '0 10px 30px rgba(34, 197, 94, 0.1)' },
    paystackBtn: { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#ffffff', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', width: '100%' },

    captureCard: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' },
    captureTitle: { fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#ffffff' },
    captureDesc: { color: '#94a3b8', fontSize: '0.85rem', margin: '0.5rem 0 1.5rem 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    formInput: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box' },
    formTextarea: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', outline: 'none', height: '100px', resize: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' },
    formBtn: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', width: '100%' },
    statusNotification: { padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#38bdf8', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' },
    authShield: { textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' },
    authShieldText: { color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' },

    editCard: { backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '16px', border: '1px solid #334155', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    input: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem', color: '#ffffff', width: '100%', boxSizing: 'border-box' },
    textarea: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem', color: '#ffffff', height: '120px', width: '100%', boxSizing: 'border-box', resize: 'none' },
    saveBtn: { background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', color: '#ffffff', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
    flexRow: { display: 'flex', gap: '1rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }
};

export default VehicleDetails;