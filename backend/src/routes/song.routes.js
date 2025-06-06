import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../middlewares/upload.js";

const router = Router();
const prisma = new PrismaClient();

// Obtener canciones (todas o limitadas por query)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10); // Ej: ?limit=3
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' },
      ...(Number.isInteger(limit) ? { take: limit } : {}), // Solo aplica take si hay limit
    });
    res.json(songs);
  } catch (error) {
    console.error("Error al obtener canciones:", error);
    res.status(500).json({ error: "Error al obtener canciones" });
  }
});

// Crear nueva canción (solo admin) con imagen
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, price, tag, bpm, producer, url, artist } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newSong = await prisma.song.create({
      data: {
        title,
        price: Number(price),
        tag,
        bpm: Number(bpm),
        producer,
        url,
        artist,
        imageUrl,
      },
    });

    res.status(201).json(newSong);
  } catch (error) {
    console.error("Error al crear canción:", error);
    res.status(400).json({ error: error.message });
  }
});

// Actualizar canción por ID (solo admin) con posible nueva imagen
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const { title, price, tag, bpm, producer, url, artist } = req.body;

  try {
    let dataToUpdate = {
      title,
      price: Number(price),
      tag,
      bpm: Number(bpm),
      producer,
      url,
      artist,
    };

    if (req.file) {
      dataToUpdate.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedSong = await prisma.song.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(updatedSong);
  } catch (error) {
    console.error("Error al actualizar canción:", error);
    res.status(400).json({ error: "Error al actualizar la canción" });
  }
});

// Eliminar canción por ID (solo admin)
router.delete('/:id', isAdmin, async (req, res) => {
  const id = req.params.id;
  console.log('Intentando eliminar canción con ID:', id);

  try {
    const existing = await prisma.song.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }

    // Borra primero las compras relacionadas
    await prisma.purchase.deleteMany({ where: { songId: id } });

    await prisma.song.delete({ where: { id } });

    res.json({ message: 'Canción eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar canción:', error);
    res.status(500).json({ error: 'Error al eliminar la canción' });
  }
});

export default router;
