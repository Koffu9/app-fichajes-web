import styles from "./QuickLinkItem.module.css"

export function QuickLinkItem({ icon, text, href }){
    return (
    <a href={href}className={styles.iconBox}>
        <img src={icon}></img>
        <p>{text}</p>
    </a>
    )
}