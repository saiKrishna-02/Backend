const Event = require('../models/eventModel');

// Add a new event
exports.addEvent = async (req, res) => {
  try {
    const eventData = {
      logo: req.file.buffer, // Logo as binary data
      event_name: req.body.event_name,
      event_description: req.body.event_description,
      event_date: req.body.event_date,
      event_link: req.body.event_link,
      posted_by: req.body.posted_by,
    };

    const newEvent = await Event.addEvent(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Failed to add event' });
  }
};

// Fetch all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Search events
exports.searchEvents = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const events = await Event.searchEvents(keyword);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({ error: 'Failed to search events' });
  }
};