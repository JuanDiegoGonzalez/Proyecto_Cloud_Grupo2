
import "./tareas.css";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from "../navbar/navbar";
import { getTareasByUser } from '../../services/service';
import CardPlaces from "./card/cardPlaces";
import { Col, Row } from "react-bootstrap";

function ListTarea() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [Tareas, setTareas] = useState([]);

    function formatDateTime(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        dateTime.setHours(dateTime.getHours() - 5);
    
        const formattedDate = dateTime.toLocaleDateString(); 
        const formattedTime = dateTime.toLocaleTimeString();
    
        return `${formattedDate} ${formattedTime}`;
    }
    useEffect(() => {
        const fetchTareas = async () => {
            try {
                const TareasData = await getTareasByUser();
                if (!TareasData.detail) {
                    setTareas(TareasData);
                } else {
                    if (TareasData.detail != "No se encontraron tareas para este usuario") {
                        setError(TareasData.detail);
                    }
                }
            } catch (error) {
                setError('Error al obtener las tareas');
            }
        };
        fetchTareas();
    }, []);

    return (
        <div>
            <NavBar  />
            <div className="Tareas">
                {error && (
                    <div>
                        <h4 style={{ color: 'tomato', textAlign: "center" }}>
                            {error}
                        </h4>
                    </div>
                )}
                {(Tareas.length === 0 && !error) && (
                    <div className='no-recomendations'>
                        No hay tareas por ahora :D be Happy . . .
                    </div>
                )}
                {Tareas.length > 0 && (
                    <Row className="body">
                        {Tareas.map((item, index) => (
                            <Col md={2} key={index}>
                                <CardPlaces
                                    title={item.fileName}
                                    oldFormat={item.oldFormat}
                                    newFormat={item.newFormat}
                                    status={item.status}
                                    timeStamp={formatDateTime(item.timeStamp)}
                                    idTarea={item.id}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    );
}

export default ListTarea;