import { useState, useEffect } from 'react';
import { TrabajadorSelector } from '../../components/TrabajadorSelector';
import styles from './Fichajes.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdminNav } from '../../components/AdminNav';


export function Fichajes() {
    const [logs, setLogs] = useState([]);
    const [filtro, setFiltro] = useState({ inicio: '', fin: '', trabajador: '' });
    const [form, setForm] = useState({ id: null, trabajadorId: '', tipo: 'entrada', fecha: '', hora: '' });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const buscar = async () => {
        try {
            const params = new URLSearchParams();
            if (filtro.trabajador) params.append('userId', filtro.trabajador);
            if (filtro.inicio) params.append('fechaInicio', filtro.inicio);
            if (filtro.fin) params.append('fechaFin', filtro.fin);

            const res = await fetch(`http://localhost:3000/api/fichajes/todos?${params.toString()}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Error en el servidor');
            const data = await res.json();
            setLogs(Array.isArray(data.fichajes) ? data.fichajes : []);
        } catch (error) {
            console.error("Error al buscar:", error);
            setLogs([]);
        }
    };

    useEffect(() => { buscar(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editando
            ? `http://localhost:3000/api/fichajes/modificar/${form.id}`
            : 'http://localhost:3000/api/fichajes/alta';
        const method = editando ? 'PUT' : 'POST';

        const fechaHora = `${form.fecha}T${form.hora}:00`;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                usuarioId: form.trabajadorId,
                tipo: form.tipo,
                fechaHora,
                motivoId: null,
                observaciones: null
            })
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
            fecha: log.fecha_hora ? new Date(log.fecha_hora).toISOString().split('T')[0] : '',
            hora: log.fecha_hora ? new Date(log.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''
        });
    };

    const cancelarEdicion = () => {
        setEditando(false);
        setForm({ id: null, trabajadorId: '', tipo: 'entrada', fecha: '', hora: '' });
    };

    const limpiarFiltros = () => {
        setFiltro({ inicio: '', fin: '', trabajador: '' });
        setTimeout(() => buscar(), 10);
    };

    const getBadgeClass = (tipo) => {
        if (tipo === 'entrada') return `${styles.badge} ${styles.badgeEntrada}`;
        if (tipo === 'salida') return `${styles.badge} ${styles.badgeSalida}`;
        return `${styles.badge} ${styles.badgePausa}`;
    };

    return (
        <>
        <AdminNav />
            <div className={styles.container}>
                <h2 className={styles.titulo}>Gestión de Fichajes (Administración)</h2>

                <div className={styles.filtrosWrap}>
                    <div className={styles.filtroGrupo}>
                        <span className={styles.filtroLabel}>Trabajador:</span>
                        <TrabajadorSelector value={filtro.trabajador} onSelect={(id) => setFiltro({ ...filtro, trabajador: id })} />
                    </div>
                    <div className={styles.filtroGrupo}>
                        <span className={styles.filtroLabel}>Desde:</span>
                        <DatePicker
                            selected={filtro.inicio ? new Date(filtro.inicio) : null}
                            onChange={date => {
                                if (date) {
                                    const yyyy = date.getFullYear();
                                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                                    const dd = String(date.getDate()).padStart(2, '0');
                                    setFiltro({ ...filtro, inicio: `${yyyy}-${mm}-${dd}` });
                                } else {
                                    setFiltro({ ...filtro, inicio: '' });
                                }
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Seleccionar fecha inicio"
                            className={styles.inputFecha}
                        />
                    </div>
                    <div className={styles.filtroGrupo}>
                        <span className={styles.filtroLabel}>Hasta:</span>
                        <DatePicker
                            selected={filtro.fin ? new Date(filtro.fin) : null}
                            onChange={date => {
                                if (date) {
                                    const yyyy = date.getFullYear();
                                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                                    const dd = String(date.getDate()).padStart(2, '0');
                                    setFiltro({ ...filtro, fin: `${yyyy}-${mm}-${dd}` });
                                } else {
                                    setFiltro({ ...filtro, fin: '' });
                                }
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Seleccionar fecha fin"
                            className={styles.inputFecha}
                        />
                    </div>
                    <div className={styles.botonesWrap}>
                        <button onClick={buscar} className={styles.btnFiltrar}>Filtrar / Actualizar</button>
                        <button onClick={limpiarFiltros} className={styles.btnLimpiar}>Limpiar</button>
                    </div>
                </div>

                <hr className={styles.separador} />

                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className={styles.btnNuevoFichaje}
                >
                    {mostrarFormulario ? '✕ Cerrar formulario' : '➕ Nuevo Fichaje Manual'}
                </button>

                {mostrarFormulario && (
                    <div className={`${styles.formWrap} ${editando ? styles.formWrapEditando : ''}`}>
                        <h3 className={styles.formTitulo}>{editando ? '⚠️ Editando Registro' : 'Nuevo Fichaje Manual'}</h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrupo}>
                                <span className={styles.formLabel}>Seleccionar Trabajador:</span>
                                <TrabajadorSelector value={form.trabajadorId} onSelect={(id) => setForm({ ...form, trabajadorId: id })} />
                            </div>
                            <div className={styles.formGrupo}>
                                <span className={styles.formLabel}>Acción:</span>
                                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className={styles.selectForm}>
                                    <option value="entrada">Entrada</option>
                                    <option value="salida">Salida</option>
                                    <option value="pausa_inicio">Inicio Pausa</option>
                                    <option value="pausa_fin">Fin Pausa</option>
                                </select>
                            </div>
                            <div className={styles.formGrupo}>
                                <span className={styles.formLabel}>Fecha:</span>
                                <DatePicker
                                    selected={form.fecha ? new Date(form.fecha) : null}
                                    onChange={date => {
                                        if (date) {
                                            const yyyy = date.getFullYear();
                                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                                            const dd = String(date.getDate()).padStart(2, '0');
                                            setForm({ ...form, fecha: `${yyyy}-${mm}-${dd}` });
                                        } else {
                                            setForm({ ...form, fecha: '' });
                                        }
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Seleccionar fecha"
                                    className={styles.inputForm}
                                />
                            </div>
                            <div className={styles.formGrupo}>
                                <span className={styles.formLabel}>Hora:</span>
                                <input type="time" required value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} className={styles.inputForm} />
                            </div>
                            <button type="submit" className={editando ? styles.btnGuardar : styles.btnAlta}>
                                {editando ? 'GUARDAR CAMBIOS' : 'DAR DE ALTA'}
                            </button>
                            {editando && <button type="button" onClick={cancelarEdicion} className={styles.btnCancelar}>Cancelar</button>}
                        </form>
                    </div>
                )}

                <div className={styles.tablaWrap}>
                    <table className={styles.tabla}>
                        <thead className={styles.tablaHeader}>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log.id} className={`${styles.tablaFila} ${editando && form.id === log.id ? styles.tablaFilaEditando : ''}`}>
                                    <td>{log.id}</td>
                                    <td>{log.nombre} {log.apellidos}</td>
                                    <td><span className={getBadgeClass(log.tipo)}>{log.tipo.toUpperCase()}</span></td>
                                    <td>{new Date(log.fecha_hora).toLocaleDateString()}</td>
                                    <td>{new Date(log.fecha_hora).toLocaleTimeString()}</td>
                                    <td><button onClick={() => prepararEdicion(log)} className={styles.btnEditar}>Editar</button></td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No hay registros que coincidan con la búsqueda.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}