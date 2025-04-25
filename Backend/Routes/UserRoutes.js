const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../Controllers/UserController');

router.post('/register', register);
router.post('/login', login);

router.get('/:id', (req, res, next) => {
  const { auth } = require('../middleware/auth');
  auth(req, res, getProfile);
});

module.exports = router;