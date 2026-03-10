import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import styles from './NewsSlider.module.css'
import noticia1 from '../assets/1.jpg'
import noticia2 from '../assets/2.jpg'
import noticia3 from '../assets/3.jpg'

const slides = [
    {
        image: noticia1,
        date: 'Nov 9, 2025',
        title: 'ACTUALIZACIÓN DEL LISTADO DE COLEGIADOS PARA ACTUAR COMO PERITOS',
        description: 'El Colegio debe enviar a Juzgados y Agencia Tributaria, relación de ingenieros de minas inscritos en el Colegio'
    },
    {
        image: noticia2,
        date: 'Nov 9, 2025',
        title: 'ACTUALIZACIÓN DEL LISTADO DE COLEGIADOS PARA ACTUAR COMO PERITOS',
        description: 'Descripción de la noticia...'
    },
    {
        image: noticia3,
        date: 'Nov 9, 2025',
        title: 'SANTA BÁRBARA 2025',
        description: 'NOTICIA PRIVADA SOLO PARA COLEGIADOS'
    }
]

export function NewsSlider() {
    const swiperRef = useRef(null)

    return (
        <section className={styles.newsSection}>
            <div className={styles.swiperWrapper}>
                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    speed={2000}
                    modules={[EffectFade, Autoplay]}
                    effect="fade"
                    autoplay={{ delay: 4000 }}
                    loop
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} className={styles.slide}>
                            <div className={styles.slideBackground} style={{ backgroundImage: `url(${slide.image})` }} />
                            <div className={styles.slideCard}>
                                <span className={styles.date}>{slide.date}</span>
                                <h2>{slide.title}</h2>
                                <p>{slide.description}</p>
                                <button className={styles.readMore}>LEER MÁS</button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button className={styles.prevBtn} onClick={() => swiperRef.current?.slidePrev()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <button className={styles.nextBtn} onClick={() => swiperRef.current?.slideNext()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </section>
    )
}