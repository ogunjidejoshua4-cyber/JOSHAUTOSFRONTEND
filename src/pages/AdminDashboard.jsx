import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Form States
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [mileage, setMileage] = useState('');
    const [fuelType, setFuelType] = useState('Petrol');
    const [transmission, setTransmission] = useState('Automatic');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]); 
    const [formMessage, setFormMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        
        const token = localStorage.getItem('token');
        axios.get('https://josh-autos-backend.onrender.com/api/inquiries', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (res.data.success) setInquiries(res.data.inquiries);
            })
            .catch(err => console.error("Error loading inquiries:", err))
            .finally(() => {
                setLoading(false);
                return () => window.removeEventListener('resize', handleResize);
            });
    }, []);

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleAddCar = async (e) => {
        e.preventDefault();
        setFormMessage('');
        setIsSubmitting(true);

        const token = localStorage.getItem('token'); 
        const formData = new FormData();
        formData.append('title', title);
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('year', year);
        formData.append('price', price);
        formData.append('mileage', mileage);
        formData.append('fuelType', fuelType);
        formData.append('transmission', transmission);
        formData.append('description', description);

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            const res = await axios.post('https://josh-autos-backend.onrender.com/api/cars', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (res.data.success) {
                Swal.fire('Success!', '🎉 Vehicle successfully added to cloud inventory!', 'success');
                setTitle(''); setBrand(''); setModel(''); setYear(''); setPrice('');
                setMileage(''); setDescription(''); setImages([]);
            }
        } catch (err) {
            setFormMessage(err.response?.data?.message || 'Failed to upload vehicle package.');
        } finally {
            setIsSubmitting(false);
        }
    };

// 🗑️ Handle Deleting an Inquiry with SweetAlert2
const handleDeleteInquiry = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to permanently remove this pipeline inquiry record!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Matches your logoutBtn red
        cancelButtonColor: '#475569',  // Matches your slate background
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#1e293b',         // Seamlessly matches your app card background
        color: '#f8fafc',              // Light text color matching your design
    }).then(async (result) => {
        // If the user clicks "Yes, delete it!"
        if (result.isConfirmed) {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.delete(`https://josh-autos-backend.onrender.com/api/inquiries/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.data.success) {
                    // 1. Update your UI state
                    setInquiries(inquiries.filter(iq => iq._id !== id));

                    // 2. Show fire-and-forget success notification
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The inquiry log has been dropped.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#1e293b',
                        color: '#f8fafc'
                    });
                }
            } catch (err) {
                console.error("Error dropping pipeline document:", err);
                
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: err.response?.data?.message || "Failed to drop pipeline data element.",
                    icon: 'error',
                    background: '#1e293b',
                    color: '#f8fafc'
                });
            }
        }
    });
};

    return (
        <div style={{ ...styles.dashboardContainer, padding: isMobile ? '1rem' : '2.5rem' }}>
            {/* Header Module */}
            <header style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '1rem' }}>
                <div>
                    <h1 style={styles.mainTitle}>Josh Autos <span style={styles.badge}>Pro Suite</span></h1>
                    <p style={styles.subtitle}>Dealership Management Control & Live Pipeline Logs</p>
                </div>
                <button onClick={logout} style={styles.logoutBtn}>Disconnect Session</button>
            </header>

            {/* Grid Layout adjusts based on window layout sizes */}
            <div style={{ ...styles.gridContainer, gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: isMobile ? '1.25rem' : '2rem' }}>
                
                {/* Left Side: Upload Control */}
                <div style={{ ...styles.card, padding: isMobile ? '1.5rem' : '2.5rem' }}>
                    <h2 style={styles.sectionHeading}>Inventory Procurement</h2>
                    <p style={styles.sectionDesc}>Register verified vehicles directly to the public showroom database.</p>
                    
                    {formMessage && (
                        <div style={formMessage.includes('🎉') ? styles.successBox : styles.errorBox}>
                            {formMessage}
                        </div>
                    )}
                    
                    <form onSubmit={handleAddCar} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Listing Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={styles.input} placeholder="e.g., Toyota Camry 2022 XLE" />
                        </div>

                        <div style={{ ...styles.row, flexDirection: isMobile ? 'column' : 'row' }}>
                            <div style={styles.col}>
                                <label style={styles.label}>Brand</label>
                                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} required style={styles.input} placeholder="Toyota" />
                            </div>
                            <div style={styles.col}>
                                <label style={styles.label}>Model</label>
                                <input type="text" value={model} onChange={e => setModel(e.target.value)} required style={styles.input} placeholder="Camry" />
                            </div>
                        </div>

                        <div style={{ ...styles.threeRow, flexDirection: isMobile ? 'column' : 'row' }}>
                            <div style={styles.col}>
                                <label style={styles.label}>Year</label>
                                <input type="number" value={year} onChange={e => setYear(e.target.value)} required style={styles.input} placeholder="2022" />
                            </div>
                            <div style={styles.col}>
                                <label style={styles.label}>Price (#)</label>
                                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required style={styles.input} placeholder="45000" />
                            </div>
                            <div style={styles.col}>
                                <label style={styles.label}>Mileage (km)</label>
                                <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} required style={styles.input} placeholder="25000" />
                            </div>
                        </div>

                        <div style={{ ...styles.row, flexDirection: isMobile ? 'column' : 'row' }}>
                            <div style={styles.col}>
                                <label style={styles.label}>Fuel Configuration</label>
                                <select value={fuelType} onChange={e => setFuelType(e.target.value)} style={styles.select}>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <div style={styles.col}>
                                <label style={styles.label}>Transmission System</label>
                                <select value={transmission} onChange={e => setTransmission(e.target.value)} style={styles.select}>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Media Capture Attachments</label>
                            <div style={styles.fileDropZone}>
                                <input type="file" multiple onChange={handleFileChange} accept="image/*" required style={styles.hiddenFileInput} id="car-images" />
                                <label htmlFor="car-images" style={styles.fileLabelBtn}>
                                    {images.length > 0 ? `📁 Selected ${images.length} assets ready` : '📤 Select 2-3 High-Res Car Assets'}
                                </label>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Condition Description & Specifications</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} required style={styles.textarea} placeholder="Tokunbo clean..." />
                        </div>

                        <button type="submit" disabled={isSubmitting} style={isSubmitting ? styles.btnDisabled : styles.btn}>
                            {isSubmitting ? 'Syncing with Cloudinary...' : 'Deploy Asset to Showroom'}
                        </button>
                    </form>
                </div>

                {/* Right Side: Customer Lead Stream */}
                <div style={{ ...styles.card, padding: isMobile ? '1.5rem' : '2.5rem' }}>
                    <h2 style={styles.sectionHeading}>Live Customer Pipeline</h2>
                    <p style={styles.sectionDesc}>Incoming buying intent and offer messages collected dynamically.</p>
                    
                    {loading ? (
                        <div style={styles.loadingSpinner}>Resolving encrypted data...</div>
                    ) : inquiries.length === 0 ? (
                        <div style={styles.emptyBox}>No active client pipelines found in queue.</div>
                    ) : (
                        <div style={styles.leadScrollContainer}>
                            {inquiries.map((iq, idx) => (
                                <div key={iq._id || idx} style={styles.leadCard}>
                                    <div style={styles.leadHeader}>
                                        <h3 style={styles.leadName}>{iq.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={styles.leadStatusBadge}>Active Lead</span>
                                            {/* New Delete Button */}
                                            <button 
                                                onClick={() => handleDeleteInquiry(iq._id)} 
                                                style={styles.deleteBtn}
                                                title="Remove Log Item"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ ...styles.leadMetadata, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.2rem' : '1rem' }}>
                                        <span>📧 {iq.email}</span>
                                        <span>📞 {iq.phone}</span>
                                    </div>
                                    <div style={styles.leadMessageBlock}>
                                        "{iq.message}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: '"Inter", sans-serif', boxSizing: 'border-box' },
    header: { display: 'flex', borderBottom: '1px solid #334155', paddingBottom: '1.5rem', marginBottom: '2.5rem' },
    mainTitle: { fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#ffffff', margin: 0 },
    badge: { fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#3b82f6', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '20px', marginLeft: '0.5rem', verticalAlign: 'middle' },
    subtitle: { color: '#94a3b8', margin: '0.5rem 0 0 0', fontSize: '0.9rem' },
    logoutBtn: { backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '0.6rem 1.2 lg', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' },
    gridContainer: { display: 'grid', gap: '2rem' },
    card: { backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' },
    sectionHeading: { fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', margin: 0 },
    sectionDesc: { color: '#94a3b8', fontSize: '0.85rem', margin: '0.4rem 0 1.5rem 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    threeRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    col: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' },
    input: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
    select: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
    textarea: { backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem', outline: 'none', height: '90px', resize: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' },
    fileDropZone: { border: '2px dashed #475569', borderRadius: '12px', backgroundColor: '#0f172a', textAlign: 'center', padding: '1.5rem', cursor: 'pointer' },
    hiddenFileInput: { display: 'none' },
    fileLabelBtn: { color: '#38bdf8', fontWeight: '600', cursor: 'pointer', display: 'block', fontSize: '0.95rem' },
    btn: { background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', color: '#ffffff', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.4)' },
    btnDisabled: { background: '#475569', color: '#94a3b8', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'not-allowed' },
    successBox: { backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#4ade80', padding: '1rem', borderRadius: '8px', fontWeight: '600' },
    errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '1rem', borderRadius: '8px', fontWeight: '600' },
    leadScrollContainer: { display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' },
    leadCard: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' },
    leadHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    leadName: { margin: 0, fontSize: '1rem', fontWeight: '700', color: '#38bdf8' },
    leadStatusBadge: { fontSize: '0.7rem', fontWeight: '700', color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' },
    leadMetadata: { display: 'flex', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' },
    leadMessageBlock: { backgroundColor: '#1e293b', borderLeft: '3px solid #3b82f6', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic' },
    loadingSpinner: { textAlign: 'center', color: '#94a3b8', padding: '3rem 0', fontWeight: '600' },
    emptyBox: { textAlign: 'center', color: '#94a3b8', padding: '4rem 0', fontStyle: 'italic', border: '1px dashed #334155', borderRadius: '12px' },
    
    // 🗑️ Styled Delete Button Configuration
    deleteBtn: {
        background: 'transparent',
        border: 'none',
        color: '#f87171',
        fontSize: '1.1rem',
        cursor: 'pointer',
        padding: '0.2rem',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
        outline: 'none'
    }
};

export default AdminDashboard;