import { useState, useEffect } from 'react';

export function Ausencias() {
    const [lista, setLista] = useState([]);

    const cargar = () => {
        fetch('http://localhost:3000/api/ausencias', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setLista(data));
    };

    return (
        <div>
            <h2>Ausencias</h2>
            <button onClick={cargar}>Actualizar Lista</button>
            <ul>
                {lista.map(a => <li key={a.id}>{a.trabajador} - {a.motivo}</li>)}
            </ul>
        </div>
    );
}