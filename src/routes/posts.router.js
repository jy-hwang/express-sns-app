const express = require('express');
const multer = require('multer');
const { checkAuthenticated } = require('../middleware/auth');
const router = express.Router();
const Post = require('../models/posts.model');
const path = require('path');
const Comment = require('../models/comments.model');

const storageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/assets/images'));
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storageEngine }).single('image');

router.post('/', checkAuthenticated, upload, (req, res, next) => {
  let desc = req.body.desc;
  let image = req.file ? req.file.filename : '';

  Post.create({
    image: image,
    description: desc,
    author: {
      id: req.user._id,
      username: req.user.username,
    },
  })
    .then(post => {
      res.redirect('back');
    })
    .catch(err => {
      next(err);
    });
});

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
