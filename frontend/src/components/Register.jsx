import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos para navegar

const Register = () => {
  const navigate = useNavigate(); // Hook para navegación

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("El email es obligatorio");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Usuario registrado correctamente");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Error desconocido");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-yellow-400 text-3xl font-bold mb-6 text-center">
          📧 Registro
        </h2>

        {error && (
          <p className="text-red-500 mb-6 text-center font-semibold">{error}</p>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-5 px-4 py-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-5 px-4 py-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        <input
          type="password"
          placeholder="Repetir contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-8 px-4 py-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded font-semibold shadow-md transition cursor-pointer"
        >
          Registrarse
        </button>
      </form>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 rounded-md bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-bold shadow-lg hover:from-purple-700 hover:to-purple-900 hover:shadow-xl transition duration-300 cursor-pointer"
      >
        ← Volver a Home
      </button>
    </div>
  );
};

export default Register;
