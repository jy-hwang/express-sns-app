const express = require('express');
const router = express.Router();

const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
const { checkAuthenticated } = require('../middleware/auth');

router.put('/posts/:id/like', checkAuthenticated, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.likes.find(like => like === req.user._id.toString())) {
        console.log(post.likes);
        const updatedLikes = post.likes.filter(
          like => like !== req.user._id.toString(),
        );
        Post.findByIdAndUpdate(post._id, { likes: updatedLikes })
          .then(() => {
            req.flash('success', '좋아요를 업데이트 했습니다.');
            res.redirect('back');
          })
          .catch(err => {
            req.flash(
              'error',
              '좋아요를 업데이트하는 중에 오류가 발생했습니다.',
            );
            res.redirect('back');
          });
      } else {
        // 처음 좋아요를 누른 경우
        Post.findByIdAndUpdate(post._id, {
          likes: post.likes.concat([req.user._id]),
        })
          .then(() => {
            req.flash('success', '좋아요를 업데이트 했습니다.');
            res.redirect('back');
          })
          .catch(err => {
            req.flash(
              'error',
              '좋아요를 업데이트하는 중에 오류가 발생했습니다.',
            );
            res.redirect('back');
          });
      }
    })
    .catch(err => {
      req.flash('error', '게시물을 찾지 못했습니다.');
      res.redirect('back');
    });
});

module.exports = router;
