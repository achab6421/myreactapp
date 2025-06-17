import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="bi bi-code-square me-2"></i>
          Python 教學平台
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
                <i className="bi bi-house-door me-1"></i> 首頁
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/exercises" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <i className="bi bi-journals me-1"></i> 習題列表
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/exercises/create" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <i className="bi bi-plus-circle me-1"></i> 創建習題
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/test-editor" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <i className="bi bi-code me-1"></i> 編輯器測試
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
