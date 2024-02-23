import { Route, Routes } from "react-router-dom";
import React from 'react';
import Login from "../pages/login/login";
import SignUp from "../pages/signUp/signUp";
import CrearTarea from "../pages/tareas/crearTarea";
import CrearCategoria from "../pages/categoria/crearCategoria";
import ListCategoria from "../pages/categoria/listCategoria";
import ListTarea from "../pages/tareas/listaTareas";

const CreateRoutes = () => (
    <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/home" element={<ListTarea/>} />
        <Route exact path="/converter" element={<CrearTarea />} />
    </Routes>
);

export default CreateRoutes;