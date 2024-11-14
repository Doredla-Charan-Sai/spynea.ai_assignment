import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login'); 
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Create Product</Link></li>
          <li><Link to="/products">Product List</Link></li>
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
