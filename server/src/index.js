require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authMiddleware } = require('./middleware/auth');

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const settingsRouter = require('./routes/settings');
const uploadRouter = require('./routes/upload');
const paymentRouter = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(authMiddleware);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'X-Mart API running' });
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payment', paymentRouter);

app.listen(PORT, () => {
  console.log(`X-Mart server running on http://localhost:${PORT}`);
});
