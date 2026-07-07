const express = require('express');
const multer = require('multer');
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const urls = [];

    for (const file of req.files || []) {
      const filePath = `product-images/${Date.now()}_${file.originalname}`;
      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
      urls.push(urlData.publicUrl);
    }

    res.json({ urls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
