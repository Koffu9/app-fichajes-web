import { NavLink } from 'react-router-dom';
import styles from './AdminNav.module.css';

export function AdminNav() {
    return (
        <nav className={styles.navBar}>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Dashboard
            </NavLink>
            <NavLink to="/admin/fichajes" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Fichajes
            </NavLink>
            <NavLink to="/admin/informes" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Informes
            </NavLink>
            <NavLink to="/admin/ausencias" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Ausencias
            </NavLink>
        </nav>
    );
}