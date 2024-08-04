const express = require('express');
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require('../middleware/auth');
const mainRouter = express.Router();

mainRouter.get('/', checkAuthenticated, (req, res) => {
  console.log('index 페이지 호출');
  res.render('index', { title: 'My new Homepage' });
});

mainRouter.get('/login', checkNotAuthenticated, (req, res) => {
  console.log('signin 페이지 호출');
  res.render('auth/login');
});

mainRouter.get('/signup', checkNotAuthenticated, (req, res) => {
  console.log('signup 페이지 호출');
  res.render('auth/signup');
});

module.exports = mainRouter;
