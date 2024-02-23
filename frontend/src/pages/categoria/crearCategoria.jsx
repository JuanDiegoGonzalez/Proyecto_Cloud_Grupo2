
import "./categoria.css";

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postCategoria } from '../../services/service';
import {Link} from "react-router-dom";
import NavBar from "../navbar/navbar";



function CrearCategoria() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");
    const { id } = useParams();

    const handlePostCategoria = async (e) => {
        e.preventDefault();
        try {
            const data = await postCategoria(nombre, descripcion);
            if (!data.detail) {
                navigate(`/${id}/categorias`);
            } else {
                setError(data.detail);
            }
        } catch (error) {
            setError('Error al crear la nueva categoría');
        }
    };

    return (
        <>
         <NavBar id={id} />
        <div className="login">
            <h1>Crear categoria</h1>
            <form method="post" onSubmit={handlePostCategoria}>
                {error && <div className="error">{error}</div>}
                <input type="" name="nombre" placeholder="Nombre" required onChange={(e) => setNombre(e.target.value)}/>
                <input type="" name="descripcion" placeholder="Descripcion" onChange={(e) => setDescripcion(e.target.value)} required />
                <button type="submit" className="btn btn-primary btn-block btn-large"> Crear Categoria</button>
            </form>
        </div>
        </>
    );
}

export default CrearCategoria;
