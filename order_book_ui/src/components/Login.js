import './Login.css'
import React, {useState} from 'react';
import axios from 'axios';
import api from '../api'

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState(null)

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit =  (e) => {
        e.preventDefault();
        setErrorMessage(null)
        console.log(api)
        axios.post('http://127.0.0.1:8000/api/token/', credentials, )
            .then((response) => {
                console.log(`Bearer ${response.data.access}`)
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                window.location.href = "/"
            })
            .catch((error) =>{
                setErrorMessage("Invalid username or password")
            });
    };
    return (
        <div className="Login">
            <form className="loginForm" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input
                    name="username"
                    placeholder="username"
                    value={credentials.username}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    value={credentials.password}
                    onChange={handleChange}
                />
                <p className="error-message" style={{ display: errorMessage ? "block" : "hidden" }}>{ errorMessage }</p>
                <button className="loginButton" type="submit" onSubmit={handleSubmit}>Login</button>
            </form>
        </div>
    );
};

export default Login;