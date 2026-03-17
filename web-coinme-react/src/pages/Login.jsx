import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css'; 

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    // Si el usuario ya está logueado, lo mandamos a su sitio
    useEffect(() => {
        if (!loading && user) {
            if (user.rol === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/trabajador/fichar');
            }
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include' 
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user);
            } else {
                setError(data.message || 'Error en el login');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginCard} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Iniciar Sesión</h2>
                
                {error && <p className={styles.errorMessage}>{error}</p>}
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    className={styles.input}
                    onChange={e => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    className={styles.input}
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