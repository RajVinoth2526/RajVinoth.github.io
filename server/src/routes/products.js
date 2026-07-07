const express = require('express');
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');
const { toCamelCaseProduct, toCamelCaseCategory, toCamelCaseSlider } = require('../utils/mappers');

const router = express.Router();

// GET products with pagination and filters
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const cursor = req.query.cursor;
    const { category, subCategory, type } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) query = query.eq('category', category);
    if (subCategory) query = query.eq('sub_category', subCategory);
    if (type) query = query.eq('type', type);
    if (cursor) query = query.lt('created_at', cursor);

    const { data, error } = await query;
    if (error) throw error;

    const products = (data || []).map(toCamelCaseProduct);
    const lastCursor = products.length > 0 ? products[products.length - 1]._cursor : null;

    res.json({ data: products, hasMore: products.length === limit, cursor: lastCursor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
router.get('/item/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', req.params.id)
      .single();

    if (error) throw error;
    res.json(toCamelCaseProduct(data));
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
});

// POST create product (admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const body = req.body;
    const row = {
      title: body.title,
      sku: body.sku,
      label: body.label,
      stock_quantity: body.stockQuantity,
      price: body.price,
      compare_at_price: body.compareAtPrice,
      discount_percentage: body.discountPercentage,
      colors: body.colors,
      colors_array: body.colorsArray,
      size: body.size,
      material: body.material,
      weight: body.weight,
      dimensions: body.dimensions,
      description: body.description,
      specification: body.specification,
      care_instructions: body.careInstructions,
      category: body.category,
      sub_category: body.subCategory,
      type: body.type,
      tags: body.tags,
      seo_title: body.seoTitle,
      seo_description: body.seoDescription,
      is_active: body.isActive ?? true,
      is_featured: body.isFeatured ?? false,
      image_url: body.imageUrl,
      default_image_index: body.defaultImageIndex ?? 0
    };

    const { data, error } = await supabase.from('products').insert(row).select().single();
    if (error) throw error;
    res.status(201).json(toCamelCaseProduct(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete('/item/:id', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('product_id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(toCamelCaseCategory));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categories', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').insert({
      title: req.body.title,
      category: req.body.category,
      image_url: req.body.imageUrl
    }).select().single();
    if (error) throw error;
    res.status(201).json(toCamelCaseCategory(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/categories/:id', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('categories').delete().eq('product_id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sliders
router.get('/sliders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('sliders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(toCamelCaseSlider));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sliders', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('sliders').insert({
      title: req.body.title,
      sub_title: req.body.subTitle,
      specification: req.body.specification,
      colors: req.body.colors,
      category: req.body.category,
      contant: req.body.contant,
      image_url: req.body.imageUrl
    }).select().single();
    if (error) throw error;
    res.status(201).json(toCamelCaseSlider(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/sliders/:id', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('sliders').delete().eq('product_id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
