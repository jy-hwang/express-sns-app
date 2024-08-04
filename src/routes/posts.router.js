const express = require('express');
const multer = require('multer');
const {
  checkAuthenticated,
  checkPostOwnerShip,
} = require('../middleware/auth');
const router = express.Router();
const Post = require('../models/posts.model');
const path = require('path');
const Comment = require('../models/comments.model');

// 파일 업로드 위치 변경
const uploadDir = path.join(__dirname, '..', 'uploads', 'images');

const storageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
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
      req.flash('success', '포스트 생성 성공');
      res.redirect('back');
    })
    .catch(err => {
      req.flash('error', '포스트 생성 실패');
      res.redirect('back');
    });
});

router.get('/', checkAuthenticated, (req, res) => {
  Post.find()
    .populate('comments')
    .sort({ createdAt: -1 })
    .then(posts => {
      res.render('posts', {
        posts: posts,
      });
    })
    .catch(err => {
      console.error(err);
    });
});

router.get('/:id/edit', checkPostOwnerShip, (req, res) => {
  res.render('posts/edit', {
    post: req.post,
  });
});

router.put('/:id', checkPostOwnerShip, (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
    .then(post => {
      req.flash('success', '게시물 수정을 완료했습니다.');
      res.redirect('/posts');
    })
    .catch(err => {
      req.flash('error', '게시물을 수정하는 중에 오류가 발생했습니다.');
      res.redirect('/posts');
    });
});

module.exports = router;
