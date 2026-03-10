import { useState } from 'react';

export function Fichajes() {
    const [logs, setLogs] = useState([]);
    const [filtro, setFiltro] = useState({ inicio: '', fin: '', trabajador: '' });

    const buscar = async () => {
        const res = await fetch(`http://localhost:3000/api/fichajes/todos?trabajador=${filtro.trabajador}`, { 
            credentials: 'include' 
        });
        const data = await res.json();
        setLogs(data);
    };

    return (
        <div>
            <h2>Gestión de Fichajes</h2>
            <input type="text" placeholder="ID Trabajador" onChange={e => setFiltro({...filtro, trabajador: e.target.value})} />
            <button onClick={buscar}>Filtrar</button>
            <table>
                <thead><tr><th>ID</th><th>Tipo</th><th>Hora</th></tr></thead>
                <tbody>
                    {logs.map(log => <tr key={log.id}><td>{log.id}</td><td>{log.tipo}</td><td>{log.hora}</td></tr>)}
                </tbody>
            </table>
        </div>
    );
}