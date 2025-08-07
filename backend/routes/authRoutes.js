const express = require('express');
const router = express.Router();
const admin = require('../firebase');

// Registrar usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password });
    res.json({ uid: user.uid, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
