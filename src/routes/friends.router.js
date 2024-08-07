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
      req.flash('error', '유저 목록을 가져오는데 오류가 발생했습니다.');
      res.redirect('/posts');
    });
});

router.put('/:id/add-friend', checkAuthenticated, (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      // 상대방 유저의 friendsRequests 에 나의 아이디를 추가
      User.findByIdAndUpdate(user._id, {
        friendsRequests: user.friendsRequests.concat([req.user._id]),
      })
        .then(user => {
          req.flash('success', '친구 추가 요청을 성공했습니다.');
          res.redirect('back');
        })
        .catch(err => {
          req.flash('error', '친구 추가 요청을 하는데 오류가 발생했습니다.');
          res.redirect('back');
        });
    })
    .catch(err => {
      req.flash('error', '유저가 없거나 유저를 찾는데 오류가 발생했습니다.');
      res.redirect('back');
    });
});

router.put(
  '/:firstId/remove-friend-request/:secondId',
  checkAuthenticated,
  (req, res) => {
    User.findById(req.params.firstId)
      .then(user => {
        const filteredFriendsRequests = user.friendsRequests.filter(
          friendId => friendId !== req.params.secondId,
        );
        User.findByIdAndUpdate(user._id, {
          friendsRequests: filteredFriendsRequests,
        })
          .then(user => {
            req.flash('success', '친구 요청 거절했습니다.');
            res.redirect('back');
          })
          .catch(err => {
            req.flash('error', '친구 요청을 거절하는데 오류가 발생했습니다.');
            res.redirect('back');
          });
      })
      .catch(err => {
        req.flash('error', '유저를 찾지 못했습니다.');
        res.redirect('back');
      });
  },
);

router.put('/:id/accept-friend-request', checkAuthenticated, (req, res) => {
  console.log('req.params.id', req.params.id, ':id', req.params.firstId);
  User.findById(req.params.id)
    .then(senderUser => {
      User.findByIdAndUpdate(senderUser._id, {
        friends: senderUser.friends.concat([req.user._id]),
      })
        .then(user => {
          console.log('user', user);
          console.log('req.user.username', req.user.username);
          User.findByIdAndUpdate(req.user._id, {
            friends: req.user.friends.concat([senderUser._id]),
            friendsRequests: req.user.friendsRequests.filter(
              friendId => friendId !== senderUser._id.toString(),
            ),
          })
            .then(friend => {
              req.flash('success', '친구 추가를 성공했습니다.');
              res.redirect('back');
            })
            .catch(err => {
              req.flash('error', '친구를 추가하는 데 실패했습니다.');
              res.redirect('back');
            });
        })
        .catch(err => {
          req.flash('error', '친구를 추가하는 데 실패했습니다.');
          res.redirect('back');
        });
    })
    .catch(err => {
      req.flash('error', '유저를 찾지 못했습니다.');
      res.redirect('back');
    });
});

router.put('/:id/remove-friend', checkAuthenticated, (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      User.findByIdAndUpdate(user._id, {
        friends: user.friends.filter(
          friendId => friendId !== req.user._id.toString(),
        ),
      })
        .then(_ => {
          User.findByIdAndUpdate(req.user._id, {
            friends: req.user.friends.filter(
              friendId => friendId !== req.params.id.toString(),
            ),
          })
            .then(_ => {
              req.flash('success', '친구를 삭제했습니다.');
              res.redirect('back');
            })
            .catch(error => {
              req.flash('error', '친구를 삭제하는데 실패했습니다.');
              res.redirect('back');
            });
        })
        .catch(err => {
          req.flash('error', '친구를 삭제하는데 실패했습니다.');
          res.redirect('back');
        });
    })
    .catch(err => {
      req.flash('error', '유저를 찾는데 실패했습니다.');
      res.redirect('back');
    });
});

module.exports = router;
