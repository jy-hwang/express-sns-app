const express = require('express');
const { checkAuthenticated } = require('../middleware/auth');
const router = express.Router();
const Post = require('../models/posts.model');
router.get('/', checkAuthenticated, (req, res) => {
  Post.find()
    .populate('comments')
    .sort({ createdAt: -1 })
    .then(posts => {
      res.render('posts', {
        posts: posts,
        currentUser: req.user,
      });
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
