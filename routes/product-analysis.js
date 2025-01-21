const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeProductImage } = require('../product-image-processor');

// Configure multer for image upload
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const customPrompt = req.body.prompt; // Optional custom prompt
    const analysis = await analyzeProductImage(req.file, customPrompt);
    
    res.json({ analysis });
    
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

module.exports = router; 