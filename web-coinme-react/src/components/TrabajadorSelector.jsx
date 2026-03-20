import { useState, useEffect } from 'react';
// --- IMPORTAMOS EL SELECTOR ---
import { TrabajadorSelector } from '../../components/TrabajadorSelector';

export function Fichajes() {
    const [fichajes, setFichajes] = useState([]);
    // --- NUEVO ESTADO PARA EL FILTRO ---
    const [idTrabajador, setIdTrabajador] = useState('');

    // --- EFECTO PARA CARGAR FICHAJES (SE ACTIVA AL CAMBIAR EL TRABAJADOR) ---
    useEffect(() => {
        const fetchFichajes = async () => {
            try {
                // Si hay id, buscamos los de ese trabajador; si no, todos los generales
                const url = idTrabajador 
                    ? `http://localhost:3000/api/fichajes/trabajador/${idTrabajador}`
                    : `http://localhost:3000/api/fichajes`;

                const res = await fetch(url, { credentials: 'include' });
                const data = await res.json();
                setFichajes(data);
            } catch (error) {
                console.error("Error cargando fichajes:", error);
            }
        };

        fetchFichajes();
    }, [idTrabajador]); // Se vuelve a ejecutar cada vez que idTrabajador cambia

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Fichajes</h2>

            {/* --- AÑADIMOS EL DESPLEGABLE --- */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Filtrar por empleado:</span>
                <TrabajadorSelector onSelect={setIdTrabajador} />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#264653', color: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Trabajador</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Entrada</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Salida</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {fichajes.length > 0 ? (
                        fichajes.map(f => (
                            <tr key={f.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{f.nombre_completo || f.usuario_id}</td>
                                <td style={{ padding: '10px' }}>{f.entrada}</td>
                                <td style={{ padding: '10px' }}>{f.salida || 'En curso...'}</td>
                                <td style={{ padding: '10px' }}>
                                    <button style={{ cursor: 'pointer', padding: '5px 10px' }}>Editar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>
                                No se encontraron fichajes para este criterio.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}