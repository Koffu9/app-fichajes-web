import { useState, useEffect } from 'react';
import { TrabajadorSelector } from '../../components/TrabajadorSelector';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Ausencias.module.css';
import { AdminNav } from '../../components/AdminNav';

export function Ausencias() {
    const [ausencias, setAusencias] = useState([]);
    const [motivos, setMotivos] = useState([]);
    const [filtro, setFiltro] = useState({ usuarioId: '', anio: '' });
    const [form, setForm] = useState({ id: null, usuarioId: '', motivoId: '', fechaInicio: '', fechaFin: '', observaciones: '' });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        cargarAusencias();
        cargarMotivos();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editando
            ? `http://localhost:3000/api/ausencias/${form.id}`
            : 'http://localhost:3000/api/ausencias';
        const body = { ...form };
        if (editando) delete body.usuarioId;

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
            motivoId: aus.motivo_id,
            fechaInicio: aus.fecha_inicio.split('T')[0],
            fechaFin: aus.fecha_fin.split('T')[0],
            observaciones: aus.observaciones || ''
        });
    };

    const cancelarEdicion = () => {
        setEditando(false);
        setForm({ id: null, usuarioId: '', motivoId: '', fechaInicio: '', fechaFin: '', observaciones: '' });
    };

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <>
        <AdminNav />
        <div className={styles.container}>
            <h2 className={styles.titulo}>Gestión de Ausencias</h2>

            <div className={styles.filtrosWrap}>
                <div className={styles.filtroGrupo}>
                    <span className={styles.filtroLabel}>Trabajador:</span>
                    <TrabajadorSelector value={filtro.usuarioId} onSelect={handleFiltroUsuario} />
                </div>
                {filtro.usuarioId && (
                    <div className={styles.filtroGrupo}>
                        <span className={styles.filtroLabel}>Año:</span>
                        <input
                            type="number"
                            placeholder="ej: 2026"
                            value={filtro.anio}
                            onChange={handleFiltroAnio}
                            className={styles.inputAnio}
                        />
                    </div>
                )}
                <button onClick={limpiarFiltros} className={styles.btnLimpiar}>Limpiar</button>
            </div>
                
<button
    onClick={() => setMostrarFormulario(!mostrarFormulario)}
    className={styles.btnNuevaAusencia}
>
    {mostrarFormulario ? '✕ Cerrar formulario' : '➕ Registrar Nueva Ausencia'}
</button>

{mostrarFormulario && (
    <div className={`${styles.formWrap} ${editando ? styles.formWrapEditando : ''}`}>
        <h3 className={styles.formTitulo}>{editando ? 'Editar Ausencia' : 'Registrar Nueva Ausencia'}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
            {!editando && (
                <div className={styles.formGrupo}>
                    <span className={styles.formLabel}>Trabajador:</span>
                    <TrabajadorSelector value={form.usuarioId} onSelect={(id) => setForm({...form, usuarioId: id})} />
                </div>
            )}
            <div className={styles.formGrupo}>
                <span className={styles.formLabel}>Motivo:</span>
                <select required value={form.motivoId} onChange={e => setForm({...form, motivoId: e.target.value})} className={styles.selectForm}>
                    <option value="">-- Seleccionar --</option>
                    {motivos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
            </div>
            <div className={styles.formGrupo}>
                <span className={styles.formLabel}>Fecha Inicio:</span>
                <DatePicker
                    selected={form.fechaInicio ? new Date(form.fechaInicio) : null}
                    onChange={date => setForm({...form, fechaInicio: date ? formatDate(date) : ''})}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Seleccionar fecha"
                    className={styles.inputForm}
                />
            </div>
            <div className={styles.formGrupo}>
                <span className={styles.formLabel}>Fecha Fin:</span>
                <DatePicker
                    selected={form.fechaFin ? new Date(form.fechaFin) : null}
                    onChange={date => setForm({...form, fechaFin: date ? formatDate(date) : ''})}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Seleccionar fecha"
                    className={styles.inputForm}
                />
            </div>
            <div className={styles.formGrupo}>
                <span className={styles.formLabel}>Observaciones:</span>
                <input
                    type="text"
                    value={form.observaciones}
                    onChange={e => setForm({...form, observaciones: e.target.value})}
                    placeholder="Opcional..."
                    className={styles.inputObservaciones}
                />
            </div>
            <button type="submit" className={styles.btnGuardar}>
                {editando ? 'ACTUALIZAR' : 'GUARDAR'}
            </button>
            {editando && <button type="button" onClick={cancelarEdicion} className={styles.btnCancelar}>Cancelar</button>}
        </form>
    </div>
)}

            <div className={styles.tablaWrap}>
                <table className={styles.tabla}>
                    <thead className={styles.tablaHeader}>
                        <tr>
                            <th>Trabajador</th>
                            <th>Motivo</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ausencias.length > 0 ? ausencias.map(aus => (
                            <tr key={aus.id} className={styles.tablaFila}>
                                <td>{aus.nombre} {aus.apellidos}</td>
                                <td>{aus.motivo}</td>
                                <td>{new Date(aus.fecha_inicio).toLocaleDateString()}</td>
                                <td>{new Date(aus.fecha_fin).toLocaleDateString()}</td>
                                <td>{aus.observaciones || '-'}</td>
                                <td><button onClick={() => prepararEdicion(aus)} className={styles.btnEditar}>Editar</button></td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className={styles.sinDatos}>No hay ausencias registradas.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}