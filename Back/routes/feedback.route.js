const express = require('express');
const router = express.Router();
const { validatePassword } = require('../middleware/auth.middleware');
const {
  getFeedbacks,
  createFeedback,
  getFeedbackStats,
  updateFeedbackStatus
} = require('../controllers/feedback.controller');

// Routes publiques
router.get('/', getFeedbacks);
router.get('/stats', getFeedbackStats);
router.post('/', createFeedback);

// Routes protégées (modération)
router.patch('/:id/status', validatePassword, updateFeedbackStatus);

module.exports = router;