
import "./login.css";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/service';
import {Link} from "react-router-dom";




function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (!data.error) {
                navigate(`/home`);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form method="post" onSubmit={handleLogin}>
                {error && <div className="error">{error}</div>}
                <input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="btn btn-primary btn-block btn-large">
                    Ingresar</button>
            </form>
            <Link to="/signUp"> Crear una cuenta </Link>
        </div>
    );
}

export default Login;
