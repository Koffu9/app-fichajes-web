import styles from './CourseCard.module.css'
export function CourseCard({ image, title, date, description }) {
    return (
        <div className={styles.courseCard}>
            <img src={image} alt={title} />
            <div className={styles.courseCardContent}>
                <h3>{title}</h3>
                <span>{date}</span>
                <p>{description}</p>
            </div>
        </div>
    )
}