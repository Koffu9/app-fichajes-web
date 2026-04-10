import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css'; 

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // Añadimos checkAuth del contexto
    const { login, user, loading, checkAuth } = useAuth(); 
    const navigate = useNavigate();

    // Si el usuario ya está logueado, lo mandamos a su sitio
    useEffect(() => {
        if (!loading && user) {
            if (user.rol === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (user.rol === 'trabajador') {
                navigate('/trabajador/fichar', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiamos errores previos al intentar de nuevo
        
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include' 
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user); 
                if (checkAuth) await checkAuth(); 
            } else {
                setError(data.message || 'Error en el login');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        }
    };

    // Estilo para el estado de carga (puedes usar el mismo que en el ProtectedRoute)
    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#1a3a4a' }}>
            Cargando...
        </div>
    );

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginCard} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Iniciar Sesión</h2>
                
                {error && <p className={styles.errorMessage}>{error}</p>}
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    className={styles.input}
                    value={email} // Buena práctica: input controlado
                    onChange={e => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    className={styles.input}
                    value={password} // Buena práctica: input controlado
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
                
                <button type="submit" className={styles.loginButton}>
                    Entrar
                </button>
            </form>
        </div>
    );
}