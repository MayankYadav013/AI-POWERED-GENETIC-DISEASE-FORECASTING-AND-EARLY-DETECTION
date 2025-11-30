import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" className="logo-link">🧬 GeneticGuard</NavLink>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/" className={navClass}>Home</NavLink></li>
        {user ? (
          <>
            <li><NavLink to="/predict" className={navClass}>Predict Risk</NavLink></li>
            <li>
              <button type="button" onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className={navClass}>Login</NavLink></li>
            <li><NavLink to="/signup" className="btn-primary btn-pill">Sign Up</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
