import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';


const Login = ({ setIsLoggedIn, setUserName }) => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4444/login', { login, password });
            console.log(response.data);
            const userData = response.data.user;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', userData.name_teacher);
            localStorage.setItem('id_teacher', userData.id_teacher);
            setIsLoggedIn(true);
            setUserName(userData.name_teacher);
            navigate('/schedule');
        } catch (error) {
            setError('Invalid username or password');
            console.error('Error during login:', error);
        }
    };

    return (
        <div className='Login'>
            <h2>Авторизация</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className='Log'>
                    <label>Логин:</label>
                    <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
                </div>
                <div className='Pass'>
                    <label>Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;

