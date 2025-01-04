const Feedback = require('../models/feedback.model');

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getFeedbackStats = async (req, res) => {
  try {
    const [feedbacks, stats] = await Promise.all([
      Feedback.find(),
      Feedback.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalCount: { $sum: 1 },
            ratings: {
              $push: '$rating'
            }
          }
        }
      ])
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalCount: 0,
        ratingDistribution: {}
      });
    }

    // Calcul de la distribution des notes
    const ratingDistribution = feedbacks.reduce((acc, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, {});

    res.json({
      averageRating: stats[0].averageRating,
      totalCount: stats[0].totalCount,
      ratingDistribution
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Pour la modération 
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { verified: req.body.verified },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};