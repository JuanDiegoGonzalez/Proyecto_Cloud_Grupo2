import { Route, Routes, Navigate } from "react-router-dom";
import React from 'react';
import Login from "../pages/login/login";
import SignUp from "../pages/signUp/signUp";
import CrearTarea from "../pages/tareas/crearTarea";
import ListTarea from "../pages/tareas/listaTareas";
import PrivateRoute from '../utils/privateRoute';

const CreateRoutes = () => (
    <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
            <Route exact path="/home" element={<ListTarea/>} />
            <Route exact path="/converter" element={<CrearTarea />} />
        </Route>
       
        <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
);

export default CreateRoutes;