import { useState, useEffect } from 'react';

export function Fichar() {
    const [estado, setEstado] = useState({ proximoTipoFichar: 'entrada', pausaVisible: false, proximoTipoPausa: null });
    const [motivos, setMotivos] = useState([]);
    const [motivoId, setMotivoId] = useState('');
    const [misFichajes, setMisFichajes] = useState([]);
    const [filtros, setFiltros] = useState({ desde: '', hasta: '' });

    // 1. Cargar estado, motivos e historial al iniciar
    const inicializar = async () => {
        try {
            // Cargar Estado actual
            const resEstado = await fetch('http://localhost:3000/api/fichajes/estado', { credentials: 'include' });
            const dataEstado = await resEstado.json();
            setEstado(dataEstado);

            // Cargar Motivos de pausa
            const resMotivos = await fetch('http://localhost:3000/api/fichajes/motivos-pausa', { credentials: 'include' });
            const dataMotivos = await resMotivos.json();
            setMotivos(dataMotivos.motivos);
            if (dataMotivos.motivos.length > 0) setMotivoId(dataMotivos.motivos[0].id);

            // Cargar historial
            obtenerHistorial();
        } catch (error) {
            console.error("Error al inicializar:", error);
        }
    };

    useEffect(() => { inicializar(); }, []);

    // 2. Función para refrescar datos tras una acción
    const refrescarTodo = async () => {
        const res = await fetch('http://localhost:3000/api/fichajes/estado', { credentials: 'include' });
        const data = await res.json();
        setEstado(data);
        obtenerHistorial();
    };

    // 3. Vincular botón Fichar (Entrada/Salida)
    const handleFichar = async () => {
        await fetch('http://localhost:3000/api/fichajes/fichar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        refrescarTodo();
    };

    // 4. Vincular botón Pausa (con selector de motivo)
    const handlePausa = async () => {
        await fetch('http://localhost:3000/api/fichajes/descanso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ motivoId })
        });
        refrescarTodo();
    };

    // 5. Ver mis fichajes con filtros
    const obtenerHistorial = async () => {
        const params = new URLSearchParams();
        if (filtros.desde) params.append('fechaInicio', filtros.desde);
        if (filtros.hasta) params.append('fechaFin', filtros.hasta);

        const res = await fetch(`http://localhost:3000/api/fichajes/misFichajes?${params.toString()}`, {
            credentials: 'include'
        });
        const data = await res.json();
        setMisFichajes(Array.isArray(data.fichajes) ? data.fichajes : []);
    };

    return (
        <div style={{ padding: '30px', textAlign: 'center' }}>
            <h2>Panel de Fichaje</h2>

            <div style={{ margin: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
                {/* Selector de motivo: Solo aparece si estás dentro de la jornada y NO estás en pausa */}
                {estado.pausaVisible && estado.proximoTipoPausa === 'pausa_inicio' && (
                    <div style={{ marginBottom: '15px' }}>
                        <label>Motivo de pausa: </label>
                        <select value={motivoId} onChange={(e) => setMotivoId(e.target.value)}>
                            {motivos.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    {/* Botón Principal: Entrada / Salida — desactivado si estás en pausa */}
                    <button
                        onClick={handleFichar}
                        disabled={estado.proximoTipoFichar === null}
                        style={{ padding: '15px 30px', fontSize: '1.1rem' }}
                    >
                        {estado.proximoTipoFichar ? estado.proximoTipoFichar.toUpperCase() : 'EN PAUSA'}
                    </button>

                    {/* Botón Pausa: Solo visible si pausaVisible es true */}
                    {estado.pausaVisible && (
                        <button
                            onClick={handlePausa}
                            style={{ padding: '15px 30px', fontSize: '1.1rem', backgroundColor: '#ffc107' }}
                        >
                            {estado.proximoTipoPausa === 'pausa_fin' ? 'FIN PAUSA' : 'INICIAR PAUSA'}
                        </button>
                    )}
                </div>

                {estado.ultimoFichaje && (
                    <p style={{ marginTop: '20px', color: '#555' }}>
                        Último registro: <strong>{estado.ultimoFichaje.tipo}</strong> a las {new Date(estado.ultimoFichaje.fecha_hora).toLocaleTimeString()}
                    </p>
                )}
            </div>

            <hr />

            <h3>Mi Historial</h3>
            <div style={{ marginBottom: '15px' }}>
                <input type="date" onChange={e => setFiltros({...filtros, desde: e.target.value})} />
                <input type="date" onChange={e => setFiltros({...filtros, hasta: e.target.value})} />
                <button onClick={obtenerHistorial}>Filtrar</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4' }}>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    {misFichajes.map((f, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{new Date(f.fecha_hora).toLocaleString()}</td>
                            <td>{f.tipo.toUpperCase()}</td>
                            <td>{f.motivo_id || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}