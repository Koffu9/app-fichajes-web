import styles from './statItem.module.css'
export function StatItem({ value, label }) {
    return (
        <div className={styles.statItem}>
            <h2>{value}</h2>
            <p>{label}</p>
        </div>
    )
}