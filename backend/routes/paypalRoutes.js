// backend/routes/paypalRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('../firebase');
const db = admin.firestore();
const { createOrder, captureOrder } = require('../lib/paypal');

// Exponer clientId al frontend
router.get('/config', (_req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID, mode: process.env.PAYPAL_MODE || 'sandbox' });
});

// Crear orden a partir del SKU (precio validado en backend)
router.post('/create-order', async (req, res) => {
  try {
    const { sku } = req.body;
    if (!sku) return res.status(400).json({ error: 'SKU requerido' });

    const doc = await db.collection('products').doc(sku).get();
    if (!doc.exists) return res.status(404).json({ error: 'Producto no encontrado' });
    const p = doc.data();

    const amount = typeof p.price === 'number' ? p.price.toFixed(2) : (p.price || '0.00');
    const currency = p.currency || 'USD';
    const description = `${p.name} (${sku})`;

    const order = await createOrder({ amount, currency, description });
    res.json({ id: order.id });
  } catch (err) {
    console.error('PayPal create-order:', err);
    res.status(500).json({ error: 'No se pudo crear la orden' });
  }
});

// Capturar orden después de aprobación
router.post('/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: 'orderID requerido' });

    const capture = await captureOrder(orderID);

    // TODO opcional: guardar orden en Firestore (orders) con detalles del capture
    // await db.collection('orders').add({ capture, createdAt: admin.firestore.FieldValue.serverTimestamp() });

    res.json(capture);
  } catch (err) {
    console.error('PayPal capture-order:', err);
    res.status(500).json({ error: 'No se pudo capturar la orden' });
  }
});

module.exports = router;
