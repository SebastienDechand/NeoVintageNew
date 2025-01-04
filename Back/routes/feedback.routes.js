const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth.middleware');
const {
  getFeedbacks,
  createFeedback,
  getFeedbackStats,
  updateFeedbackStatus
} = require('../controllers/feedback.controller');

router.get('/', getFeedbacks);
router.get('/stats', getFeedbackStats);
router.post('/', createFeedback);

router.patch('/:id/status', authenticateAdmin, updateFeedbackStatus);

module.exports = router;