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
    const id = useParams();

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
            await deleteTarea(tareaId);
            setError("Eliminado! Recarga la pagina");
            setEnable(false);
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
                        <Card.Title style={{ color: "aliceblue" }}>{props.title}</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item> <b>Formato anterior: </b> {props.oldFormat}</ListGroup.Item>
                        <ListGroup.Item> <b>Formato nuevo: </b> {props.newFormat}</ListGroup.Item>
                        <ListGroup.Item> <b>Estado:</b> {props.status.llave} </ListGroup.Item>
                        <ListGroup.Item> <b>Fecha de creación:</b> {props.timeStamp}</ListGroup.Item>
                        <br />
                        <Button disabled={!enable} variant="danger" onClick={() => handleDeleteTarea(props.idTarea)}>Delete</Button>
                    </ListGroup>
                </Card>
            </div>
        </>

    )
}

export default CardPlaces