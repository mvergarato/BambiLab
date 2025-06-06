import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from './routes/user.routes.js';
import songRoutes from './routes/song.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import authRoutes from './routes/auth.routes.js';
import 'dotenv/config';
import cartRoutes from './routes/cart.routes.js';


const app = express();

// Para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Habilita CORS para que React pueda acceder
app.use(cors());

// Para que pueda leer JSON en el body
app.use(express.json());

// Sirve la carpeta uploads como estática para acceder a imágenes
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/cart', cartRoutes);

// Inicia el servidor
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
