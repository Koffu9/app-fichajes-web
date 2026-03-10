import { FacebookIcon } from "./icons/FacebookIcon";
import { LinkedInIcon } from "./icons/Linkedinicon";
import { Youtubeicon } from "./icons/Youtubeicon";
import logo_nombre from '../assets/logo_nombre.png';
import { FooterSection } from "./FooterSection";

export function Footer(){
    return (
        <footer>
            <div className='footer-wrap'>
                <div className='footer-top'>
                    <img className='logo-nombre'src={logo_nombre} alt="Logo COIMNE"></img>
                    <div className="banner-socials">
                        <a href="https://www.facebook.com/people/Colegio-Oficial-de-Ingenieros-de-Minas-del-Noroeste-de-Espa%C3%B1a/100055051765057/" aria-label="Facebook"><FacebookIcon color="#1a3a4a"/></a>
                        <a href="https://www.linkedin.com/in/colegio-oficial-de-ingenieros-de-minas-del-noroeste-de-espa%C3%B1a-coimne-903331200/" aria-label="LinkedIn"><LinkedInIcon color="#1a3a4a"/></a>
                        <a href="https://www.youtube.com/channel/UCznCYMJ7_J4hPuUXuQsf4Zg" aria-label="YouTube"><Youtubeicon color="#1a3a4a"/></a>
                    </div>
                    <button className="footer-button">ACCESO PRIVADO</button>
                </div>
                <div className='footer-links'>
                    <FooterSection title="INICIO" links={[
                        {label: "El colegio", href: "#"},
                        {label: "Nuestra Profesión", href: "#"},
                        {label: "Servicios", href: "#"},
                        {label: "Cursos", href: "#"},
                        {label: "Contacto", href: "#"},
                    ]}/>
                        <FooterSection title="BIBLIOTECA" links={[
                        {label: "Revista Digital", href: "#"},
                        {label: "Revistas impresas", href: "#"},
                        {label: "Noticias", href: "#"},
                        {label: "Eventos", href: "#"},
                    ]}/>
                        <FooterSection title="INFORMACIÓN" links={[
                        {label: "Ventanilla única", href: "#"},
                        {label: "Portal de transparencia", href: "#"},
                        {label: "Canal de denuncias", href: "#"},
                    ]}/>
                        <FooterSection title="LEGALES" links={[
                        {label: "Aviso Legal", href: "#"},
                        {label: "Politica de privacidad", href: "#"},
                        {label: "Accesibilidad", href: "#"},
                        {label: "Sitemap", href: "#"},
                        {label: "Politicas de cookies", href: "#"},
                        {label: "Descargo responsabilidad", href: "#"},
                    ]}/>
                </div>
                <div className='footer-bottom'>
                    <span>© 2025 Copyright Coimne</span>
                    <span>Diseño y desarrollo web: <a href="#">mpluslab.com</a></span>
                </div>
            </div>
        </footer>
    )
}