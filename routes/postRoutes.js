import express from 'express';
import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';
const router = express.Router();

// Get all posts
router.get('/', getPosts);

// Create a new post (protected route)
router.post('/', protect, upload.single('image'), createPost);

// Get a single post by ID
router.get('/:id', getPostById);

// Update a post by ID (protected route)
router.put('/:id', protect,upload.single('image'), updatePost);

// Delete a post by ID (protected route)
router.delete('/:id', protect, deletePost);

export default router;
