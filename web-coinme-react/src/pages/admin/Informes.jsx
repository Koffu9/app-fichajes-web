import { useState } from 'react';

export function Informes() {
    const [datos, setDatos] = useState([]);

    const generar = async (tipo) => {
        const res = await fetch(`http://localhost:3000/api/informes/${tipo}`, { credentials: 'include' });
        const data = await res.json();
        setDatos(data);
    };

    return (
        <div>
            <h2>Informes</h2>
            <button onClick={() => generar('mensual')}>Informe Mensual</button>
            {/* Tabla de resultados */}
        </div>
    );
}