// controllers/postController.js
const Post = require('../models/Post');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const photo = req.file ? req.file.filename : null;
    const userId = req.user.userId;

    const newPost = new Post({
      user: userId,
      content,
      photo
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error });
  }
};

// Get all posts (public feed)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get posts', error });
  }
};

// Get posts by logged-in user
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({ user: userId })
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user posts', error });
  }
};

// Delete a post by id (only owner can delete)
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.user.equals(userId)) return res.status(403).json({ message: 'Unauthorized' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.some(like => like.toString() === userId)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(userId);
    await post.save();

    // Create notification for post owner if liker is not the owner
    if (post.user.toString() !== userId) {
      const liker = await User.findById(userId);
      const notification = new Notification({
        userId: post.user,
        type: 'like',
        message: `${liker.name} liked your post.`,
        postId: post._id
      });
      await notification.save();
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter(id => id.toString() !== userId);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to unlike post', error });
  }
};

// Add comment to a post
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, text });
    await post.save();

    // Create notification for post owner if commenter is not the owner
    if (post.user.toString() !== userId) {
      const commenter = await User.findById(userId);
      const notification = new Notification({
        userId: post.user,
        type: 'comment',
        message: `${commenter.name} commented on your post.`,
        postId: post._id
      });
      await notification.save();
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};

// Update a post by id (only owner can update)
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { content } = req.body;
    const photo = req.file ? req.file.filename : null;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.user.equals(userId)) return res.status(403).json({ message: 'Unauthorized' });

    post.content = content !== undefined ? content : post.content;
    if (photo !== null) {
      post.photo = photo;
    }
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error });
  }
};

// Delete a comment by commentId (only post owner can delete)
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.user.equals(userId)) {
      return res.status(403).json({ message: 'Unauthorized to delete comment' });
    }

    const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error });
  }
};

// Get a post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get post', error });
  }
};
