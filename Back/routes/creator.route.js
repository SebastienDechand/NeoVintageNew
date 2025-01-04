const express = require('express');
const router = express.Router();
const { validatePassword } = require('../middleware/auth.middleware');
const { getCreators, updateCreators } = require('../controllers/creator.controller');

router.get('/', getCreators);
router.put('/', validatePassword, updateCreators);

module.exports = router;