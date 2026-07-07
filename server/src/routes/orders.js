const express = require('express');
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');
const { toCamelCaseOrder } = require('../utils/mappers');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// GET all orders (admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((data || []).map(toCamelCaseOrder));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET orders by user
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((data || []).map(toCamelCaseOrder));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order
router.get('/:orderId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', req.params.orderId)
      .single();

    if (error) throw error;
    res.json(toCamelCaseOrder(data));
  } catch (err) {
    res.status(404).json({ error: 'Order not found' });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const { cart, customer, paymentMethod } = req.body;
    const orderId = uuidv4();
    const userId = req.user?.id || null;

    const row = {
      order_id: orderId,
      user_id: userId,
      card_items: cart,
      customer_details: customer,
      payment_method: paymentMethod
    };

    const { data, error } = await supabase.from('orders').insert(row).select().single();
    if (error) throw error;

    // Clear cart items for logged-in user
    if (userId) {
      const productIds = (cart || []).map((item) => item.id).filter(Boolean);
      for (const productId of productIds) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
      }
    }

    res.status(201).json(toCamelCaseOrder(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update order
router.put('/:orderId', requireAuth, async (req, res) => {
  try {
    const body = req.body;
    const row = {
      card_items: body.cardItems || body.card,
      customer_details: body.customerDetails,
      payment_method: body.paymentMethod
    };

    const { data, error } = await supabase
      .from('orders')
      .update(row)
      .eq('order_id', req.params.orderId)
      .select()
      .single();

    if (error) throw error;
    res.json(toCamelCaseOrder(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
