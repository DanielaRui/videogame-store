// backend/controllers/authController.js
const admin = require('../firebase');

const registrarUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().createUser({
      email,
      password
    });
    res.json({ uid: user.uid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { registrarUsuario };
