import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Importamos los estilos

export function Dashboard() {
    const [resumen, setResumen] = useState({ activos: 0, alertas: 0 });

    useEffect(() => {
        fetch('http://localhost:3000/api/admin/resumen', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setResumen(data))
            .catch(err => console.error("Error cargando resumen:", err));
    }, []);

    return (
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

            <nav className={styles.navBar}>
                <Link to="/admin/fichajes" className={styles.link}>Fichajes</Link>
                <span className={styles.separator}>|</span>
                <Link to="/admin/informes" className={styles.link}>Informes</Link>
                <span className={styles.separator}>|</span>
                <Link to="/admin/ausencias" className={styles.link}>Ausencias</Link>
            </nav>
        </div>
    );
}