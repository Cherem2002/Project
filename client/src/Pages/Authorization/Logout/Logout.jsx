import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Logout.css';

const Logout = ({ onLogoutClick }) => {
    const handleLogoutClick = () => {
        onLogoutClick();
    };
    return (
        <div className='Logout-container'>
            <button onClick={handleLogoutClick}>Выйти</button>
        </div>
    );
}
export default Logout;

