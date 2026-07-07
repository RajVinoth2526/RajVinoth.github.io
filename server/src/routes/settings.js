const express = require('express');
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET theme
router.get('/theme', async (req, res) => {
  try {
    const { data, error } = await supabase.from('theme_settings').select('*').eq('id', 'default').single();
    if (error) throw error;
    res.json([{ primaryColor: data.primary_color, secondaryColor: data.secondary_color }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT theme
router.put('/theme', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('theme_settings')
      .upsert({
        id: 'default',
        primary_color: req.body.primaryColor,
        secondary_color: req.body.secondaryColor,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.json([{ primaryColor: data.primary_color, secondaryColor: data.secondary_color }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET shop name
router.get('/shop', async (req, res) => {
  try {
    const { data, error } = await supabase.from('shop_settings').select('*').eq('id', 'default').single();
    if (error) throw error;
    res.json([{ shopName: data.shop_name }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT shop name
router.put('/shop', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shop_settings')
      .upsert({
        id: 'default',
        shop_name: req.body.shopName,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.json([{ shopName: data.shop_name }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET contact details
router.get('/contact', async (req, res) => {
  try {
    const { data, error } = await supabase.from('contact_details').select('*').eq('id', 'default').single();
    if (error) throw error;
    res.json([{
      email: data.email,
      phoneNumber: data.phone_number,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      country: data.country
    }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT contact details
router.put('/contact', requireAuth, async (req, res) => {
  try {
    const body = req.body;
    const { data, error } = await supabase
      .from('contact_details')
      .upsert({
        id: 'default',
        email: body.email,
        phone_number: body.phoneNumber,
        address: body.address,
        city: body.city,
        state: body.state,
        postal_code: body.postalCode,
        country: body.country,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.json([{
      email: data.email,
      phoneNumber: data.phone_number,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      country: data.country
    }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
