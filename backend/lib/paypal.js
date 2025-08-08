// backend/lib/paypal.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const base = (process.env.PAYPAL_MODE === 'live')
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const client = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${client}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) throw new Error(`PayPal token error ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function createOrder({ amount, currency, description }) {
  const accessToken = await getAccessToken();
  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: currency, value: amount }, description }]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`createOrder ${res.status}: ${data?.message || JSON.stringify(data)}`);
  return data;
}

async function captureOrder(orderId) {
  const accessToken = await getAccessToken();
  const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`captureOrder ${res.status}: ${data?.message || JSON.stringify(data)}`);
  return data;
}

module.exports = { createOrder, captureOrder };
