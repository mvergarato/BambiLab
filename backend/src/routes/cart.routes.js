import express from "express";
const router = express.Router();

let carts = {}; // Aquí guardamos carritos por userId temporalmente (mejor usar DB en producción)

// Obtener carrito de un usuario
router.get("/", (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "userId requerido" });

  res.json(carts[userId] || []);
});

// Añadir item al carrito
router.post("/", (req, res) => {
  const { userId, song } = req.body;
  if (!userId || !song) return res.status(400).json({ error: "userId y canción requeridos" });

  if (!carts[userId]) carts[userId] = [];

  // Evitar duplicados
  if (carts[userId].find((item) => item.id === song.id)) {
    return res.status(400).json({ error: "Canción ya en el carrito" });
  }

  carts[userId].push(song);

  res.json(carts[userId]);
});

// Eliminar item del carrito
router.delete("/", (req, res) => {
  const { userId, songId } = req.body;
  if (!userId || !songId) return res.status(400).json({ error: "userId y songId requeridos" });

  if (!carts[userId]) return res.status(404).json({ error: "Carrito no encontrado" });

  carts[userId] = carts[userId].filter((item) => item.id !== songId);

  res.json(carts[userId]);
});

// Vaciar carrito
router.delete("/clear", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId requerido" });

  carts[userId] = [];

  res.json({ message: "Carrito vaciado" });
});

export default router;
