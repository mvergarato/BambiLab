import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(403).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error en isAuthenticated middleware:', err.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export default isAuthenticated;
