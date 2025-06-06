import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, logout } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return; // no hacemos fetch si no hay user

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/purchases?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // envía el token si el endpoint lo requiere
          },
        });
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setPurchases(data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener compras:', err);
        setError('No se pudo cargar el historial de compras.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user, token]);

  // Eliminar función handleDeleteAccount porque ya no es necesaria

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black px-4">
        <p className="text-yellow-400 text-xl font-semibold">Debes iniciar sesión.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-gray-900 rounded-xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400">👤 Perfil de Usuario</h1>
        <p className="mb-2 text-lg">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="mb-6 text-lg">
          <strong>Saldo:</strong> 💰 {user.balance} coins
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">🛒 Historial de Compras</h2>

        {loading ? (
          <p className="text-center text-gray-400">Cargando compras...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : purchases.length === 0 ? (
          <p className="text-center text-gray-400">No tienes compras registradas.</p>
        ) : (
          <ul className="space-y-4">
            {purchases.map((p) => (
              <li
                key={p.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition"
              >
                <p>
                  <strong>🎵 Canción:</strong> {p.song?.title || 'N/A'}
                </p>
                <p>
                  <strong>🎤 Artista:</strong> {p.song?.artist || 'N/A'}
                </p>
                <p>
                  <strong>🕒 Fecha:</strong> {new Date(p.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>💰 Precio:</strong> {p.song?.price || 'N/A'} coins
                </p>
                <a
                  href={p.song?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  🎧 Escuchar / Descargar
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Botón eliminado */}

      </div>
    </div>
  );
};

export default Profile;
