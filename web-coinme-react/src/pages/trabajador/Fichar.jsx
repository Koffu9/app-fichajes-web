import { useState, useEffect } from 'react';
import styles from './Fichar.module.css';

const hoy = new Date();
const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

function Reloj() {
    const [ahora, setAhora] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setAhora(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <>
            <div className={styles.reloj}>{ahora.toLocaleTimeString()}</div>
            <p className={styles.fecha}>{ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </>
    );
}


export function Fichar() {
    const [estado, setEstado] = useState({ proximoTipoFichar: 'entrada', pausaVisible: false, proximoTipoPausa: null });
    const [motivos, setMotivos] = useState([]);
    const [motivoId, setMotivoId] = useState('');
    const [filtros, setFiltros] = useState({ desde: '', hasta: '' });
    const [verHistorial, setVerHistorial] = useState(false);
    const [fichajesSession, setFichajesSession] = useState([]);


    const inicializar = async () => {
        try {
            const resEstado = await fetch('/api/fichajes/estado', { credentials: 'include' });
            const dataEstado = await resEstado.json();
            setEstado(dataEstado);

            const resMotivos = await fetch('/api/fichajes/motivos-pausa', { credentials: 'include' });
            const dataMotivos = await resMotivos.json();
            setMotivos(dataMotivos.motivos || []);
            if (dataMotivos.motivos?.length > 0) setMotivoId(dataMotivos.motivos[0].id);
        } catch (error) {
            console.error("Error al inicializar:", error);
        }
    };

    useEffect(() => { inicializar(); }, []);

    const cargarFichajesHoy = async () => {
        const params = new URLSearchParams();
        params.append('fechaInicio', fechaHoy);
        params.append('fechaFin', fechaHoy);
        const res = await fetch(`/api/fichajes/misFichajes?${params.toString()}`, { credentials: 'include' });
        const data = await res.json();
        setFichajesSession(Array.isArray(data.fichajes) ? data.fichajes : []);
    };

    const refrescarTodo = async () => {
        const res = await fetch('/api/fichajes/estado', { credentials: 'include' });
        const data = await res.json();
        setEstado(data);

        const params = new URLSearchParams();
        params.append('fechaInicio', fechaHoy);
        params.append('fechaFin', fechaHoy);
        const resHoy = await fetch(`/api/fichajes/misFichajes?${params.toString()}`, { credentials: 'include' });
        const dataHoy = await resHoy.json();
        setFichajesSession(Array.isArray(dataHoy.fichajes) ? dataHoy.fichajes : []);
    };

    const handleFichar = async () => {
        await fetch('/api/fichajes/fichar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        refrescarTodo();
    };

    const handlePausa = async () => {
        await fetch('/api/fichajes/descanso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ motivoId })
        });
        refrescarTodo();
    };

    const obtenerHistorial = async () => {
        if (!filtros.desde || !filtros.hasta) return;
        const params = new URLSearchParams();
        params.append('fechaInicio', filtros.desde);
        params.append('fechaFin', filtros.hasta);
        const res = await fetch(`/api/fichajes/misFichajes?${params.toString()}`, { credentials: 'include' });
        const data = await res.json();
        setFichajesSession(Array.isArray(data.fichajes) ? data.fichajes : []);
    };

    const getBtnClass = () => {
        if (estado.proximoTipoFichar === 'entrada') return `${styles.btnFichar} ${styles.btnEntrada}`;
        if (estado.proximoTipoFichar === 'salida') return `${styles.btnFichar} ${styles.btnSalida}`;
        return `${styles.btnFichar} ${styles.btnDeshabilitado} ${styles.btnFicharDisabled}`;
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Panel de Fichaje</h2>

            <Reloj />

            <div className={styles.card}>
                {estado.pausaVisible && estado.proximoTipoPausa === 'pausa_inicio' && (
                    <div>
                        <label className={styles.motivoLabel}>Motivo de la pausa:</label>
                        <select
                            value={motivoId}
                            onChange={(e) => setMotivoId(e.target.value)}
                            className={styles.motivoSelect}
                        >
                            {motivos.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={styles.botonesWrap}>
                    <button
                        onClick={handleFichar}
                        disabled={estado.proximoTipoFichar === null}
                        className={getBtnClass()}
                    >
                        {estado.proximoTipoFichar ? estado.proximoTipoFichar.toUpperCase() : 'ESTÁS EN PAUSA'}
                    </button>

                    {estado.pausaVisible && (
                        <button onClick={handlePausa} className={styles.btnPausa}>
                            {estado.proximoTipoPausa === 'pausa_fin' ? 'TERMINAR DESCANSO' : 'INICIAR DESCANSO'}
                        </button>
                    )}
                </div>

                {estado.ultimoFichaje && (
                    <div className={styles.ultimoFichaje}>
                        <p className={styles.ultimoFichajeTexto}>
                            Último movimiento: <strong className={styles.ultimoFichajeTipo}>{estado.ultimoFichaje.tipo.toUpperCase()}</strong>
                            <span> a las {new Date(estado.ultimoFichaje.fecha_hora).toLocaleTimeString()}</span>
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={() => {
                    const nuevoEstado = !verHistorial;
                    setVerHistorial(nuevoEstado);
                    if (nuevoEstado) {
                        setFiltros({ desde: fechaHoy, hasta: fechaHoy });
                        cargarFichajesHoy();
                    }
                }}
                className={styles.btnInformes}
            >
                {verHistorial ? 'OCULTAR INFORMES' : 'VER MIS INFORMES'}
            </button>

            {verHistorial && (
                <>
                    <hr className={styles.separador} />
                    <h3 className={styles.historialTitulo}>Mi Historial de Actividad</h3>
                    <div className={styles.filtrosWrap}>
                        <input
                            type="date"
                            className={styles.inputFecha}
                            value={filtros.desde}
                            onChange={e => setFiltros({ ...filtros, desde: e.target.value })}
                        />
                        <input
                            type="date"
                            className={styles.inputFecha}
                            value={filtros.hasta}
                            onChange={e => setFiltros({ ...filtros, hasta: e.target.value })}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={obtenerHistorial} className={styles.btnFiltrar}>Filtrar</button>
                            <button onClick={() => {
                                setFichajesSession([]);
                                setFiltros({ desde: '', hasta: '' });
                            }} className={styles.btnReset}>Reset</button>
                        </div>
                    </div>
                    <div className={styles.tablaWrap}>
                        <table className={styles.tabla}>
                            <thead className={styles.tablaHeader}>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Movimiento</th>
                                    <th>Detalle / Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fichajesSession.map((f, i) => (
                                    <tr key={i} className={`${styles.tablaFila} ${i % 2 === 0 ? styles.tablaCeldaPar : styles.tablaCeldaImpar}`}>
                                        <td>{f.fecha_hora ? new Date(f.fecha_hora).toLocaleString() : '-'}</td>
                                        <td className={styles.tipoTexto}>{f.tipo.toUpperCase()}</td>
                                        <td className={styles.motivoTexto}>{f.motivo_nombre || f.motivo_id || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}