const express = require('express');
const { checkAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
  res.render('posts');
});

module.exports = router;
