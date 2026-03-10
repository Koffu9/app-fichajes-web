import { useState, useEffect } from 'react';

export function Fichar() {
    const [estado, setEstado] = useState({ proximoTipo: 'entrada', ultimoFichaje: null });
    const [motivoId, setMotivoId] = useState('');

    const cargarEstado = async () => {
        const res = await fetch('http://localhost:3000/api/fichajes/estado', { credentials: 'include' });
        const data = await res.json();
        setEstado(data);
    };

    useEffect(() => { cargarEstado(); }, []);

    const handleFichar = async () => {
        const res = await fetch('http://localhost:3000/api/fichajes/fichar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                tipo: estado.proximoTipo, 
                motivoId: estado.proximoTipo === 'pausa_inicio' ? motivoId : null 
            })
        });
        const data = await res.json();
        setEstado(data);
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Panel de Fichaje</h2>
            {estado.proximoTipo === 'pausa_inicio' && (
                <select onChange={(e) => setMotivoId(e.target.value)}>
                    <option value="1">Descanso</option>
                    <option value="2">Comida</option>
                </select>
            )}
            <button onClick={handleFichar} style={{ padding: '20px', fontSize: '1.5rem' }}>
                {estado.proximoTipo.replace('_', ' ').toUpperCase()}
            </button>
            {estado.ultimoFichaje && <p>Último registro: {estado.ultimoFichaje.hora}</p>}
        </div>
    );
}