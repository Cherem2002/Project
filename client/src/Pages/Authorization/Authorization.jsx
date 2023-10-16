import React, { useState } from 'react';
import axios from 'axios';
import './Authorization.css';

const Authorization = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4444/login', { login, password });
            const userData = response.data.user;
            setUser(userData);
        } catch (error) {
            setError('Invalid username or password');
            console.error('Error during login:', error);
        }
    };

    if (user) {
        return <div>Welcome, {user.name_teacher}!</div>;
    }

    return (
        <div>
            <h2>Login Form</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Login:</label>
                    <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Authorization;

