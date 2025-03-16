const pool = require('../db'); // Import your database connection

const Feedback = {
  // Add a new feedback
  async addFeedback(feedbackData) {
    const { comment, rating, posted_by, category, attachment } = feedbackData;

    const query = `
      INSERT INTO feedback (comment, rating, posted_by, category, attachment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [comment, rating, posted_by, category, attachment];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get all feedbacks
  async getAllFeedbacks() {
    const query = `SELECT * FROM feedback;`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Feedback;