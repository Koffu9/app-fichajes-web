import { useState, useEffect } from 'react';
import { TrabajadorSelector } from '../../components/TrabajadorSelector';

export function Ausencias() {
    const [ausencias, setAusencias] = useState([]);
    const [motivos, setMotivos] = useState([]);
    const [filtro, setFiltro] = useState({ usuarioId: '', anio: '' });
    
    const [form, setForm] = useState({ id: null, usuarioId: '', motivoId: '', fechaInicio: '', fechaFin: '', observaciones: '' });
    const [editando, setEditando] = useState(false);

    // 1. Cargar datos iniciales
    useEffect(() => {
        cargarAusencias();
        cargarMotivos();
    }, []);

    // 2. Cargar ausencias (con o sin filtros)
    const cargarAusencias = async (uId = filtro.usuarioId, anio = filtro.anio) => {
        try {
            const params = new URLSearchParams();
            if (uId) params.append('usuarioId', uId);
            if (anio) params.append('anio', anio);

            const res = await fetch(`http://localhost:3000/api/ausencias?${params.toString()}`, { credentials: 'include' });
            const data = await res.json();
            setAusencias(Array.isArray(data.ausencias) ? data.ausencias : []);
        } catch (error) {
            console.error("Error al cargar ausencias:", error);
        }
    };

    const cargarMotivos = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/ausencias/motivos', { credentials: 'include' });
            const data = await res.json();
            setMotivos(data.motivos || []);
        } catch (error) {
            console.error("Error al cargar motivos:", error);
        }
    };

    // 3. Manejo de Filtros
    const handleFiltroUsuario = (id) => {
        const nuevoFiltro = { usuarioId: id, anio: id ? filtro.anio : '' };
        setFiltro(nuevoFiltro);
        cargarAusencias(id, nuevoFiltro.anio);
    };

    const handleFiltroAnio = (e) => {
        const anio = e.target.value;
        setFiltro({ ...filtro, anio });
        cargarAusencias(filtro.usuarioId, anio);
    };

    const limpiarFiltros = () => {
        setFiltro({ usuarioId: '', anio: '' });
        cargarAusencias('', '');
    };

    // 4. Formulario: Alta y Edición
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editando 
            ? `http://localhost:3000/api/ausencias/${form.id}` 
            : 'http://localhost:3000/api/ausencias';
        
        const body = { ...form };
        if (editando) delete body.usuarioId; // Según tu instrucción: sin usuarioId en PUT

        await fetch(url, {
            method: editando ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        cancelarEdicion();
        cargarAusencias();
    };

    const prepararEdicion = (aus) => {
        setEditando(true);
        setForm({
            id: aus.id,
            usuarioId: aus.usuarioId,
            motivoId: aus.motivoId,
            fechaInicio: aus.fecha_inicio.split('T')[0],
            fechaFin: aus.fecha_fin.split('T')[0],
            observaciones: aus.observaciones || ''
        });
    };

    const cancelarEdicion = () => {
        setEditando(false);
        setForm({ id: null, usuarioId: '', motivoId: '', fechaInicio: '', fechaFin: '', observaciones: '' });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Ausencias</h2>

            {/* SECCIÓN FILTROS */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
                <TrabajadorSelector value={filtro.usuarioId} onSelect={handleFiltroUsuario} />
                
                {filtro.usuarioId && (
                    <input 
                        type="number" 
                        placeholder="Año (ej: 2026)" 
                        value={filtro.anio} 
                        onChange={handleFiltroAnio}
                        style={{ padding: '5px', width: '100px' }}
                    />
                )}
                
                <button onClick={limpiarFiltros} style={{ padding: '6px 12px', cursor: 'pointer' }}>Limpiar</button>
            </div>

            {/* FORMULARIO ALTA/EDICIÓN */}
            <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
                <h3>{editando ? 'Editar Ausencia' : 'Registrar Nueva Ausencia'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
                    {!editando && (
                        <div>
                            <small>Trabajador:</small><br/>
                            <TrabajadorSelector value={form.usuarioId} onSelect={(id) => setForm({...form, usuarioId: id})} />
                        </div>
                    )}
                    <div>
                        <small>Motivo:</small><br/>
                        <select required value={form.motivoId} onChange={e => setForm({...form, motivoId: e.target.value})} style={{ padding: '5px' }}>
                            <option value="">-- Seleccionar --</option>
                            {motivos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <small>Fecha Inicio:</small><br/>
                        <input type="date" required value={form.fechaInicio} onChange={e => setForm({...form, fechaInicio: e.target.value})} />
                    </div>
                    <div>
                        <small>Fecha Fin:</small><br/>
                        <input type="date" required value={form.fechaFin} onChange={e => setForm({...form, fechaFin: e.target.value})} />
                    </div>
                    <div>
                        <small>Observaciones:</small><br/>
                        <input type="text" value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} placeholder="Opcional..." />
                    </div>
                    <button type="submit" style={{ padding: '8px 20px', background: '#264653', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {editando ? 'ACTUALIZAR' : 'GUARDAR'}
                    </button>
                    {editando && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
                </form>
            </div>

            {/* TABLA DE RESULTADOS */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#264653', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Trabajador</th>
                        <th style={{ padding: '10px' }}>Motivo</th>
                        <th style={{ padding: '10px' }}>Fecha Inicio</th>
                        <th style={{ padding: '10px' }}>Fecha Fin</th>
                        <th style={{ padding: '10px' }}>Observaciones</th>
                        <th style={{ padding: '10px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ausencias.length > 0 ? ausencias.map(aus => (
                        <tr key={aus.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{aus.nombre} {aus.apellidos}</td>
                            <td style={{ padding: '10px' }}>{aus.motivo}</td>
                            <td style={{ padding: '10px' }}>{new Date(aus.fecha_inicio).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>{new Date(aus.fecha_fin).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>{aus.observaciones || '-'}</td>
                            <td style={{ padding: '10px' }}>
                                <button onClick={() => prepararEdicion(aus)}>Editar</button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No hay ausencias registradas.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}