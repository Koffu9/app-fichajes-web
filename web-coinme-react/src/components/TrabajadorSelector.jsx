import { useState, useEffect } from 'react';

// Es fundamental que diga "export function" para que el import con { } funcione
// Añadimos "value" a las props para que el componente sea controlado desde fuera
export function TrabajadorSelector({ onSelect, value }) {
    const [trabajadores, setTrabajadores] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/usuarios/trabajadores', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setTrabajadores(data))
            .catch(err => console.error("Error cargando trabajadores", err));
    }, []);

    return (
        <select 
            value={value} // <--- Añadido: permite sincronizar el selector con el estado externo
            onChange={(e) => onSelect(e.target.value)} 
            style={{ padding: '5px', borderRadius: '4px' }}
        >
            <option value="">Todos los trabajadores</option>
            {trabajadores.map(t => (
                <option key={t.id} value={t.id}>
                    {t.nombre} {t.apellidos}
                </option>
            ))}
        </select>
    );
}