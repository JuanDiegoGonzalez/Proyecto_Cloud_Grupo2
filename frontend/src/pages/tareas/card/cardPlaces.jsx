    import React, { useState } from 'react'
    import "./cardPlaces.css"
    import Card from 'react-bootstrap/Card';
    import ListGroup from 'react-bootstrap/ListGroup';
    import { useNavigate, useParams } from 'react-router-dom';
    import { Button } from 'react-bootstrap';
    import { deleteTarea } from '../../../services/service';


    function CardPlaces(props) {
        const navigate = useNavigate();
        const [error, setError] = useState("");
        const [enable, setEnable] = useState(true);
        const id= useParams();

        const formatDate = (dateString) => {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        };
        const handleDeleteTarea = async (tareaId) => {
            try {
                const data =await deleteTarea(tareaId);
                console.log(id)
                if (!data.detail) {
                    setError("Eliminado! Recarga la pagina");
                    setEnable(false);
                    
                } else {
                    setError(data.detail);
                }
            } catch (error) {
                setError('Error al eliminar la tarea');
            }
        };

        return (
            <>
            {error && <div >
                    <h5 style={{ color: 'tomato' }}>
                    {error}
                    </h5>
                    </div>}
                    <div className="cardPlaces">
            <Card style={{ width: '18rem' }} >
                <Card.Body>
                    <Card.Title style={{ color: "aliceblue"}}>{props.texto_tarea}</Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item> <b>Fecha de creación:</b> {formatDate(props.fecha_creacion)}</ListGroup.Item>
                    <ListGroup.Item> <b>Fecha de finalización: </b> {formatDate(props.fecha_tentativa_finalizacion)}</ListGroup.Item>
                    <ListGroup.Item> <b>Estado:</b> {props.estado} </ListGroup.Item>
                    <ListGroup.Item><b>Categoría:</b> {props.categoria} </ListGroup.Item>
                    <br />
                    <Button disabled= {!enable} variant="danger" onClick={() => handleDeleteTarea(props.idTarea)}>Delete</Button>
                </ListGroup>
            </Card>
        </div>
            </>
        
        )
    }

    export default CardPlaces