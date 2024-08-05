import express from 'express';
import {
  addComment,
  deleteComment,
  getCommentsByPostId,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add a comment to a post (protected route)
router.get('/:postId', getCommentsByPostId);

// Add a comment to a post (protected route)
router.post('/:postId', protect, addComment);

// Delete a comment from a post (protected route)
router.delete('/:postId/:commentId', protect, deleteComment);

export default router;
