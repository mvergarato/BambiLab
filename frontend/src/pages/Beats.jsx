import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Beats = () => {
  const { user, updateUser } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/purchases?userId=${user.id}`);
        const data = await res.json();
        const purchasedSongIds = data.map((purchase) => purchase.songId);
        setPurchases(purchasedSongIds);
      } catch (error) {
        console.error("Error al cargar compras:", error);
      }
    };

    fetchPurchases();
  }, [user]);

  const fetchSongs = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/songs");
      const data = await res.json();
      setSongs(data);
    } catch (error) {
      console.error("Error al obtener canciones:", error);
    }
  };

  const handleBuy = async (song) => {
    if (!user) return alert("Debes iniciar sesión.");
    if (user.balance < song.price) return alert("No tienes suficiente saldo.");
    if (purchases.includes(song.id)) return alert("Ya compraste esta canción.");

    const confirmed = window.confirm(`¿Deseas comprar "${song.title}" por ${song.price} coins?`);

    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:3000/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, songId: song.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Error en la compra");
        return;
      }

      const data = await res.json();

      alert("Compra realizada con éxito.");

      updateUser(data.user);
      setPurchases((prev) => [...prev, song.id]);
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <main className="bg-gradient-to-br from-purple-900 via-black to-black min-h-screen text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
          🎵 Beats disponibles
        </h1>
        <div className="grid gap-8 md:grid-cols-3">
          {songs.map((song) => {
            const bought = purchases.includes(song.id);
            return (
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
                <div className="flex justify-end space-x-5 items-center">
                  <a
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 text-3xl transition-colors cursor-pointer"
                    title="Escuchar"
                  >
                    🎧
                  </a>
                  {bought ? (
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold shadow-md transition cursor-pointer"
                    >
                      Descargar
                    </a>
                  ) : (
                    <button
                      onClick={() => handleBuy(song)}
                      className="bg-yellow-500 text-black px-6 py-3 rounded-md hover:bg-yellow-600 font-semibold shadow-md transition cursor-pointer"
                    >
                      Comprar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Beats;
