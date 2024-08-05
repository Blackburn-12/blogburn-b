import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.postId);

  if (post) {
    const comment = new Comment({
      user: req.user._id,
      post: req.params.postId,
      text,
    });

    const createdComment = await comment.save();

    post.comments.push(createdComment._id);
    await post.save();

    res.status(201).json(createdComment);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});
// @desc    Delete a comment from a post
// @route   DELETE /api/comments/:postId/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (post) {
    const comment = await Comment.findById(req.params.commentId);
    
    if (comment) {
      if (comment.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to delete this comment');
      }

      await Comment.findByIdAndDelete(req.params.commentId);
      post.comments = post.comments.filter(c => c.toString() !== req.params.commentId);
      await post.save();
      
      res.json({ message: 'Comment removed' });
    } else {
      res.status(404);
      throw new Error('Comment not found');
    }
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Fetch comments for a specific post
// @route   GET /api/comments/:postId
// @access  Public
const getCommentsByPostId = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('user', 'name');

  if (comments) {
    res.json(comments);
  } else {
    res.status(404);
    throw new Error('Comments not found');
  }
});

export { addComment, deleteComment, getCommentsByPostId };
