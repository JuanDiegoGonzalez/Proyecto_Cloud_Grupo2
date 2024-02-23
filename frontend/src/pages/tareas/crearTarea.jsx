
import "./tareas.css";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategorias, createTask } from '../../services/service';
import NavBar from "../navbar/navbar";

function CrearTarea() {
    const navigate = useNavigate();
    const [textoTarea, setTextoTarea] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [error, setError] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [estadoTarea, setEstadoTarea] = useState("");

    const { id } = useParams();

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const categoriasData = await getCategorias();
                setCategorias(categoriasData);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        fetchCategorias();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const taskData = {
                texto_tarea: textoTarea,
                fecha_creacion: fechaInicio || new Date().toISOString(),
                fecha_tentativa_finalizacion: fechaFin,
                estado: estadoTarea,
                id_categoria: categoriaSeleccionada,
                id_usuario: id
            };

            const data = await createTask(taskData);
            if (data) {
                navigate(`/${id}/tareas`);
            } else {
                setError('Error al crear la tarea');
            }
        } catch (error) {
            setError('Error al crear la tarea');
        }
    };

    return (
        <>
            <NavBar id={id} />
            <div className="tareas">
                <h1>Crea tu tarea!</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error">{error}</div>}
                    <h4>Tarea</h4>
                    <input type="text" name="texto_tarea" placeholder="Tarea" required onChange={(e) => setTextoTarea(e.target.value)} />
                    <h4>Fecha Inicio</h4>
                    <input type="datetime-local" name="fechaInicio" placeholder="Fecha inicio" onChange={(e) => setFechaInicio(e.target.value)} />
                    <h4>Fecha Tentativa de finalizacion</h4>
                    <input type="datetime-local" name="fechaFin" placeholder="Fecha finalización" onChange={(e) => setFechaFin(e.target.value)} required />
                    <h4>Estado</h4>
                    <select value={estadoTarea} onChange={(e) => setEstadoTarea(e.target.value)}>
                        <option value="">Selecciona un estado</option>
                        <option value="SIN_EMPEZAR">Sin empezar</option>
                        <option value="EMPEZADA">Empezada</option>
                        <option value="FINALIZADA">Finalizada</option>
                    </select>
                    <h4>Categoria</h4>
                    <select value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)}>
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                    <br /><br />
                    <button type="submit" className="btn btn-primary btn-block btn-large">Crear tarea</button>
                </form>
            </div>
        </>
    );
}

export default CrearTarea;
