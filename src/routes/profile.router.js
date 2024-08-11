const express = require('express');
const { checkAuthenticated, checkIsMe } = require('../middleware/auth');
const router = express.Router({
  mergeParams: true,
});
const Post = require('../models/posts.model');
const User = require('../models/users.model');

router.get('/', checkAuthenticated, (req, res) => {
  Post.find({ 'author.id': req.params.id })
    .populate('comments')
    .sort({ createdAt: -1 })
    .then(posts => {
      User.findById(req.params.id)
        .then(user => {
          res.render('profile', {
            posts: posts,
            user: user,
          });
        })
        .catch(err => {
          req.flash('error', '없는 사용자 입니다.');
          res.redirect('/back');
        });

      req.flash;
    })
    .catch(err => {
      console.error(err);
      req.flash('error', '게시물을 가져오는 데에 실패했습니다.');
      res.redirect('/back');
    });
});

router.get('/edit', checkIsMe, (req, res) => {
  res.render('profile/edit', {
    user: req.user,
  });
});

router.put('/', checkIsMe, (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(_ => {
      req.flash('success', '사용자 정보를 수정하는 것에 성공했습니다.');
      res.redirect('/profile/' + req.params.id);
    })
    .catch(err => {
      console.error(err);
      req.flash('error', '사용자 정보를 수정하는 것에 실패했습니다.');
      res.redirect('/back');
    });
});

module.exports = router;
