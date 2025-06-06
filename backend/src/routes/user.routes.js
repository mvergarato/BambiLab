import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import isAdmin from "../middlewares/isAdmin.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();
const prisma = new PrismaClient();

/** RUTAS PARA USUARIOS **/

// Obtener todos los usuarios (solo admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        balance: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Registrar un nuevo usuario
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "Ya existe un usuario con ese correo" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error del servidor al crear el usuario" });
  }
});

// Añadir saldo a un usuario (solo admin)
router.post('/:id/add-saldo', isAdmin, async (req, res) => {
  const { amount } = req.body;
  const userId = req.params.id;

  if (typeof amount !== 'number') {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: amount },
      },
    });

    res.json({ message: "Saldo añadido", user: updatedUser });
  } catch (err) {
    console.error('Error al añadir saldo:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Eliminar usuario por ID (solo admin)
router.delete('/:id', isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    // Primero eliminamos las compras relacionadas
    await prisma.purchase.deleteMany({
      where: { userId },
    });

    // Luego eliminamos al usuario
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error en el servidor al eliminar el usuario" });
  }
});

// Eliminar propia cuenta (usuario autenticado)
router.delete('/me', isAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    // Eliminamos todas las compras del usuario
    await prisma.purchase.deleteMany({
      where: { userId },
    });

    // Eliminamos al usuario
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    res.status(500).json({ error: "Error en el servidor al eliminar la cuenta" });
  }
});

export default router;
