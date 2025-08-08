// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('PayPal Mode:', process.env.PAYPAL_MODE);
console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID.slice(0,10) + '...');

const app = express();
app.use(cors());
app.use(express.json());

// ----- RUTAS API -----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productsRoutes'));
app.use('/api/paypal', require('./routes/paypalRoutes'));

// ----- ESTÁTICOS FRONTEND (define PRIMERO FRONTEND_DIR) -----
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// sirve / (index.html, css, js, etc)
app.use(express.static(FRONTEND_DIR));

// sirve /images desde frontend/images (para tus imágenes del catálogo)
app.use('/images', express.static(path.join(FRONTEND_DIR, 'images')));

// fallback SPA
app.get('/', (_req, res) => res.sendFile(path.join(FRONTEND_DIR, 'index.html')));
app.use((_req, res) => res.sendFile(path.join(FRONTEND_DIR, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
