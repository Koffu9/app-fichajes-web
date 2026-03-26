import { useState, useEffect } from 'react';

export function Informes() {
    const [datos, setDatos] = useState([]);
    // --- NUEVOS ESTADOS ---
    const [trabajadores, setTrabajadores] = useState([]);
    const [idTrabajador, setIdTrabajador] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    // --- CARGAR LISTA DE TRABAJADORES AL INICIAR ---
    useEffect(() => {
        fetch('http://localhost:3000/api/usuarios/trabajadores', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setTrabajadores(data.trabajadores))
            .catch(err => console.error("Error cargando trabajadores", err));
    }, []);

    const generar = async () => {
        let url = '';

        if (idTrabajador) {
            // 1. SI HAY TRABAJADOR: Informe específico por rango de fechas
            url = `http://localhost:3000/api/informes/trabajador/${idTrabajador}?desde=${fechaDesde}&hasta=${fechaHasta}`;
        } else {
            // 2. SI NO HAY TRABAJADOR: Informe mensual general (sacamos mes/año de fechaDesde)
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
        <div style={{ padding: '20px', fontFamily: 'Open Sans' }}>
            <h2>Informes</h2>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                {/* Desplegable de trabajadores */}
                <select
                    value={idTrabajador}
                    onChange={(e) => setIdTrabajador(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px' }}
                >
                    <option value="">-- Todos los trabajadores (Mensual) --</option>
                    {trabajadores.map(t => (
                        <option key={t.id} value={t.id}>
                            {t.nombre} {t.apellidos}
                        </option>
                    ))}
                </select>

                {/* Filtros de fecha */}
                <label>Desde:
                    <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
                </label>

                {idTrabajador && (
                    <label>Hasta:
                        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
                    </label>
                )}

                <button
                    onClick={generar}
                    style={{ backgroundColor: '#264653', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Generar Informe
                </button>
            </div>

            {/* Tabla de resultados (puedes mapear 'datos' aquí) */}
            <div className="resultados">
                {datos.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#264653', color: 'white', textAlign: 'left' }}>
                                {idTrabajador ? (
                                    <>
                                        <th style={{ padding: '10px' }}>Fecha</th>
                                        <th style={{ padding: '10px' }}>Entrada</th>
                                        <th style={{ padding: '10px' }}>Salida</th>
                                        <th style={{ padding: '10px' }}>Horas trabajadas</th>
                                        <th style={{ padding: '10px' }}>Horas pausa</th>
                                        <th style={{ padding: '10px' }}>Jornada completa</th>
                                    </>
                                ) : (
                                    <>
                                        <th style={{ padding: '10px' }}>Trabajador</th>
                                        <th style={{ padding: '10px' }}>Días trabajados</th>
                                        <th style={{ padding: '10px' }}>Horas totales</th>
                                        <th style={{ padding: '10px' }}>Jornadas completas</th>
                                        <th style={{ padding: '10px' }}>Jornadas incompletas</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((d, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    {idTrabajador ? (
                                        <>
                                            <td style={{ padding: '10px' }}>{new Date(d.fecha).toLocaleDateString()}</td>
                                            <td style={{ padding: '10px' }}>{new Date(d.hora_entrada).toLocaleTimeString()}</td>
                                            <td style={{ padding: '10px' }}>{new Date(d.hora_salida).toLocaleTimeString()}</td>
                                            <td style={{ padding: '10px' }}>{d.horas_trabajadas}h</td>
                                            <td style={{ padding: '10px' }}>{d.horas_pausa}h</td>
                                            <td style={{ padding: '10px' }}>{d.jornada_completa ? '✓' : '✗'}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{ padding: '10px' }}>{d.nombre} {d.apellidos}</td>
                                            <td style={{ padding: '10px' }}>{d.dias_trabajados}</td>
                                            <td style={{ padding: '10px' }}>{d.horas_totales}h</td>
                                            <td style={{ padding: '10px' }}>{d.jornadas_completas}</td>
                                            <td style={{ padding: '10px' }}>{d.jornadas_incompletas}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay datos para mostrar. Selecciona los filtros y pulsa Generar.</p>
                )}
                {idTrabajador && (
    <p style={{ fontWeight: 'bold', marginTop: '15px', textAlign: 'right', fontSize: '1.1rem' }}>
        Total horas trabajadas: {datos.reduce((acc, d) => acc + parseFloat(d.horas_trabajadas), 0).toFixed(2)}h
    </p>
)}
            </div>
        </div>
    );
}