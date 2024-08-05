const express = require('express');
const { checkAuthenticated } = require('../middleware/auth');
const router = express.Router();
const User = require('../models/users.model');

router.get('/', checkAuthenticated, (req, res) => {
  User.find()
    .then(users => {
      res.render('friends', {
        users: users,
      });
    })
    .catch(err => {
      req.flash('error', '유저 목록을 가져오는데 에러가 발생했습니다.');
      res.redirect('/posts');
    });
});

module.exports = router;
