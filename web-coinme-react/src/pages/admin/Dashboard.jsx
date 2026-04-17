import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { AdminNav } from '../../components/AdminNav';

export function Dashboard() {
    const [resumen, setResumen] = useState({ activos: 0, alertas: 0 });

    useEffect(() => {
        fetch('http://localhost:3000/api/usuarios/resumen', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setResumen({ activos: data.activos, alertas: data.alertas }))
            .catch(err => console.error("Error cargando resumen:", err));
    }, []);

    return (
        <>
        <AdminNav />
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard Administrador</h1>
            
            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <h3>Trabajadores Activos</h3>
                    <p>{resumen.activos}</p>
                </div>

                <div className={`${styles.card} ${styles.cardAlert}`}>
                    <h3>Alertas</h3>
                    <p>{resumen.alertas} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>jornadas abiertas</span></p>
                </div>
            </div>

            
        </div>
        </>
    );
}