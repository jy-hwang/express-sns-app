const express = require('express');
const {
  checkAuthenticated,
  checkCommentOwnerShip,
} = require('../middleware/auth');
const router = express.Router({
  mergeParams: true,
});
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');

router.post('/', checkAuthenticated, (req, res) => {
  console.log(req.params.id);
  Post.findById(req.params.id)
    .then(post => {
      Comment.create(req.body)
        .then(comment => {
          // 생성한 댓글에 작성자 정보 넣어주기
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          // 포스트에 댓글 데이터 넣어주기
          post.comments.push(comment);
          post.save();
          req.flash('success', '댓글이 잘 생성되었습니다.');
        })
        .catch(err => {
          req.flash('error', '댓글을 생성 중 오류가 발생했습니다.');
          res.redirect('back');
        });
    })
    .catch(err => {
      req.flash(
        'error',
        '댓글을 생성 중 포스트를 찾지 못했거나, 오류가 발생했습니다.',
      );
    })
    .finally(() => {
      res.redirect('/posts');
    });
});

router.delete('/:commentId', checkCommentOwnerShip, (req, res) => {
  // 댓글을 찾은 후 삭제
  Comment.findByIdAndDelete(req.params.commentId)
    .then(() => {})
    .catch(err => {
      req.flash('error', '댓글을 삭제 중 오류가 발생했습니다.');
    })
    .finally(() => {
      res.redirect('back');
    });
});

module.exports = router;
