const express = require('express');
const router  = express.Router();

//User Logon Route
router.get('/login', ((req, res) => {
  res.render('users/login');
}));

//User Register Route
router.get('/register', ((req, res) => {
  res.render('users/register');
}));

module.exports = router;