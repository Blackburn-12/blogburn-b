// imageRouter.js
import express from 'express';
import multer from '../config/multerConfig.js';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs';
const router = express.Router();

// Upload image to Cloudinary
router.post('/', multer.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    
    // Clean up: remove file from local storage after upload to cloudinary
    fs.unlinkSync(req.file.path);
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    // Clean up on error if file exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

export default router;