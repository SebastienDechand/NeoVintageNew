const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
  authorInitials: {
    type: String,
    required: true,
    maxLength: 3
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  productName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true,
    minLength: 10
  },
  date: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema, 'Feedback');