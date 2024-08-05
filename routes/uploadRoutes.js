import express from 'express';
import multer from '../config/multerConfig.js';
import cloudinary from '../config/cloudinaryConfig.js';
const router = express.Router();

// Upload image to Cloudinary
router.post('/', multer.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

export default router;
