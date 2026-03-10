import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Dashboard() {
    const [resumen, setResumen] = useState({ activos: 0, alertas: 0 });

    useEffect(() => {
        fetch('http://localhost:3000/api/admin/resumen', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setResumen(data));
    }, []);

    return (
        <div style={{ padding: '30px' }}>
            <h1>Dashboard Administrador</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Trabajadores Activos</h3>
                    <p>{resumen.activos}</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Alertas</h3>
                    <p>{resumen.alertas} jornadas sin cerrar</p>
                </div>
            </div>
            <nav style={{ marginTop: '20px' }}>
                <Link to="/admin/fichajes">Ir a Fichajes</Link> | 
                <Link to="/admin/informes">Ir a Informes</Link> | 
                <Link to="/admin/ausencias">Ir a Ausencias</Link>
            </nav>
        </div>
    );
}