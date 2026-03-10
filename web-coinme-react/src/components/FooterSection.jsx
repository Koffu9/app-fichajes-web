export function FooterSection({title, links = []}){
    return (
        <div className="footer-section">
            <h4>{title}</h4>
            <ul>
                {links.map(link=>(
                    <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}