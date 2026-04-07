import '../index.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { FacebookIcon } from './icons/FacebookIcon'
import { LinkedInIcon } from './icons/Linkedinicon'
import { Youtubeicon } from './icons/Youtubeicon'
import { NavItem } from './NavItem'
import logo_escudo from '../assets/logo_escudo.png'
import logo_nombre from '../assets/logo_nombre.png';

export function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // Inicializamos el hook de navegación

    // Función para cerrar sesión y saltar a la home
    const handleLogout = async () => {
        await logout(); // Ejecuta la limpieza en el Context y la llamada al backend
        navigate('/');  // Redirige a la homepage
    };

    // Header simplificado para trabajador en móvil
    if (user?.rol === 'trabajador') {
        return (
            <header className="header-trabajador">
                <img src={logo_nombre} alt="Logo COIMNE" className="header-trabajador-logo" />
                <div className="header-trabajador-socials">
                    <a href="https://www.facebook.com/people/Colegio-Oficial-de-Ingenieros-de-Minas-del-Noroeste-de-Espa%C3%B1a/100055051765057/" aria-label="Facebook"><FacebookIcon color="#1a3a4a"/></a>
                    <a href="https://www.linkedin.com/in/colegio-oficial-de-ingenieros-de-minas-del-noroeste-de-espa%C3%B1a-coimne-903331200/" aria-label="LinkedIn"><LinkedInIcon color="#1a3a4a"/></a>
                    <a href="https://www.youtube.com/channel/UCznCYMJ7_J4hPuUXuQsf4Zg" aria-label="YouTube"><Youtubeicon color="#1a3a4a"/></a>
                </div>
                <button onClick={handleLogout} className="nav-button" style={{ backgroundColor: '#d32f2f' }}>
                    CERRAR SESIÓN
                </button>
            </header>
        );
    }
    // Header completo para admin y visitantes
    return (
        <header>
            <div className="banner">
                <div className="banner-wrap">
                    <span className="banner-title">
                        <strong>COLEGIO OFICIAL DE INGENIEROS DE MINAS DEL NOROESTE DE ESPAÑA</strong>
                    </span>
                    <div className="banner-socials">
                        <a href="https://www.facebook.com/people/Colegio-Oficial-de-Ingenieros-de-Minas-del-Noroeste-de-Espa%C3%B1a/100055051765057/" aria-label="Facebook"><FacebookIcon /></a>
                        <a href="https://www.linkedin.com/in/colegio-oficial-de-ingenieros-de-minas-del-noroeste-de-espa%C3%B1a-coimne-903331200/" aria-label="LinkedIn"><LinkedInIcon /></a>
                        <a href="https://www.youtube.com/channel/UCznCYMJ7_J4hPuUXuQsf4Zg" aria-label="YouTube"><Youtubeicon /></a>
                    </div>
                </div>
            </div>
            <div className="nav-box">
                <div className="nav-wrap">
                    <Link to="/">
                        <img className='nav-logo' src={logo_escudo} alt="Logo COIMNE" />
                    </Link>
                    <nav className='nav-menu'>
                        <ul className='nav-list'>
                            <li><Link to="/">INICIO</Link></li>
                            <NavItem label="UNETE"
                                submenu={[
                                    { label: "Toda la información", href: "#" },
                                    { label: "Colegiación", href: "#" },
                                    { label: "Precolegiación", href: "#" },]}></NavItem>
                            <NavItem label="CONOCENOS"
                                submenu={[
                                    {
                                        label: "EL COLEGIO",
                                        submenu: [{ label: "Misión visión y valores", href: "#" },
                                        { label: "Junta Directiva", href: "#" },
                                        { label: "Normativa colegial", href: "#" },
                                        { label: "Nuestros colegiados", href: "#" },
                                        { label: "Memoria de actividades", href: "#" },
                                        ]
                                    },
                                    {
                                        label: "NUESTRA PROFESIÓN",
                                        submenu: [{ label: "Historia", href: "#" },
                                        { label: "Competencias profesionales", href: "#" },
                                        { label: "Estudiar ingeniería", href: "#" },
                                        { label: "Requisitos para la colegiación", href: "#" },
                                        { label: "Salidas laborales", href: "#" },
                                        ]
                                    },
                                ]}>

                            </NavItem>
                            <NavItem label="SERVICIOS"
                                submenu={[
                                    { label: "Toda la información", href: "#" },
                                    { label: "Visado electrónico", href: "#" },
                                    { label: "Certificación de personas", href: "#" },
                                    { label: "Listados profesionales", href: "#" },
                                    { label: "Directorio colegiados", href: "#" },
                                    { label: "Promoción competencias", href: "#" },
                                    { label: "Apoya imagen personal", href: "#" },
                                    { label: "Becas", href: "#" },
                                    { label: "Empleo y Bolsa de trabajo", href: "#" },
                                    { label: "Convenios y Seguros", href: "#" },
                                    { label: "Actividades formativas", href: "#" },]}></NavItem>
                            <li><a href="">CURSOS</a></li>
                            <NavItem label="ACTIVIDADES"
                                submenu={[
                                    { label: "Noticias", href: "#" },
                                    { label: "Eventos", href: "#" },]}></NavItem>
                            <NavItem label="BIBLIOTECA"
                                submenu={[
                                    { label: "KIOSKO DIGITAL", href: "#" },
                                    { label: "REVISTA DIGITAL", href: "#" },
                                    { label: "Revistas impresas", href: "#" },
                                    { label: "Publicaciones técnicas", href: "#" },
                                    { label: "Documentación técnica", href: "#" },
                                    { label: "Normativas y legislación", href: "#" },
                                    { label: "Otros documentos", href: "#" },]}></NavItem>
                            <li><a href="">CONTACTO</a></li>

                        </ul>
                    </nav>

                    {/* Cambiado: botón de cierre de sesión con redirección */}
                    {user ? (
                        <button onClick={handleLogout} className='nav-button' style={{ backgroundColor: '#d32f2f' }}>
                            CERRAR SESIÓN
                        </button>
                    ) : (
                        <Link to="/login" className='nav-button'>ACCESO PRIVADO</Link>
                    )}
                </div>
            </div>
        </header>
    )
}