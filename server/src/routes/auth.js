const express = require('express');
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');
const { toCamelCaseProfile } = require('../utils/mappers');

const router = express.Router();

// GET user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(toCamelCaseProfile(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update profile (register / profile update)
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const body = req.body;
    const row = {
      id: req.user.id,
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email || req.user.email,
      phone: body.phone,
      country: body.country,
      address1: body.address1,
      address2: body.address2,
      city: body.city,
      state: body.state,
      postal_code: body.postalCode,
      birthday: body.birthday
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(row)
      .select()
      .single();

    if (error) throw error;
    res.json(toCamelCaseProfile(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
