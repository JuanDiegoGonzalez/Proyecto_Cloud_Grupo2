
import "./tareas.css";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategorias, createTask } from '../../services/service';
import NavBar from "../navbar/navbar";

function CrearTarea() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [selectedFileType, setSelectedFileType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileTypeChange = (e) => {
        setSelectedFileType(e.target.value);
        setSelectedFile(null); // Reinicia el archivo seleccionado cuando cambia el tipo de archivo
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError("Por favor, selecciona un archivo antes de convertirlo a PDF");
            return;
        }
        try {
            const taskData = new FormData();
            taskData.append('file', selectedFile)
            const jsonData = {
                fileName: "ruta del archivo uwu", 
                newFormat:"PDF"
            }
            taskData.append('data', JSON.stringify(jsonData))
            const data = await createTask(taskData);
            if (data) {
                navigate(`/home`);
            } else {
                setError('Error al crear la tarea');
            }
        } catch (error) {
            setError('Error al crear la tarea');
        }
    };

    return (
        <>
            <NavBar />
            <div className="tareas">
                <h1>Subir archivo y convertir a PDF</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error">{error}</div>}
                    <select value={selectedFileType} onChange={handleFileTypeChange}>
                        <option value="">Selecciona el tipo de archivo</option>
                        <option value="docx">Documento de Word (DOCX)</option>
                        <option value="pptx">Presentación de PowerPoint (PPTX)</option>
                        <option value="xlsx">Hoja de cálculo de Excel (XLSX)</option>
                        <option value="odt">Documento de texto de OpenDocument (ODT)</option>
                    </select>
                    <br />
                    {selectedFileType && (
                        <>
                        <br />
                            <input type="file" onChange={handleFileChange} accept={`.${selectedFileType}`} />
                            <br />
                            <button type="submit" className="btn btn-primary btn-block btn-large">Convertir a PDF</button>
                        </>
                    )}
                </form>
                <br /><br />
            </div>
        </>
    );
}

export default CrearTarea;
