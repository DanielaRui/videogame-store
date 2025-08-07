const admin = require('../firebase');

(async () => {
  try {
    const email = `test_${Date.now()}@example.com`;
    const user = await admin.auth().createUser({ email, password: '12345678' });
    console.log('OK:', user.uid, user.email);
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.errorInfo || err);
    process.exit(1);
  }
})();
