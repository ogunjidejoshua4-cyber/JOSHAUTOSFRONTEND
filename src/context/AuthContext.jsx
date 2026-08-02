import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// 💡 Dynamically fallback to local development if env var isn't set
const API_URL = import.meta.env.VITE_API_URL || "https://josh-autos-backend.onrender.com";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // 1. App initialization: Fetch user profile ONLY once when the app boots up 
    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
                    const res = await axios.get(`${API_URL}/api/auth/me`);
                    if (res.data.success || res.data.status) {
                        setUser(res.data.user || res.data);
                    } else {
                        handleLogout();
                    }
                } catch (err) {
                    console.error("Auth initialization failed:", err);
                    handleLogout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Helper to clean up credentials safely
    const handleLogout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    // 🎯 2. Google OAuth Token Processor
    const handleGoogleSuccess = async (newToken) => {
        try {
            localStorage.setItem('token', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);

            // Fetch user profile using the Google JWT token
            const res = await axios.get(`${API_URL}/api/auth/me`);
            if (res.data.success || res.data.status) {
                setUser(res.data.user || res.data);
            }
        } catch (err) {
            console.error("Google Auth user fetch failed:", err);
            handleLogout();
        }
    };

    // 3. Manual Login function
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            
            if (res.data.success) {
                const userToken = res.data.token;
                const userData = res.data.user;

                localStorage.setItem('token', userToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
                
                setToken(userToken);
                setUser(userData); 
            }
            return res.data;
        } catch (error) {
            console.error("Login request error:", error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        handleLogout();
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading, 
            login, 
            logout, 
            setUser, 
            setToken, 
            handleGoogleSuccess 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};