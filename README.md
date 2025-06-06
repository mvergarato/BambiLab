# 🐰 BambiLab

**Plataforma para productores y beatmakers.**  
Explora librerías, drumkits, tutoriales y plugins gratuitos. Cada sección está categorizada dentro de la app para una mejor navegación y experiencia.

---

## 🧱 Tech Stack

- **Frontend:** React (Vite)  
- **Backend:** Node.js + Express  
- **Base de datos:** SQLite  
- **ORM:** Prisma  
- **Control de versiones:** Git + GitHub

---

## 🚀 Instalación y Ejecución Local

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/BambiLab.git
cd bambilab
```

### 2. Estructura del Proyecto

```bash
bambilab/
├── client/            # React frontend
├── server/            # Node + Express backend
├── .env               # Variables de entorno
└── README.md
```

---

## 🖥️ Frontend (React)

### Instalación

```bash
cd client
npm install
npm run dev
```

### Estructura Inicial

```bash
client/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

---

## 🔧 Backend (Node.js + Express)

### Instalación

```bash
cd server
npm install
npm run dev
```

### Estructura Inicial

```bash
server/
├── controllers/
├── models/
├── routes/
├── config/
│   └── db.js
├── index.js
└── .env
```

---

## 🗃️ Base de Datos (SQLite)

### Configuración

- Instala Sqlite localmente o usa un servicio como **DBeaver**.
- Crea una base de datos llamada `bambilab`.
- En el archivo `.env`, agrega tus variables de entorno:

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bambilab
```

---

## 🔮 Features Iniciales

- 🥁 Librerías y Drumkits  
- 🎓 Tutoriales  
- 🧩 Plugins gratuitos  
- 🔍 Búsqueda y filtrado  
- 📂 Categorías/Tags  

---

## 📦 Scripts Útiles

### Frontend

```bash
npm run dev         # Modo desarrollo
npm run build       # Build de producción
```

### Backend

```bash
npm run dev         # Levantar servidor con nodemon
```

---

## ✅ Checklist Inicial

- [x] Estructura básica del frontend y backend  
- [x] Conexión con base de datos  
- [x] Endpoints iniciales para cada sección  
- [x] UI básica con navegación  

---

## ✨ Contribuciones

¡Pull requests y sugerencias son bienvenidas!  
Hecho con ❤️ por [@mvergarato].
