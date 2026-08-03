import { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Showroom = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Google OAuth URL Intercept Setup
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token');
    const { handleGoogleSuccess } = useContext(AuthContext);
    const navigate = useNavigate();

    // Catch token from Google redirect, initialize session, and clean URL
    useEffect(() => {
        if (tokenFromUrl) {
            handleGoogleSuccess(tokenFromUrl);
            navigate('/showroom', { replace: true });
        }
    }, [tokenFromUrl]);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTransmission, setSelectedTransmission] = useState('All');
    const [selectedFuel, setSelectedFuel] = useState('All');
    const [maxPrice, setMaxPrice] = useState(500000);
    const [dynamicMaxPriceLimit, setDynamicMaxPriceLimit] = useState(500000);

    useEffect(() => {
        axios.get('https://josh-autos-backend.onrender.com/api/cars')
            .then(res => {
                if (res.data.success) {
                    setCars(res.data.cars);

                    if (res.data.cars.length > 0) {
                        const highestPrice = Math.max(...res.data.cars.map(c => c.price || 0));
                        setDynamicMaxPriceLimit(highestPrice + 10000);
                        setMaxPrice(highestPrice + 10000);
                    }
                }
            })
            .catch(err => console.error("Error fetching showroom inventory:", err))
            .finally(() => setLoading(false));
    }, []);

    // Filter Matrix Logic
    const filteredCars = cars.filter(car => {
        const query = searchQuery.toLowerCase();

        const matchesText =
            car.title?.toLowerCase().includes(query) ||
            car.brand?.toLowerCase().includes(query) ||
            car.model?.toLowerCase().includes(query);

        const matchesTransmission =
            selectedTransmission === 'All' ||
            car.transmission?.toLowerCase() === selectedTransmission.toLowerCase();

        const matchesFuel =
            selectedFuel === 'All' ||
            car.fuelType?.toLowerCase() === selectedFuel.toLowerCase();

        const matchesPrice = (car.price || 0) <= maxPrice;

        return matchesText && matchesTransmission && matchesFuel && matchesPrice;
    });

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedTransmission('All');
        setSelectedFuel('All');
        setMaxPrice(dynamicMaxPriceLimit);
    };

    return (
        <div style={styles.container}>
            <style>{`
                body { margin: 0; background-color: #05070f; }
                aside::-webkit-scrollbar { width: 6px; }
                aside::-webkit-scrollbar-track { background: transparent; }
                aside::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
                aside::-webkit-scrollbar-thumb:hover { background: #334155; }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; height: 16px; width: 16px;
                    border-radius: 50%; background: #3b82f6; cursor: pointer;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); transition: transform 0.1s;
                }
                input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.2); }

                /* Fix Price Tag Overlay & Stack Order */
                .showroom-price-tag {
                    z-index: 2 !important;
                }

                /* Mobile & Tablet Responsiveness */
                @media (max-width: 900px) {
                    .showroom-layout {
                        flex-direction: column !important;
                        flex-wrap: nowrap !important;
                    }
                    .showroom-sidebar {
                        width: 100% !important;
                        flex: 1 1 100% !important;
                        position: relative !important;
                        top: 0 !important;
                        max-height: none !important;
                        margin-bottom: 2rem;
                    }
                    .showroom-grid-container {
                        width: 100% !important;
                        flex: 1 1 100% !important;
                        min-width: 0 !important;
                    }
                }

                @media (max-width: 600px) {
                    .showroom-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <header style={styles.header}>
                <h1 style={styles.mainTitle}>
                    Josh Autos <span style={styles.badge}>Showroom</span>
                </h1>
                <p style={styles.subtitle}>Explore our pristine collection of verified exotic and domestic vehicles</p>

                <div style={styles.searchWrapper}>
                    <div style={styles.searchIconContainer}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search inventory by name, brand, or model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </header>

            {loading ? (
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <div style={styles.loadingText}>Scanning cloud vaults for available inventory...</div>
                </div>
            ) : (
                <div style={styles.layoutWrapper} className="showroom-layout">
                    <aside style={styles.sidebar} className="showroom-sidebar">
                        <div style={styles.sidebarHeader}>
                            <h3 style={styles.sidebarTitle}>Filter Catalog</h3>
                            <button onClick={handleResetFilters} style={styles.resetBtn}>Reset All</button>
                        </div>

                        <div style={styles.filterSection}>
                            <label style={styles.filterLabel}>Transmission</label>
                            <div style={styles.filterButtonGroup}>
                                {['All', 'Automatic', 'Manual', 'SMG'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedTransmission(type)}
                                        style={{
                                            ...styles.filterTab,
                                            ...(selectedTransmission === type ? styles.activeFilterTab : {})
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={styles.filterSection}>
                            <label style={styles.filterLabel}>Fuel System</label>
                            <div style={styles.filterButtonGroup}>
                                {['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'].map(fuel => (
                                    <button
                                        key={fuel}
                                        onClick={() => setSelectedFuel(fuel)}
                                        style={{
                                            ...styles.filterTab,
                                            ...(selectedFuel === fuel ? styles.activeFilterTab : {})
                                        }}
                                    >
                                        {fuel}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={styles.filterSection}>
                            <div style={styles.sliderLabelRow}>
                                <label style={styles.filterLabel}>Max Price</label>
                                <span style={styles.sliderValue}>${maxPrice.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={dynamicMaxPriceLimit}
                                step="1000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                style={styles.priceSlider}
                            />
                            <div style={styles.sliderRangeHint}>
                                <span>$0</span>
                                <span>${dynamicMaxPriceLimit.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={styles.resultsCounter}>
                            Showing {filteredCars.length} of {cars.length} Vehicles
                        </div>
                    </aside>

                    <main style={styles.gridContainer} className="showroom-grid-container">
                        {filteredCars.length === 0 ? (
                            <div style={styles.emptyContainer}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                                    <circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                <div style={styles.empty}>No vehicles match your refined parameters. Try broadening adjustments!</div>
                            </div>
                        ) : (
                            <div style={styles.grid} className="showroom-grid">
                                {filteredCars.map(car => (
                                    <div key={car._id} style={styles.card}>
                                        <div style={styles.imageWrapper}>
                                            <img
                                                src={car.images && car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop'}
                                                alt={car.title}
                                                style={styles.image}
                                            />
                                            <span style={styles.priceTag} className="showroom-price-tag">#{car.price?.toLocaleString()}</span>
                                        </div>

                                        <div style={styles.cardContent}>
                                            <div style={styles.cardTopBody}>
                                                <h3 style={styles.carTitle}>{car.title}</h3>
                                                <p style={styles.carSpecs}>
                                                    <span>🗓️ {car.year}</span> <span style={styles.dotDivider}>•</span> <span>🛣️ {car.mileage?.toLocaleString()} km</span>
                                                </p>

                                                <div style={styles.badgeRow}>
                                                    <span style={styles.infoBadge}>{car.transmission}</span>
                                                    <span style={styles.infoBadge}>{car.fuelType}</span>
                                                </div>

                                                <p style={styles.descTruncate}>{car.description}</p>
                                            </div>

                                            <Link to={`/cars/${car._id}`} style={styles.viewBtn}>
                                                View Full Details
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
                                                    <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#05070f',
        color: '#f8fafc',
        padding: '3rem 2rem 5rem 2rem',
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at 80% 10%, #0f1229 0%, #05070f 70%)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    mainTitle: {
        fontSize: '2.8rem',
        fontWeight: '800',
        color: '#ffffff',
        margin: 0,
        letterSpacing: '-0.04em',
    },
    badge: {
        fontSize: '0.85rem',
        fontWeight: '700',
        backgroundColor: '#10b981',
        color: '#ffffff',
        padding: '0.35rem 0.85rem',
        borderRadius: '30px',
        marginLeft: '0.5rem',
        verticalAlign: 'middle',
        letterSpacing: '0.03em',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
        textTransform: 'uppercase'
    },
    subtitle: {
        color: '#64748b',
        marginTop: '0.6rem',
        fontSize: '1rem',
        fontWeight: '400',
        maxWidth: '500px'
    },
    searchWrapper: {
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        marginTop: '2rem'
    },
    searchIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '1.25rem',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none'
    },
    searchInput: {
        width: '100%',
        padding: '1rem 1.25rem 1rem 3.25rem',
        backgroundColor: '#0f1322',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        color: '#ffffff',
        fontSize: '0.95rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.25s ease',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8rem 0'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid rgba(59, 130, 246, 0.1)',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1.5rem'
    },
    loadingText: {
        color: '#64748b',
        fontWeight: '500',
        fontSize: '1rem',
    },
    emptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        backgroundColor: '#0b0f19',
        borderRadius: '20px',
        border: '1px dashed #1e293b',
        width: '100%',
        boxSizing: 'border-box'
    },
    empty: {
        color: '#64748b',
        fontSize: '0.95rem',
        textAlign: 'center',
        maxWidth: '400px'
    },
    layoutWrapper: {
        display: 'flex',
        flexDirection: 'row',
        gap: '2.5rem',
        maxWidth: '1300px',
        margin: '0 auto',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    },
    sidebar: {
        flex: '1 1 280px',
        backgroundColor: '#0b0f19',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid #1e293b',
        boxSizing: 'border-box',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: '2rem',
        maxHeight: 'calc(100vh - 4rem)',
        overflowY: 'auto'
    },
    sidebarHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '1rem'
    },
    sidebarTitle: {
        fontSize: '1.05rem',
        color: '#ffffff',
        fontWeight: '700',
        margin: 0
    },
    resetBtn: {
        background: 'none',
        border: 'none',
        color: '#ef4444',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '600',
        padding: 0,
        transition: 'opacity 0.2s',
    },
    filterSection: {
        marginBottom: '2rem'
    },
    filterLabel: {
        display: 'block',
        color: '#64748b',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
        letterSpacing: '0.05em'
    },
    filterButtonGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem'
    },
    filterTab: {
        backgroundColor: '#0f1322',
        color: '#94a3b8',
        border: '1px solid #1e293b',
        padding: '0.45rem 0.9rem',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    activeFilterTab: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderColor: '#3b82f6',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
    },
    sliderLabelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
    },
    sliderValue: {
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: '700'
    },
    priceSlider: {
        width: '100%',
        margin: '0.5rem 0',
        accentColor: '#3b82f6',
        cursor: 'pointer',
        backgroundColor: '#1e293b',
        height: '4px',
        borderRadius: '2px',
        appearance: 'none',
        outline: 'none'
    },
    sliderRangeHint: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#475569',
        fontSize: '0.7rem',
        fontWeight: '600'
    },
    resultsCounter: {
        textAlign: 'center',
        color: '#475569',
        fontSize: '0.75rem',
        fontWeight: '600',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #1e293b'
    },
    gridContainer: {
        flex: '3 1 680px',
        minWidth: '320px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '1.5rem',
        width: '100%'
    },
    card: {
        backgroundColor: '#0b0f19',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #1e293b',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '460px',
        boxSizing: 'border-box',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: '210px',
        backgroundColor: '#05070f',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    priceTag: {
        position: 'absolute',
        bottom: '14px',
        right: '14px',
        backgroundColor: '#05070f',
        color: '#ffffff',
        fontWeight: '700',
        padding: '0.45rem 0.85rem',
        borderRadius: '10px',
        fontSize: '0.95rem',
        border: '1px solid #1e293b',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    },
    cardContent: {
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
    },
    cardTopBody: {
        display: 'flex',
        flexDirection: 'column'
    },
    carTitle: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#ffffff',
        margin: '0 0 0.4rem 0',
    },
    carSpecs: {
        color: '#64748b',
        fontSize: '0.8rem',
        margin: '0 0 1rem 0',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
    },
    dotDivider: {
        margin: '0 6px',
        color: '#334155'
    },
    badgeRow: {
        display: 'flex',
        gap: '0.4rem',
        marginBottom: '1rem'
    },
    infoBadge: {
        backgroundColor: '#0f1322',
        color: '#94a3b8',
        fontSize: '0.7rem',
        fontWeight: '600',
        padding: '0.3rem 0.6rem',
        borderRadius: '6px',
        textTransform: 'uppercase',
        border: '1px solid #1e293b'
    },
    descTruncate: {
        color: '#94a3b8',
        fontSize: '0.85rem',
        lineHeight: '1.5',
        margin: '0 0 1.5rem 0',
        height: '38px',
        display: '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    viewBtn: {
        textDecoration: 'none',
        textAlign: 'center',
        padding: '0.8rem',
        background: '#3b82f6',
        color: '#ffffff',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
        transition: 'background 0.2s ease'
    }
};

export default Showroom;