import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/songs?limit=3")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error al cargar beats:", error));
  }, []);

  return (
    <main className="bg-gradient-to-br from-purple-900 via-black to-black text-white px-4 sm:px-6 lg:px-8 pb-8">
      {/* Hero section */}
      <section className="flex flex-col justify-center items-center py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-8 animate-pulse">
          Bienvenido a <span className="text-purple-400">BAMBILAB</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
          Descubre y compra beats exclusivos para llevar tu música al siguiente nivel.
        </p>
        <div className="flex justify-center space-x-6 mb-12">
          <Link
            to="/login"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition duration-300 shadow-lg shadow-purple-700/50"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white rounded-md font-semibold transition duration-300 shadow-lg shadow-purple-700/30"
          >
            Registrarse
          </Link>
        </div>
      </section>

      {/* Beats destacados */}
      <section className="max-w-7xl mx-auto mb-20">
        <h2 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
          🔥​ Beats Destacados 🔥​
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {songs.length === 0 && (
            <p className="text-center w-full text-xl">Cargando beats...</p>
          )}
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 flex flex-col p-8 min-h-[360px]"
            >
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-3 text-yellow-400 tracking-wide">
                  {song.title}
                </h3>
                <p className="text-xl text-gray-300 mb-2 font-semibold">
                  Artista: <span className="text-white">{song.artist}</span>
                </p>
                <p className="text-2xl font-extrabold text-yellow-500 mb-6">
                  {song.price} coins
                </p>
              </div>
              <div className="flex justify-end items-center">
                <a
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 text-3xl transition-colors cursor-pointer"
                  title="Escuchar"
                >
                  <FaPlay />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Ver Más */}
        <div className="flex justify-center mt-8">
          <Link
            to="/beats"
            className="px-12 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold transition duration-300 shadow-lg shadow-yellow-600/50"
          >
            Ver más Beats
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
