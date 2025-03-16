const pool = require('../db'); // Import your database connection

const Job = {
  // Add a new job posting
  async addJob(jobData) {
    const {
      logo,
      company_name,
      package,
      job_role,
      no_of_openings,
      job_description,
      eligible_candidates,
      skills_required,
      apply_link,
      posted_by,
      location, // New field
      experience_level, // New field
      application_deadline // New field
    } = jobData;

    const query = `
      INSERT INTO jobs (
        logo, company_name, package, job_role, no_of_openings, job_description,
        eligible_candidates, skills_required, apply_link, posted_by,
        location, experience_level, application_deadline
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    const values = [
      logo,
      company_name,
      package,
      job_role,
      no_of_openings,
      job_description,
      eligible_candidates,
      skills_required,
      apply_link,
      posted_by,
      location, // New field
      experience_level, // New field
      application_deadline // New field
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Fetch all jobs
  async getAllJobs() {
    const query = `SELECT * FROM jobs;`;
    try {
      const result = await pool.query(query);

      // Convert binary logo data to Base64
      const jobs = result.rows.map((job) => {
        if (job.logo) {
          job.logo = job.logo.toString('base64'); // Convert binary to Base64
        }
        return job;
      });

      return jobs;
    } catch (error) {
      throw error;
    }
  },

  // Search jobs by keyword
  async searchJobs(keyword) {
    const query = `
      SELECT * FROM jobs
      WHERE company_name ILIKE $1
      OR job_role ILIKE $1
      OR skills_required ILIKE $1;
    `;
    try {
      const result = await pool.query(query, [`%${keyword}%`]);

      // Convert binary logo data to Base64
      const jobs = result.rows.map((job) => {
        if (job.logo) {
          job.logo = job.logo.toString('base64'); // Convert binary to Base64
        }
        return job;
      });

      return jobs;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Job;