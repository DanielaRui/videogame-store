const express = require('express');
const router = express.Router();
const admin = require('../firebase');
const db = admin.firestore();

// GET /api/products -> lista
router.get('/', async (_req, res) => {
  try {
    const snap = await db.collection('products').get();
    const items = snap.docs.map(doc => {
      const d = doc.data();
      return {
        sku: doc.id,
        name: d.name,
        description: d.description || '',
        currency: d.currency || 'USD',
        image: d.image || d.Image || '', // por si dejaste "Image"
        price: typeof d.price === 'number' ? d.price.toFixed(2) : (d.price || '0.00'),
      };
    });
    res.json(items);
  } catch (err) {
    console.error('Firestore list error:', err);
    res.status(500).json({ error: 'No se pudieron cargar productos' });
  }
});

// GET /api/products/:sku -> detalle
router.get('/:sku', async (req, res) => {
  try {
    const ref = db.collection('products').doc(req.params.sku);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Producto no encontrado' });

    const d = doc.data();
    res.json({
      sku: doc.id,
      name: d.name,
      description: d.description || '',
      currency: d.currency || 'USD',
      image: d.image || d.Image || '',
      price: typeof d.price === 'number' ? d.price.toFixed(2) : (d.price || '0.00'),
    });
  } catch (err) {
    console.error('Firestore get error:', err);
    res.status(500).json({ error: 'No se pudo cargar el producto' });
  }
});

module.exports = router;
