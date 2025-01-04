const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth.middleware');
const { getPhotos, updatePhotos } = require('../controllers/photo.controller');

router.get('/', getPhotos);
// router.put('/', authenticateAdmin, updatePhotos);

module.exports = router;