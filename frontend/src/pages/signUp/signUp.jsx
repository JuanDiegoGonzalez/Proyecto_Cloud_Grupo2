
import "./signUp.css";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/service'; 
import {Link} from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }
            try{
                const data = await signUp(username, password, password2, email);
                    if (!data.error) {
                        navigate(`/home`);
                    } else {
                        setError(data.error);
                    }
            }
            catch (error) {
                setError(error);
            }    
        
    };

    return (
        <div className="login">
            <h1>Sign Up</h1>
            <form method="post" onSubmit={handleSignUp}>
                {error && <div className="error">{error} <br /></div>}
                <input type="text" name="user" placeholder="Usuario" required onChange={(e) => setUsername(e.target.value)} />
                <input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" name="password2" placeholder="Confirma la contraseña" onChange={(e) => setPassword2(e.target.value)} required />
                <button type="submit" className="btn btn-primary btn-block btn-large">Crear cuenta</button>
            </form>
            <Link to="/"> Iniciar sesión </Link>
        </div>
    );
}
export default SignUp;