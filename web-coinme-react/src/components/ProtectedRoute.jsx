import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth(); // Añadimos loading del context

    // Mientras el backend responde si hay sesión, mostramos pantalla de carga ---
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontFamily: 'Open Sans, sans-serif',
                color: '#1a3a4a'
            }}>
                Cargando sesión...
            </div>
        );
    }

    // Si no hay usuario, al login (Mantenemos tu línea original)
    if (!user) return <Navigate to="/login" replace />;

    // Si el rol no está permitido a la home (Mantenemos tu lógica de allowedRoles)
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
};