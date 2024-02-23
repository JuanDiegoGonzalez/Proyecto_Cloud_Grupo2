
import "./categoria.css";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from "../navbar/navbar";
import { getCategorias, deleteCategoria } from '../../services/service';
import { Button, Card, Col, Row } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup';

function ListCategoria() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [categorias, setCategorias] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        // Función para obtener las categorías
        const fetchCategorias = async () => {
            try {
                const categoriasData = await getCategorias(); 
                setCategorias(categoriasData); 
            } catch (error) {
                setError('Error al obtener las categorías');
            }
        };

        fetchCategorias(); 

    }, []); 
    const handleDeleteCategoria = async (categoriaId) => {
        try {
            const data =await deleteCategoria(categoriaId);
            if (!data.detail) {
                navigate(`/${id}/categorias`);
                const updatedCategorias = categorias.filter(categoria => categoria.id !== categoriaId);
                setCategorias(updatedCategorias);
                setError("");
            } else {
                setError(data.detail);
            }
        } catch (error) {
            setError('Error al eliminar la categoría');
        }
    };

    return (
        <div>
            <NavBar id={id} />
            <div className="categorias">
    {error && (
        <div>
            <h4 style={{ color: 'tomato', textAlign: "center" }}>
                {error}
            </h4>
        </div>
    )}
    {(categorias.length === 0 && !error) && (
        <div className='no-recomendations'>
            Por ahora no hay categorías. 
            <br />
            Anímate y crea una!
        </div>
    )}
    {categorias.length > 0 && (
        <Row className="body">
            {categorias.map(categoria => (
                <Col md={2} key={categoria.id}>
                    <div className="cardPlaces">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title style={{ color: "aliceblue" }}>{categoria.nombre}</Card.Title>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item> <b>Descripcion</b> {<p>{categoria.descripcion}</p>}</ListGroup.Item>
                                <ListGroup.Item> <b>Id</b> {<p>{categoria.id}</p>}</ListGroup.Item>
                                <br />
                                <Button variant="danger" onClick={() => handleDeleteCategoria(categoria.id)}>Delete</Button>
                            </ListGroup>
                        </Card>
                    </div>
                </Col>
            ))}
        </Row>
    )}
</div>

    </div>
    );
}

export default ListCategoria;

