import { useState, useEffect } from 'react';
import { TrabajadorSelector } from '../../components/TrabajadorSelector'; // Importamos tu nuevo componente

export function Fichajes() {
    const [logs, setLogs] = useState([]);
    const [filtro, setFiltro] = useState({ inicio: '', fin: '', trabajador: '' });
    
    const [form, setForm] = useState({ id: null, trabajadorId: '', tipo: 'entrada', fecha: '', hora: '' });
    const [editando, setEditando] = useState(false);

    // 1. Ver todos los fichajes con filtros
    const buscar = async () => {
        try {
            const params = new URLSearchParams();
            // Usamos filtro.trabajador que viene del selector
            if (filtro.trabajador) params.append('userId', filtro.trabajador);
            if (filtro.inicio) params.append('fechaInicio', filtro.inicio);
            if (filtro.fin) params.append('fechaFin', filtro.fin);

            const res = await fetch(`http://localhost:3000/api/fichajes/todos?${params.toString()}`, { 
                credentials: 'include' 
            });

            if (!res.ok) throw new Error('Error en el servidor');
            const data = await res.json();
            
            // Ajuste para manejar la respuesta del backend (data.Fichajes o data)
            const listaFichajes = Array.isArray(data.fichajes) ? data.fichajes : [];
            setLogs(listaFichajes);
        } catch (error) {
            console.error("Error al buscar:", error);
            setLogs([]);
        }
    };

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
        buscar(); 
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

    // --- NUEVA FUNCIÓN PARA LIMPIAR FILTROS ---
    const limpiarFiltros = () => {
        setFiltro({ inicio: '', fin: '', trabajador: '' });
        // Si tu selector interno no se limpia solo, buscar() recargará todo.
        setTimeout(() => buscar(), 10);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Fichajes (Administración)</h2>

            {/* Filtros con Selector */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', background: '#f8f9fa', padding: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <small>Trabajador:</small>
                    {/* Añadido value para que el selector sea controlado */}
                    <TrabajadorSelector 
                        value={filtro.trabajador} 
                        onSelect={(id) => setFiltro({...filtro, trabajador: id})} 
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <small>Desde:</small>
                    <input type="date" value={filtro.inicio} onChange={e => setFiltro({...filtro, inicio: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <small>Hasta:</small>
                    <input type="date" value={filtro.fin} onChange={e => setFiltro({...filtro, fin: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={buscar} style={{ marginTop: '15px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#264653', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Filtrar / Actualizar
                    </button>
                    <button onClick={limpiarFiltros} style={{ marginTop: '15px', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
                        Limpiar
                    </button>
                </div>
            </div>

            <hr />

            {/* Formulario Alta/Modificar con Selector */}
            <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', backgroundColor: editando ? '#fff9f0' : 'transparent', borderRadius: '8px' }}>
                <h3>{editando ? '⚠️ Editando Registro' : '➕ Nuevo Fichaje Manual'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <small>Seleccionar Trabajador:</small>
                        {/* Añadido value para sincronizar con prepararEdicion */}
                        <TrabajadorSelector 
                            value={form.trabajadorId} 
                            onSelect={(id) => setForm({...form, trabajadorId: id})} 
                        />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <small>Acción:</small>
                        <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} style={{ padding: '5px', height: '30px' }}>
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                            <option value="pausa_inicio">Inicio Pausa</option>
                            <option value="pausa_fin">Fin Pausa</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <small>Fecha:</small>
                        <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} style={{ height: '25px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <small>Hora:</small>
                        <input type="time" required value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} style={{ height: '25px' }} />
                    </div>
                    
                    <button type="submit" style={{ backgroundColor: editando ? '#ffa500' : '#007bff', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {editando ? 'GUARDAR CAMBIOS' : 'DAR DE ALTA'}
                    </button>
                    {editando && <button type="button" onClick={cancelarEdicion} style={{ padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>}
                </form>
            </div>

            {/* Tabla */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ background: '#264653', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Nombre</th>
                            <th style={{ padding: '12px' }}>Tipo</th>
                            <th style={{ padding: '12px' }}>Fecha</th>
                            <th style={{ padding: '12px' }}>Hora</th>
                            <th style={{ padding: '12px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? logs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #eee', backgroundColor: editando && form.id === log.id ? '#fff9f0' : 'white' }}>
                                <td style={{ padding: '10px' }}>{log.id}</td>
                                <td style={{ padding: '10px' }}>{log.nombre} {log.apellidos}</td>  
                                <td style={{ padding: '10px' }}>
                                    <span style={{ 
                                        fontWeight: 'bold', 
                                        color: log.tipo === 'entrada' ? '#28a745' : log.tipo === 'salida' ? '#dc3545' : '#f39c12',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: log.tipo === 'entrada' ? '#e8f5e9' : log.tipo === 'salida' ? '#ffebee' : '#fef9e7'
                                    }}>
                                        {log.tipo.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>{new Date(log.fecha_hora).toLocaleDateString()}</td> 
                                <td style={{ padding: '10px' }}>{new Date(log.fecha_hora).toLocaleTimeString()}</td>
                                <td style={{ padding: '10px' }}>
                                    <button 
                                        onClick={() => prepararEdicion(log)} 
                                        style={{ cursor: 'pointer', padding: '5px 12px', borderRadius: '4px', border: '1px solid #007bff', color: '#007bff', background: 'white' }}
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No hay registros que coincidan con la búsqueda.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}