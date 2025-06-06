import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/purchases?userId=xxx
 * Obtener historial de compras de un usuario
 */
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId es requerido" });
  }

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        song: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(purchases);
  } catch (error) {
    console.error("Error al obtener historial de compras:", error);
    res.status(500).json({ error: "Error al obtener historial de compras" });
  }
});

/**
 * POST /api/purchases
 * Registrar una nueva compra
 * Body: { userId, songId }
 */
router.post("/", async (req, res) => {
  const { userId, songId } = req.body;

  if (!userId || !songId) {
    return res.status(400).json({ error: "userId y songId son requeridos" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const song = await prisma.song.findUnique({ where: { id: songId } });

    if (!user || !song) {
      return res.status(404).json({ error: "Usuario o canción no encontrados" });
    }

    // Verificar si ya fue comprada
    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, songId },
    });

    if (existingPurchase) {
      return res.status(400).json({ error: "Ya has comprado esta canción" });
    }

    // Verificar saldo
    if (user.balance < song.price) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    // Crear compra
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        songId,
      },
    });

    // Actualizar saldo del usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: user.balance - song.price,
      },
    });

    res.status(201).json({
      message: "Compra exitosa",
      purchase,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al procesar compra:", error);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
});

// Obtener todas las compras (para admin)
router.get('/all', async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        user: true,
        song: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(purchases);
  } catch (err) {
    console.error('Error al obtener todas las compras:', err);
    res.status(500).json({ error: 'Error al obtener compras' });
  }
});


export default router;
