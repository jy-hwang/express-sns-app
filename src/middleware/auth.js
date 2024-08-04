const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/posts');
  }
  next();
}

function checkPostOwnerShip(req, res, next) {
  if (req.isAuthenticated()) {
    // id에 맞는 포스트가 있는 포스트인지 여부 확인
    Post.findById(req.params.id)
      .then(post => {
        // 포스트가 있는데 나의 포스트인지 확인
        if (post.author.id.equals(req.user._id)) {
          req.post = post;
          next();
        } else {
          req.flash('error', '권한이 없습니다..');
          res.redirect('back');
        }
      })
      .catch(err => {
        req.flash('error', '포스트가 없거나 오류가 발생했습니다.');
        res.redirect('back');
      });
  } else {
    req.flash('error', '로그인을 먼저 해주세요');
    res.redirect('/login');
  }
}

function checkCommentOwnerShip(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId)
      .then(comment => {
        // 내가 작성한 댓글인지 확인
        if (comment.author.id.equals(req.user._id)) {
          req.comment = comment;
          next();
        } else {
          req.flash('error', '권한이 없습니다.');
          res.redirect('back');
        }
      })
      .catch(err => {
        req.flash('error', '댓글을 찾는 도중에 오류가 발생했습니다.');
        res.redirect('back');
      });
  } else {
    req.flash('error', '로그인이 필요합니다.');
    res.redirect('/login');
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkPostOwnerShip,
  checkCommentOwnerShip,
};
