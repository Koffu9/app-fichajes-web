import { useState, useEffect } from 'react';

export function Fichajes() {
    const [logs, setLogs] = useState([]);
    const [filtro, setFiltro] = useState({ inicio: '', fin: '', trabajador: '' });
    
    // Estado para el formulario (Sirve para Alta y Modificación)
    const [form, setForm] = useState({ id: null, trabajadorId: '', tipo: 'entrada', fecha: '', hora: '' });
    const [editando, setEditando] = useState(false);

    // 1. Ver todos los fichajes con filtros (Corregida)
    const buscar = async () => {
        try {
            const params = new URLSearchParams();
            if (filtro.userid) params.append('trabajador', filtro.userid);
            if (filtro.inicio) params.append('inicio', filtro.inicio);
            if (filtro.fin) params.append('fin', filtro.fin);

            const res = await fetch(`http://localhost:3000/api/fichajes/todos?${params.toString()}`, { 
                credentials: 'include' 
            });

            if (!res.ok) throw new Error('Error en el servidor');
            const data = await res.json();
            setLogs(Array.isArray(data.Fichajes) ? data : []);
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
        
        const url = editando 
            ? `http://localhost:3000/api/fichajes/modificar/${form.id}` 
            : 'http://localhost:3000/api/fichajes/alta';
        
        const method = editando ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(form)
        });

        cancelarEdicion();
        buscar(); // Recargar tabla automáticamente
    };

    const prepararEdicion = (log) => {
        setEditando(true);
        setForm({
            id: log.id,
            trabajadorId: log.trabajadorId || '',
            tipo: log.tipo,
            fecha: log.fecha ? log.fecha.split('T')[0] : '',
            hora: log.hora || ''
        });
    };

    const cancelarEdicion = () => {
        setEditando(false);
        setForm({ id: null, trabajadorId: '', tipo: 'entrada', fecha: '', hora: '' });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Fichajes (Administración)</h2>

            {/* Filtros */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', background: '#f8f9fa', padding: '15px' }}>
                <input type="text" placeholder="ID Trabajador" value={filtro.trabajador} onChange={e => setFiltro({...filtro, trabajador: e.target.value})} />
                <input type="date" value={filtro.inicio} onChange={e => setFiltro({...filtro, inicio: e.target.value})} />
                <input type="date" value={filtro.fin} onChange={e => setFiltro({...filtro, fin: e.target.value})} />
                <button onClick={buscar}>Filtrar / Actualizar</button>
            </div>

            <hr />

            {/* Formulario Alta/Modificar */}
            <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd' }}>
                <h3>{editando ? 'Editar Registro' : 'Nuevo Fichaje Manual'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="ID Trabajador" required value={form.trabajadorId} onChange={e => setForm({...form, trabajadorId: e.target.value})} />
                    <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                        <option value="pausa_inicio">Inicio Pausa</option>
                        <option value="pausa_fin">Fin Pausa</option>
                    </select>
                    <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                    <input type="time" required value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} />
                    
                    <button type="submit" style={{ backgroundColor: editando ? '#ffa500' : '#007bff', color: 'white' }}>
                        {editando ? 'Guardar Cambios' : 'Dar de Alta'}
                    </button>
                    {editando && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
                </form>
            </div>

            {/* Tabla */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee', textAlign: 'left' }}>
                        <th>ID</th>
                        <th>Trabajador</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{log.id}</td>
                            <td>{log.trabajadorId}</td>
                            <td>{log.tipo.toUpperCase()}</td>
                            <td>{log.fecha ? new Date(log.fecha).toLocaleDateString() : '-'}</td>
                            <td>{log.hora}</td>
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