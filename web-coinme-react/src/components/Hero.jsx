import styles from './Hero.module.css'
import video from '../assets/COIMNE.mp4'

export function Hero() {
    return (
        <section className={styles.hero}>
            <video src={video} autoPlay muted loop />
            <div className={styles.heroRight}>
                <div className={styles.heroRightTop}>
                    <h2>Ingeniería de minas: impulsando un futuro sostenible</h2>
                </div>
                <div className={styles.heroRightBottom}>
                    <h2>Nueva Revista Digital ENTIBA</h2>
                    <button>DESCÚBRELA</button>
                </div>
            </div>
        </section>
    )
}