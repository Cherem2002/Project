import React, { useState } from 'react';
import logo from './logo_2.png';
import './Header.css';
import { Link } from "react-router-dom";

const linkStyle = {
    textDecoration: "none",
    color: "#2A2F66"
};

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    return (
        <header className='Header'>
            <div className='Logo-container'>
                <img src={logo} alt='Логотип' />
            </div>
            <div className='Header-text'>
                <Link to="/test" style={linkStyle}>Тест</Link>
            </div>
            <div className='Login-link'>
                {isLoggedIn ? (
                    `${userName}`
                ) : (
                    <Link to="/login" style={linkStyle}>Войти</Link>
                )}
            </div>
        </header>
    )
}
export default Header;
