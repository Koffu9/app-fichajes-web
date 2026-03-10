import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // Si no hay usuario, al login
    if (!user) return <Navigate to="/login" replace />;

    // Si el rol no está permitido a la home
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
};
