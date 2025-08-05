import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        {'<>'} SDLC Agent
      </Link>
      <nav className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/features">FEATURES</Link>
       
        <Link to="/documentation">DOCUMENTATION</Link>
      </nav>
    </header>
  );
};

export default Header;
