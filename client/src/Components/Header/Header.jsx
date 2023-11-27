import React, { useState } from 'react';
import logo from './logo_2.png';
import './Header.css';
import { Link } from "react-router-dom";
import { DropdownButton, Dropdown } from 'react-bootstrap';


const linkStyle = {
    textDecoration: "none",
    color: "#2A2F66"
};

const Header = ({ isLoggedIn, userName }) => {
    return (
        <header className='Header'>
            <div className='Logo-container'>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <img src={logo} alt='Логотип' />
                </Link>
            </div>
            <div className='Header-text'>
                <Link to="/schedule" style={linkStyle}>Расписание</Link>
                <Link to="/analytics" style={linkStyle}>Аналитика</Link>
            </div>
            <div className='Login-link'>
                {isLoggedIn ? (
                    <Link to="/logout" style={linkStyle}>{userName}</Link>
                ) : (
                    <Link to="/login" style={linkStyle}>Войти</Link>
                )}
            </div>
        </header>
    )
}
export default Header;
