import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, token } = useAuth();

  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [allPurchases, setAllPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    price: "",
    tag: "",
    bpm: "",
    producer: "",
    url: "",
    artist: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Nuevo estado para saldo a añadir
  const [saldoToAdd, setSaldoToAdd] = useState({});

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="text-center mt-20 text-red-600 text-xl font-bold">
        🚫 Acceso denegado. Solo administradores.
      </div>
    );
  }

  useEffect(() => {
    fetchSongs();
    fetchAllPurchases();
    fetchUsers();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/songs");
      const data = await res.json();
      setSongs(data);
      setAllSongs(data);
    } catch (err) {
      console.error("Error al obtener canciones:", err);
    }
  };

  const fetchAllPurchases = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/purchases/all");
      const data = await res.json();
      setAllPurchases(data);
    } catch (err) {
      console.error("Error al obtener historial de compras:", err);
    }
  };

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        alert("Error al obtener usuarios.");
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  // Función para añadir saldo a un usuario
  const handleAddSaldo = async (userId) => {
    const amount = parseFloat(saldoToAdd[userId]);
    if (!amount || amount <= 0) {
      alert("Introduce una cantidad válida para añadir saldo.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}/add-saldo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (res.ok) {
        alert("Saldo añadido correctamente");
        setSaldoToAdd({ ...saldoToAdd, [userId]: "" });
        fetchUsers();
      } else {
        alert("Error al añadir saldo.");
      }
    } catch (err) {
      console.error("Error al añadir saldo:", err);
      alert("Error al conectar con el servidor.");
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este usuario?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Usuario eliminado.");
        fetchUsers();
      } else {
        alert("Error al eliminar usuario.");
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaldoChange = (userId, value) => {
    setSaldoToAdd({ ...saldoToAdd, [userId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("artist", form.artist);
    formData.append("producer", form.producer);
    formData.append("tag", form.tag);
    formData.append("bpm", form.bpm);
    formData.append("price", form.price);
    formData.append("url", form.url);

    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `http://localhost:3000/api/songs/${form.id}`
      : "http://localhost:3000/api/songs";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        await fetchSongs();
        setForm({
          id: null,
          title: "",
          price: "",
          tag: "",
          bpm: "",
          producer: "",
          url: "",
          artist: "",
        });
        setIsEditing(false);
      } else {
        alert("Error: No tienes permisos o los datos son inválidos.");
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  const handleEdit = (song) => {
    setForm(song);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres borrar esta canción?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/songs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchSongs();
      } else {
        alert("Error al eliminar. Asegúrate de tener permisos.");
      }
    } catch (err) {
      console.error("Error al eliminar canción:", err);
    }
  };

  return (
    <main className="bg-gradient-to-br from-purple-900 via-black to-black min-h-screen text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          🎛️ Panel de Admin - Canciones
        </h1>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-5 mb-10"
        >
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
            className="p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
          />
          <input
            type="text"
            name="artist"
            placeholder="Artista"
            value={form.artist}
            onChange={handleChange}
            required
            className="p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
          />
          <input
            type="text"
            name="producer"
            placeholder="Productor"
            value={form.producer}
            onChange={handleChange}
            className="p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
          />
          <input
            type="text"
            name="tag"
            placeholder="Tag (trap, drill...)"
            value={form.tag}
            onChange={handleChange}
            className="p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
          />
          <input
            type="number"
            name="bpm"
            placeholder="BPM"
            value={form.bpm}
            onChange={handleChange}
            className="p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            required
            className="p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
          />
          <input
            type="url"
            name="url"
            placeholder="Enlace de la canción"
            value={form.url}
            onChange={handleChange}
            required
            className="p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
          />

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 transition rounded py-3 font-semibold text-black col-span-full shadow-md"
          >
            {isEditing ? "Actualizar canción" : "Agregar canción"}
          </button>
        </form>

        {/* Filtro por tag */}
        <div className="mb-6 flex items-center gap-3">
          <label className="font-semibold">Filtrar por tag:</label>
          <select
            onChange={(e) => {
              const tag = e.target.value;
              if (tag === "ALL") {
                setSongs(allSongs);
              } else {
                const filtered = allSongs.filter(
                  (song) => song.tag.toLowerCase() === tag.toLowerCase()
                );
                setSongs(filtered);
              }
            }}
            className="border border-gray-700 rounded p-2 bg-gray-900 text-white focus:outline-yellow-400"
          >
            <option value="ALL">Todas</option>
            <option value="trap">Trap</option>
            <option value="reggaeton">Reggaeton</option>
            <option value="drill">Drill</option>
            <option value="pop">Pop</option>
          </select>
        </div>

        {/* Lista de canciones */}
        <div className="grid gap-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-800 p-5 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg text-yellow-400">{song.title}</h3>
                <p className="text-sm text-gray-400">
                  🎤 {song.artist} | 🏷️ {song.tag} | 💰 {song.price} | 🔗{" "}
                  <a
                    className="text-yellow-400 underline hover:text-yellow-500"
                    href={song.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Enlace
                  </a>
                </p>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => handleEdit(song)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded font-semibold text-black"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(song.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Historial de compras */}
        <h2 className="text-yellow-400 font-bold text-2xl mt-16 mb-6">
          Historial de compras
        </h2>
        <div className="bg-gray-800 p-6 rounded-xl shadow max-h-96 overflow-auto">
          {allPurchases.length === 0 ? (
            <p className="text-gray-400 text-center">No hay compras registradas.</p>
          ) : (
            allPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="border-b border-gray-700 py-2 flex justify-between"
              >
                <div>
                  <p className="text-yellow-400 font-semibold">
                    🎵 {purchase.song?.title || "Canción eliminada"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    👤 {purchase.user?.email || "Usuario desconocido"}
                  </p>
                </div>
                <p className="text-gray-300 text-sm text-right">
                  🕒 {new Date(purchase.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Gestión de usuarios */}
        <h2 className="text-yellow-400 font-bold text-2xl mt-16 mb-6">
          Usuarios registrados
        </h2>
        <div className="bg-gray-800 p-6 rounded-xl shadow max-h-96 overflow-auto">
          {users.length === 0 ? (
            <p className="text-gray-400 text-center">No hay usuarios registrados.</p>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="border-b border-gray-700 py-3 flex flex-col md:flex-row md:justify-between items-center gap-3"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                  <p className="text-yellow-400 font-semibold">{u.email}</p>
                  <p className="text-gray-400 text-sm">
                    Rol: {u.role} | Saldo: ${u.balance?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Añadir saldo"
                    value={saldoToAdd[u.id] || ""}
                    onChange={(e) => handleSaldoChange(u.id, e.target.value)}
                    className="p-2 rounded bg-gray-900 border border-gray-700 text-white w-28 focus:outline-yellow-400"
                  />
                  <button
                    onClick={() => handleAddSaldo(u.id)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded font-semibold"
                  >
                    Añadir
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
