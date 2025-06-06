import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // <-- Importa useNavigate
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // <-- Hook para navegación programada

  const handleLogout = () => {
    logout();
    navigate('/');  // <-- Redirige a home tras cerrar sesión
  };

  return (
    <nav className="bg-black text-white px-8 py-4 flex items-center justify-between w-full">
      <div className="text-5xl font-extrabold tracking-wide cursor-pointer select-none hover:text-yellow-400 transition flex-shrink-0">
        <Link to="/">BAMBILAB</Link>
      </div>

      <div className="flex space-x-16 mx-auto">
        <Link to="/" className="text-2xl font-semibold hover:text-yellow-400 transition duration-300">Home</Link>
        <Link to="/beats" className="text-2xl font-semibold hover:text-yellow-400 transition duration-300">Beats</Link>
      </div>

      <div className="relative z-20 flex-shrink-0">
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm md:text-base font-semibold tracking-wide select-text">🎧 {user.email}</span>

            <Link to="/profile">
              <button className="bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600 transition">Perfil</button>
            </Link>

            {user.role === "ADMIN" && (
              <Link to="/admin">
                <button className="bg-green-500 px-4 py-1 rounded hover:bg-green-600 transition">
                  Admin
                </button>
              </Link>
            )}

            <button
              onClick={handleLogout}  // <-- Aquí usas la nueva función
              className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition duration-300"
            >
              Salir
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-purple-600 px-5 py-2 rounded hover:bg-purple-700 transition duration-300"
            >
              Login
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-200 transition duration-200">Iniciar sesión</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-200 transition duration-200">Registrarse</Link>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
