import React from 'react';
import { saveToken, getToken, saveAuthData } from './auth';

const token = getToken(); // Obtiene el token de localStorage

const back = process.env.REACT_APP_BACKEND_HOST
const login = async (email, password) => {
    try {
        const response = await fetch(back + '/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        if (!response.ok) {
            throw new Error('Error al iniciar sesión');
        }
        const data = await response.json();
        saveAuthData(data.token_de_acceso, data.usuario.username)
        return data; // Retorna los datos del usuario si la solicitud fue exitosa
    } catch (error) {
        throw new Error('Error al iniciar sesión:', error);
    }
};

const signUp = async (username, password, password2, email) => {
    try {
        const response = await fetch(back + '/auth/signup/', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password1: password,
                password2: password2, 
                email: email
            })
        });
        const data = await response.json();
        saveAuthData(data.token_de_acceso, data.usuario.username)
        return data;
    } catch (error) {
        throw new Error(error);
    }
};
// ---------------------------------------------------------------------------
// C A T E G O R I A 
// ---------------------------------------------------------------------------

const postCategoria = async (name, description) => {
    try {
        const response = await fetch(back + '/categorias', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                nombre: name,
                descripcion: description
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error al crear Categoria:', error);
    }
};

const getCategorias = async () => {
    try {
        const response = await fetch(`${back}/categorias`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error al obtener categorías:', error);
    }
};

const deleteCategoria = async (categoriaId) => {
    try {
        const response = await fetch(`${back}/categorias/${categoriaId}`, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error en la solicitud de eliminación de categoría:', error);
    }
};


// ---------------------------------------------------------------------------
// T A R E A
// ---------------------------------------------------------------------------

const createTask = async (taskData) => {
    try {
        for (var key of taskData.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }
        const response = await fetch(back + '/tasks/', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: taskData
        });

        if (!response.ok) {
            throw new Error('Error al crear la tarea');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error en la solicitud de creación de tarea:', error);
    }
};


const getTareasByUser = async () => {
    try {
        const response = await fetch(`${back}/tasks/`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error al obtener las tareas:', error);
    }
}
const downloadTarea = async (tareaId, tareaTitle) => {
    try {
        fetch(`${back}/files/${tareaId}_${tareaTitle}/`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }).then( res => res.blob() )
        .then( blob => {
            var file = window.URL.createObjectURL(blob);
            var fileLink = document.createElement('a');

            fileLink.href = file;
            fileLink.download = tareaTitle.substring(0, tareaTitle.lastIndexOf('.'));
            fileLink.click();
        });;
    } catch (error) {
        throw new Error('Error en la solicitud de eliminación de la tarea:', error);
    }
};
const deleteTarea = async (tareaId) => {
    try {
        const response = await fetch(`${back}/tasks/${tareaId}/`, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });


    } catch (error) {
        throw new Error('Error en la solicitud de eliminación de la tarea:', error);
    }
};
export { login, signUp, postCategoria, getCategorias, createTask, getTareasByUser, deleteCategoria, downloadTarea, deleteTarea };
