import { useState, useEffect } from 'react';

export function Fichajes() {
    const [logs, setLogs] = useState([]);
    const [filtro, setFiltro] = useState({ fechaInicio: '', fechaFin: '', userId: '' });
    
    // Estado para el formulario (Sirve para Alta y Modificación)
    const [form, setForm] = useState({ id: null, usuarioId: '', tipo: 'entrada', fecha: '', hora: '' });
    const [editando, setEditando] = useState(false);

    // 1. Ver todos los fichajes con filtros
    const buscar = async () => {
        try {
            const params = new URLSearchParams();
            if (filtro.userId) params.append('userId', filtro.userId);
            if (filtro.fechaInicio) params.append('fechaInicio', filtro.fechaInicio);
            if (filtro.fechaFin) params.append('fechaFin', filtro.fechaFin);

            const res = await fetch(`http://localhost:3000/api/fichajes/todos?${params.toString()}`, { 
                credentials: 'include' 
            });

            if (!res.ok) throw new Error('Error en el servidor');
            const data = await res.json();
            setLogs(Array.isArray(data.fichajes) ? data.fichajes : []);
        } catch (error) {
            console.error("Error al buscar:", error);
            setLogs([]);
        }
    };

    // Cargar datos al entrar
    useEffect(() => { buscar(); }, []);

    // 2. Formulario: Alta y Modificación
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combinar fecha y hora en un solo campo fechaHora
        const fechaHora = `${form.fecha}T${form.hora}:00`;
        
        const url = editando 
            ? `http://localhost:3000/api/fichajes/modificar/${form.id}` 
            : 'http://localhost:3000/api/fichajes/alta';
        
        const method = editando ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ usuarioId: form.usuarioId, tipo: form.tipo, fechaHora })
        });

        cancelarEdicion();
        buscar(); // Recargar tabla automáticamente
    };

    const prepararEdicion = (log) => {
        setEditando(true);
        const dt = new Date(log.fecha_hora);
        setForm({
            id: log.id,
            usuarioId: log.usuario_id,
            tipo: log.tipo,
            fecha: dt.toISOString().split('T')[0],
            hora: dt.toTimeString().slice(0, 5)
        });
    };

    const cancelarEdicion = () => {
        setEditando(false);
        setForm({ id: null, usuarioId: '', tipo: 'entrada', fecha: '', hora: '' });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Fichajes (Administración)</h2>

            {/* Filtros */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', background: '#f8f9fa', padding: '15px' }}>
                <input type="text" placeholder="ID Trabajador" value={filtro.userId} onChange={e => setFiltro({...filtro, userId: e.target.value})} />
                <input type="date" value={filtro.fechaInicio} onChange={e => setFiltro({...filtro, fechaInicio: e.target.value})} />
                <input type="date" value={filtro.fechaFin} onChange={e => setFiltro({...filtro, fechaFin: e.target.value})} />
                <button onClick={buscar}>Filtrar / Actualizar</button>
            </div>

            <hr />

            {/* Formulario Alta/Modificar */}
            <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd' }}>
                <h3>{editando ? 'Editar Registro' : 'Nuevo Fichaje Manual'}</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="ID Trabajador" required value={form.usuarioId} onChange={e => setForm({...form, usuarioId: e.target.value})} />
                    <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                        <option value="pausa_inicio">Inicio Pausa</option>
                        <option value="pausa_fin">Fin Pausa</option>
                    </select>
                    <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                    <input type="time" required value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} />
                    
                    <button onClick={handleSubmit} style={{ backgroundColor: editando ? '#ffa500' : '#007bff', color: 'white' }}>
                        {editando ? 'Guardar Cambios' : 'Dar de Alta'}
                    </button>
                    {editando && <button onClick={cancelarEdicion}>Cancelar</button>}
                </div>
            </div>

            {/* Tabla */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee', textAlign: 'left' }}>
                        <th>ID</th>
                        <th>Trabajador</th>
                        <th>Tipo</th>
                        <th>Fecha y Hora</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{log.id}</td>
                            <td>{log.usuario_id}</td>
                            <td>{log.tipo.toUpperCase()}</td>
                            <td>{new Date(log.fecha_hora).toLocaleString()}</td>
                            <td>
                                <button onClick={() => prepararEdicion(log)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}