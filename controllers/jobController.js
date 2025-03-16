const Job = require('../models/jobModel');

// Add a new job posting
exports.addJob = async (req, res) => {
  try {
    const jobData = {
      logo: req.file.buffer, // Logo as binary data
      company_name: req.body.company_name,
      package: req.body.package,
      job_role: req.body.job_role,
      no_of_openings: req.body.no_of_openings,
      job_description: req.body.job_description,
      eligible_candidates: req.body.eligible_candidates,
      skills_required: req.body.skills_required,
      apply_link: req.body.apply_link,
      posted_by: req.body.posted_by,
      location: req.body.location, // New field
      experience_level: req.body.experience_level, // New field
      application_deadline: req.body.application_deadline // New field
    };

    const newJob = await Job.addJob(jobData);
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Failed to add job posting' });
  }
};

// Fetch all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.getAllJobs();
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};



// Search jobs
exports.searchJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const jobs = await Job.searchJobs(keyword);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
};