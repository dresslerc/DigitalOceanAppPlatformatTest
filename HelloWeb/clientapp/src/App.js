import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Main from './pages/main';
import Menuitem from './pages/menuitem';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div>
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">HelloWeb</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {/* Overview dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="overviewDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Main
                </a>
                <ul
                  className={`dropdown-menu ${darkMode ? 'dropdown-menu-dark' : ''}`}
                  aria-labelledby="overviewDropdown"
                >
                   <li><Link className="dropdown-item" to="/menuitem">Menu Item</Link></li>

                </ul>
              </li>

             
            </ul>

            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <label
                  htmlFor="navbar-date"
                  className={`form-label mb-0 ${darkMode ? 'text-light' : 'text-dark'}`}
                >
                  Date
                </label>
                <input
                  id="navbar-date"
                  type="date"
                  className="form-control form-control-sm"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  aria-label="Select date"
                />
              </div>

              {/* Dark mode toggle */}
              <button
                className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div className="container mt-5">
        <Routes>
          {/* Default route now redirects to Overview/All */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          {/* Overview pages */}
          <Route path="/main" element={<Main selectedDate={selectedDate} />} />
          <Route path="/menuitem" element={<Menuitem selectedDate={selectedDate} />} />


        </Routes>
      </div>

      {/* Footer */}
      <footer className={`text-center mt-5 py-3 ${darkMode ? 'bg-dark text-light' : 'bg-light text-muted'}`}>
        © 2025 HelloWeb
      </footer>
    </div>
  );
}

export default App;
