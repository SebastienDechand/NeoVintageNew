const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth.middleware');
const { getCreators, updateCreators } = require('../controllers/creator.controller');

router.get('/', getCreators);
router.put('/', authenticateAdmin, updateCreators);

module.exports = router;