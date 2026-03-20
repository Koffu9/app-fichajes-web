import { useState, useEffect } from 'react';

export function Fichar() {
    const [estado, setEstado] = useState({ proximoTipoFichar: 'entrada', pausaVisible: false, proximoTipoPausa: null });
    const [motivos, setMotivos] = useState([]);
    const [motivoId, setMotivoId] = useState('');
    const [misFichajes, setMisFichajes] = useState([]);
    const [filtros, setFiltros] = useState({ desde: '', hasta: '' });
    // --- NUEVO: Reloj en tiempo real ---
    const [ahora, setAhora] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setAhora(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const inicializar = async () => {
        try {
            const resEstado = await fetch('http://localhost:3000/api/fichajes/estado', { credentials: 'include' });
            const dataEstado = await resEstado.json();
            setEstado(dataEstado);

            const resMotivos = await fetch('http://localhost:3000/api/fichajes/motivos-pausa', { credentials: 'include' });
            const dataMotivos = await resMotivos.json();
            setMotivos(dataMotivos.motivos || []);
            if (dataMotivos.motivos?.length > 0) setMotivoId(dataMotivos.motivos[0].id);

            obtenerHistorial();
        } catch (error) {
            console.error("Error al inicializar:", error);
        }
    };

    useEffect(() => { inicializar(); }, []);

    const refrescarTodo = async () => {
        const res = await fetch('http://localhost:3000/api/fichajes/estado', { credentials: 'include' });
        const data = await res.json();
        setEstado(data);
        obtenerHistorial();
    };

    const handleFichar = async () => {
        await fetch('http://localhost:3000/api/fichajes/fichar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        refrescarTodo();
    };

    const handlePausa = async () => {
        await fetch('http://localhost:3000/api/fichajes/descanso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ motivoId })
        });
        refrescarTodo();
    };

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

    // --- Helpers para estilos dinámicos ---
    const getBtnColor = () => {
        if (estado.proximoTipoFichar === 'entrada') return '#28a745'; // Verde
        if (estado.proximoTipoFichar === 'salida') return '#dc3545';  // Rojo
        return '#6c757d'; // Gris si está deshabilitado
    };

    return (
        <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#1a3a4a' }}>Panel de Fichaje</h2>
            
            {/* Reloj Digital */}
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px', color: '#264653' }}>
                {ahora.toLocaleTimeString()}
            </div>
            <p style={{ color: '#666', marginBottom: '30px' }}>{ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <div style={{ maxWidth: '600px', margin: '0 auto 40px', border: '1px solid #ddd', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                
                {estado.pausaVisible && estado.proximoTipoPausa === 'pausa_inicio' && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Motivo de la pausa:</label>
                        <select 
                            value={motivoId} 
                            onChange={(e) => setMotivoId(e.target.value)}
                            style={{ padding: '10px', borderRadius: '5px', width: '200px' }}
                        >
                            {motivos.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleFichar}
                        disabled={estado.proximoTipoFichar === null}
                        style={{ 
                            padding: '15px 40px', 
                            fontSize: '1.2rem', 
                            cursor: estado.proximoTipoFichar ? 'pointer' : 'not-allowed',
                            backgroundColor: getBtnColor(),
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            transition: 'transform 0.1s'
                        }}
                    >
                        {estado.proximoTipoFichar ? estado.proximoTipoFichar.toUpperCase() : 'ESTÁS EN PAUSA'}
                    </button>

                    {estado.pausaVisible && (
                        <button
                            onClick={handlePausa}
                            style={{ 
                                padding: '15px 40px', 
                                fontSize: '1.2rem', 
                                backgroundColor: '#ffc107',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {estado.proximoTipoPausa === 'pausa_fin' ? 'TERMINAR DESCANSO' : 'INICIAR DESCANSO'}
                        </button>
                    )}
                </div>

                {estado.ultimoFichaje && (
                    <div style={{ marginTop: '25px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <p style={{ margin: 0, color: '#555' }}>
                            Último movimiento: <strong style={{ color: '#264653' }}>{estado.ultimoFichaje.tipo.toUpperCase()}</strong> 
                            <span> a las {new Date(estado.ultimoFichaje.fecha_hora).toLocaleTimeString()}</span>
                        </p>
                    </div>
                )}
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '40px 0' }} />

            <h3 style={{ color: '#1a3a4a' }}>Mi Historial de Actividad</h3>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                <input type="date" style={{ padding: '8px' }} onChange={e => setFiltros({...filtros, desde: e.target.value})} />
                <input type="date" style={{ padding: '8px' }} onChange={e => setFiltros({...filtros, hasta: e.target.value})} />
                <button onClick={obtenerHistorial} style={{ padding: '8px 20px', cursor: 'pointer', backgroundColor: '#264653', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Filtrar
                </button>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 3px rgba(0,0,0,0.05)' }}>
                    <thead>
                        <tr style={{ background: '#264653', color: 'white' }}>
                            <th style={{ padding: '12px' }}>Fecha y Hora</th>
                            <th style={{ padding: '12px' }}>Movimiento</th>
                            <th style={{ padding: '12px' }}>Detalle / Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {misFichajes.map((f, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee', backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                <td style={{ padding: '12px' }}>{new Date(f.fecha_hora).toLocaleString()}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{f.tipo.toUpperCase()}</td>
                                <td style={{ padding: '12px', color: '#777' }}>{f.motivo_nombre || f.motivo_id || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}