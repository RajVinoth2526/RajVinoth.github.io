const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { token, total } = req.body;
    const username = process.env.CHECKOUT_USERNAME;
    const password = process.env.CHECKOUT_PASSWORD;

    if (!username || !password) {
      return res.status(500).json({ success: false, error: 'Payment credentials not configured' });
    }

    const paymentData = {
      merchantOrderId: Date.now().toString(),
      token,
      currency: 'LKR',
      total
    };

    const response = await axios.post(
      'https://sandbox.2checkout.com/rest/v1.0/payments/',
      paymentData,
      { auth: { username, password } }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Payment Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
