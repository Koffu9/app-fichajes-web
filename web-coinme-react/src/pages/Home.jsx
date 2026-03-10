import { Hero } from '../components/Hero.jsx'
import { QuickLinkItem } from '../components/QuickLinkItem.jsx'
import ventanilla from '../assets/informacion-personal.png'
import portal from '../assets/transparencia.png'
import visado from '../assets/visado.png'
import noticias from '../assets/noticias.png'
import cursos from '../assets/cursos.png'
import empleado from '../assets/empleado.png'
import styles from './Home.module.css'
import { StatItem } from '../components/StatItem.jsx'
import { CourseCard } from '../components/CourseCard'
import curso1 from '../assets/curso1.jpg'
import curso2 from '../assets/curso2.png'
import { NewsSlider } from '../components/NewsSlider.jsx'

export function Home() {
    return (
        <main>
            <Hero />
            <section className={styles.quickLinks}>
                <QuickLinkItem href="#" icon={ventanilla} text="Ventanilla única" />
                <QuickLinkItem href="#" icon={portal} text="Portal transparencia" />
                <QuickLinkItem href="#" icon={visado} text="Visado electrónico" />
                <QuickLinkItem href="#" icon={noticias} text="Noticias" />
                <QuickLinkItem href="#" icon={cursos} text="Cursos" />
                <QuickLinkItem href="#" icon={empleado} text="Bolsa empleo" />
            </section>

            <section className={styles.statsSection}>
                <h2>CONSTRUYENDO JUNTOS EL FUTURO PARA NUEVAS GENERACIONES</h2>
                <div className={styles.statsItems}>
                    <StatItem value="1542" label={<>COLEGIADOS Y COLEGIADAS</>} />
                    <StatItem value="17.25%" label="COLEGIADAS" />
                    <StatItem value="32.20%" label="MENORES DE 35 AÑOS" />
                </div>
            </section>

            <section className={styles.cursosSection}>
                <h2>Cursos para tu desarrollo profesional</h2>
                <p>El <strong>Colegio Oficial de Ingenieros de Minas del Noroeste de España</strong> ofrece un <strong>catálogo de cursos en constante actualización</strong>, dirigidos tanto a colegiados como al público general interesado en ampliar sus conocimientos en el ámbito de la ingeniería minera y sectores relacionados.</p>
                <p>A través de programas especializados y conferencias impartidas por expertos, proporcionamos una formación de calidad, adaptada a las últimas tendencias y necesidades del mercado, para impulsar el desarrollo profesional y académico de nuestros participantes.</p>
                <div className={styles.cursosGrid}>
                    <CourseCard
                        image={curso1}
                        title="II Curso de inteligencia artificial (enero 2026)"
                        date="Nov 19, 2025"
                        description="Curso II de inteligencia artificial (enero 2026)Zona de descargas Es necesario completar primero los siguientes archivos..."
                    />
                    <CourseCard
                        image={curso2}
                        title="Curso online TRNSYS18"
                        date="Oct 8, 2025"
                        description="Curso online TRNSYS18Zona de descargas Es necesario completar primero los siguientes archivos para poder inscribirse al..."
                    />
                </div>
                <button className={styles.cursosBtn}>VER TODOS LOS CURSOS</button>
            </section>

            <NewsSlider/>
        </main>
    )
}

