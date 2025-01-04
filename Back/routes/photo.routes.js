const express = require('express');
const router = express.Router();
const { validatePassword } = require('../middleware/auth.middleware');
const { getPhotos, updatePhotos } = require('../controllers/photo.controller');

router.get('/', getPhotos);
router.put('/', validatePassword, updatePhotos);

module.exports = router;