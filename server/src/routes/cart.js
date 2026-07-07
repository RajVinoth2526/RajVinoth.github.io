const express = require('express');
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');
const { toCamelCaseCartItem } = require('../utils/mappers');

const router = express.Router();

// GET cart items for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json((data || []).map(toCamelCaseCartItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add item to cart
router.post('/', requireAuth, async (req, res) => {
  try {
    const p = req.body;
    const row = {
      user_id: req.user.id,
      product_id: p.productId || p.id,
      image: p.image || (p.imageUrl && p.imageUrl[0]),
      name: p.name || p.title,
      price: p.price,
      size: p.size,
      quantity: p.quantity || 1,
      label: p.label,
      color: p.color,
      category: p.category,
      description: p.description
    };

    const { data, error } = await supabase
      .from('cart_items')
      .upsert(row, { onConflict: 'user_id,product_id' })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(toCamelCaseCartItem(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE cart item
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', req.params.productId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync local cart items after login
router.post('/sync', requireAuth, async (req, res) => {
  try {
    const items = req.body.items || [];

    for (const product of items) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', req.user.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from('cart_items').insert({
          user_id: req.user.id,
          product_id: product.id,
          image: product.image,
          name: product.name,
          price: product.price,
          size: product.size,
          quantity: product.quantity,
          label: product.label,
          color: product.color,
          category: product.category,
          description: product.description
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
