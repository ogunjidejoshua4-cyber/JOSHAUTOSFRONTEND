import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading system security...</div>;
    }

    // If not logged in, or logged in but NOT an admin, kick them back to login
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;