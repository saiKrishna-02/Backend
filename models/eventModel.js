const pool = require('../db'); // Import your database connection

const Event = {
  // Add a new event
  async addEvent(eventData) {
    const {
      logo,
      event_name,
      event_description,
      event_date,
      event_link,
      posted_by,
    } = eventData;

    const query = `
      INSERT INTO events (
        logo, event_name, event_description, event_date, event_link, posted_by
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      logo,
      event_name,
      event_description,
      event_date,
      event_link,
      posted_by,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Fetch all events
  async getAllEvents() {
    const query = `SELECT * FROM events;`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Search events by keyword
  async searchEvents(keyword) {
    const query = `
      SELECT * FROM events
      WHERE event_name ILIKE $1
      OR event_description ILIKE $1;
    `;
    try {
      const result = await pool.query(query, [`%${keyword}%`]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Event;