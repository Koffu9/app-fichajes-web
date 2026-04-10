import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- NUEVO: Función para verificar sesión con el Backend ---
    const checkAuth = async () => {
        try {
            // Llamamos a la API para saber quién es el usuario actual
            const res = await fetch('/api/auth/me', { 
                credentials: 'include' 
            });
            
            if (res.ok) {
                const data = await res.json();
                setUser(data.user); // El backend debe devolver { user: { email, rol, ... } }
            } else {
                setUser(null);
                localStorage.removeItem('user'); // Limpieza por si acaso
            }
        } catch (error) {
            console.error("Error verificando sesión:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Al arrancar, en lugar de solo leer localStorage, preguntamos al servidor
        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
        // Opcional: puedes seguir guardando algo básico en localStorage si quieres,
        // pero el "rol" real vendrá de la sesión del servidor (checkAuth).
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            // Avisamos al backend para que destruya la sesión
            await fetch('/api/auth/logout', { 
                method: 'POST', 
                credentials: 'include' 
            });
        } catch (error) {
            console.error("Error al cerrar sesión en servidor:", error);
        } finally {
            // Limpiamos todo en el cliente pase lo que pase
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);