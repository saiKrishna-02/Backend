const Feedback = require('../models/feedbackModel');

// Add a new feedback
exports.addFeedback = async (req, res) => {
  try {
    console.log(req.body);
    const feedbackData = {
      comment: req.body.comment,
      rating: req.body.rating,
      posted_by: req.body.posted_by || 'Anonymous', // Optional posted_by
      category: req.body.category || 'Uncategorized', // Optional category
      attachment: req.body.attachment || null // Optional attachment
    };

    const newFeedback = await Feedback.addFeedback(feedbackData);
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
};

// Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.getAllFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};