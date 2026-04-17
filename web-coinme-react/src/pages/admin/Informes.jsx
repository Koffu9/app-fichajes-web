import { useState, useEffect } from 'react';
import styles from './Informes.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdminNav } from '../../components/AdminNav';

export function Informes() {
    const [datos, setDatos] = useState([]);
    const [trabajadores, setTrabajadores] = useState([]);
    const [idTrabajador, setIdTrabajador] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/usuarios/trabajadores', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setTrabajadores(data.trabajadores))
            .catch(err => console.error("Error cargando trabajadores", err));
    }, []);

    const generar = async () => {
        let url = '';

        if (idTrabajador) {
            url = `http://localhost:3000/api/informes/trabajador/${idTrabajador}?desde=${fechaDesde}&hasta=${fechaHasta}`;
        } else {
            const fecha = new Date(fechaDesde);
            const mes = fecha.getMonth() + 1;
            const anio = fecha.getFullYear();
            url = `http://localhost:3000/api/informes/mensual?anio=${anio}&mes=${mes}`;
        }

        try {
            const res = await fetch(url, { credentials: 'include' });
            const data = await res.json();
            setDatos(data.informe || []);
        } catch (error) {
            console.error("Error al generar el informe", error);
        }
    };

    return (
        <>
        <AdminNav />
        <div className={styles.container}>
            <h2 className={styles.titulo}>Informes</h2>

            <div className={styles.filtrosWrap}>
                <div className={styles.filtroGrupo}>
                    <span className={styles.filtroLabel}>Trabajador:</span>
                    <select
                        value={idTrabajador}
                        onChange={(e) => setIdTrabajador(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">-- Todos los trabajadores (Mensual) --</option>
                        {trabajadores.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.nombre} {t.apellidos}
                            </option>
                        ))}
                    </select>
                </div>
                {idTrabajador && (
                <div className={styles.filtroGrupo}>
                    <span className={styles.filtroLabel}>Desde:</span>
                    <DatePicker
                        selected={fechaDesde ? new Date(fechaDesde) : null}
                        onChange={date => {
                            if (date) {
                                const yyyy = date.getFullYear();
                                const mm = String(date.getMonth() + 1).padStart(2, '0');
                                const dd = String(date.getDate()).padStart(2, '0');
                                setFechaDesde(`${yyyy}-${mm}-${dd}`);
                            } else {
                                setFechaDesde('');
                            }
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Seleccionar fecha"
                        className={styles.inputFecha}
                    />
                </div>
                )}
                {idTrabajador && (
                    <div className={styles.filtroGrupo}>
                        <span className={styles.filtroLabel}>Hasta:</span>
                        <DatePicker
                            selected={fechaHasta ? new Date(fechaHasta) : null}
                            onChange={date => {
                                if (date) {
                                    const yyyy = date.getFullYear();
                                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                                    const dd = String(date.getDate()).padStart(2, '0');
                                    setFechaHasta(`${yyyy}-${mm}-${dd}`);
                                } else {
                                    setFechaHasta('');
                                }
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Seleccionar fecha"
                            className={styles.inputFecha}
                        />
                    </div>
                )}

                <button onClick={generar} className={styles.btnGenerar}>
                    Generar Informe
                </button>
            </div>

            <div className={styles.resultados}>
                {datos.length > 0 ? (
                    <>
                        <div className={styles.tablaWrap}>
                            <table className={styles.tabla}>
                                <thead className={styles.tablaHeader}>
                                    <tr>
                                        {idTrabajador ? (
                                            <>
                                                <th>Fecha</th>
                                                <th>Entrada</th>
                                                <th>Salida</th>
                                                <th>Horas trabajadas</th>
                                                <th>Horas pausa</th>
                                                <th>Jornada completa</th>
                                            </>
                                        ) : (
                                            <>
                                                <th>Trabajador</th>
                                                <th>Días trabajados</th>
                                                <th>Horas totales</th>
                                                <th>Jornadas completas</th>
                                                <th>Jornadas incompletas</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {datos.map((d, i) => (
                                        <tr key={i} className={styles.tablaFila}>
                                            {idTrabajador ? (
                                                <>
                                                    <td>{new Date(d.fecha).toLocaleDateString()}</td>
                                                    <td>{new Date(d.hora_entrada).toLocaleTimeString()}</td>
                                                    <td>{new Date(d.hora_salida).toLocaleTimeString()}</td>
                                                    <td>{d.horas_trabajadas}h</td>
                                                    <td>{d.horas_pausa}h</td>
                                                    <td>{d.jornada_completa ? '✓' : '✗'}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{d.nombre} {d.apellidos}</td>
                                                    <td>{d.dias_trabajados}</td>
                                                    <td>{d.horas_totales}h</td>
                                                    <td>{d.jornadas_completas}</td>
                                                    <td>{d.jornadas_incompletas}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {idTrabajador && (
                            <p className={styles.totalHoras}>
                                Total horas trabajadas: {datos.reduce((acc, d) => acc + parseFloat(d.horas_trabajadas), 0).toFixed(2)}h
                            </p>
                        )}
                    </>
                ) : (
                    <p className={styles.sinDatos}>No hay datos para mostrar. Selecciona los filtros y pulsa Generar.</p>
                )}
            </div>
        </div>
        </>
    );
}