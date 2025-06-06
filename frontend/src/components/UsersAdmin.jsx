import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const UsersAdmin = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddBalance = async (userId) => {
    const amount = Number(amountToAdd[userId]);
    if (!amount || amount <= 0) {
      alert("Ingresa un monto válido");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}/coins`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coins: amount }),
      });

      if (!res.ok) throw new Error("Error al añadir saldo");
      await fetchUsers();
      setAmountToAdd(prev => ({ ...prev, [userId]: "" }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("¿Eliminar usuario? Esta acción no se puede deshacer.")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar usuario");
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <h2 className="text-yellow-400 font-bold text-2xl mb-4">Usuarios registrados</h2>
      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="w-full text-white bg-gray-800 rounded-lg">
          <thead>
            <tr>
              <th className="p-2 border border-gray-700">Email</th>
              <th className="p-2 border border-gray-700">Rol</th>
              <th className="p-2 border border-gray-700">Saldo</th>
              <th className="p-2 border border-gray-700">Añadir saldo</th>
              <th className="p-2 border border-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.balance}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={amountToAdd[user.id] || ""}
                    onChange={(e) =>
                      setAmountToAdd(prev => ({ ...prev, [user.id]: e.target.value }))
                    }
                    placeholder="Monto"
                    className="w-20 p-1 rounded text-black"
                  />
                  <button
                    onClick={() => handleAddBalance(user.id)}
                    className="ml-2 bg-yellow-500 px-3 py-1 rounded font-semibold text-black"
                  >
                    Añadir
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 px-3 py-1 rounded font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersAdmin;
