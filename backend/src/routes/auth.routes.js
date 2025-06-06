import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const { password: _, ...safeUser } = user;

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el login" });
  }
});

// Registro (opcional)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashed = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "USER", // Asigna rol por defecto para nuevos usuarios
      },
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

export default router;
