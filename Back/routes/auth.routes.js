const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth.middleware');
const { login, getProfile } = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/profile', authenticateAdmin, getProfile);

module.exports = router;