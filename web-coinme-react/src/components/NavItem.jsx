import { useState } from 'react'
export function NavItem({ label, submenu = [] }) {
    const [open, setOpen] = useState(false)
    return (
        <li onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <a href="#">{label}</a>
            {submenu.length > 0 && (
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            {submenu.length > 0 && open && (
                <ul className="submenu">
                    {submenu.map(item => (
                        <NavItem
                            key={item.label}
                            label={item.label}
                            submenu={item.submenu || []}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}