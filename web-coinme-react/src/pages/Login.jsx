import { useState, useEffect } from 'react'; // Añadimos useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import styles from './Login.module.css'; // Asegúrate de tener el CSS

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth(); // Añadimos 'user' para verificar si ya está logueado
    const navigate = useNavigate();

    // --- AÑADIDO: Redirección automática si ya está logueado ---
    useEffect(() => {
        if (user) {
            if (user.rol === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/trabajador/fichar');
            }
        }
    }, [user, navigate]);
    // ----------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Regla 6: credentials include es obligatorio
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include' 
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user);
                // Redirección según rol
                if (data.user.rol === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/trabajador/fichar');
                }
            } else {
                setError(data.message || 'Error en el login');
            }
        } catch (err) { // Corregido el error de sintaxis: (console.error();) -> (err)
            console.error(err);
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}