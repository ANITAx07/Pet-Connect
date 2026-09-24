// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Create a post (with photo upload)
router.post('/', authMiddleware, uploadMiddleware.single('photo'), postController.createPost);

// Get all posts (public feed)
router.get('/', postController.getAllPosts);

// Get posts by logged-in user
router.get('/user', authMiddleware, postController.getUserPosts);

  // Delete a post by id
  router.delete('/:id', authMiddleware, postController.deletePost);

  // Update a post by id
  router.put('/:id', authMiddleware, uploadMiddleware.single('photo'), postController.updatePost);

  // Like a post
  router.post('/:id/like', authMiddleware, postController.likePost);

// Unlike a post
router.post('/:id/unlike', authMiddleware, postController.unlikePost);

// Add comment to a post
router.post('/:id/comment', authMiddleware, postController.addComment);

// Get a post by ID
router.get('/:id', authMiddleware, postController.getPostById);

// Delete a comment by commentId (only post owner can delete)
router.delete('/:postId/comment/:commentId', authMiddleware, postController.deleteComment);

module.exports = router;
