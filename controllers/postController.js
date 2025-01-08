import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import upload from '../config/multerConfig.js';
import cloudinary from "../config/cloudinaryConfig.js";

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("user", "name");
  res.json(posts);
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
// Create a new post
// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;

  let imageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  // Check if an image URL is provided in the request body
  if (image) {
    imageUrl = image;
  }
  // If an image file is provided, upload it to Cloudinary
  else if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url;
  }

  const post = new Post({
    user: req.user._id,
    title,
    content,
    image: imageUrl,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Get a post by ID
// @route   GET /api/posts/:id
// @access  Public

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", "name");
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to update this post");
    }

    if (image) {
      post.image = image;
    } else if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      post.image = result.secure_url;
    }

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to delete this post");
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});
export { getPosts, createPost, getPostById, updatePost, deletePost };
