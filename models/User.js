const pool = require('../db');

// Create a new user
const createUser = async (userData) => {
  const query = `
    INSERT INTO users (
      email, password, first_name, middle_name, last_name, dob, phone_number, address, country, state, city,
      aadhaar_no, reg_number, year_of_joining, graduation_year, branch, cgpa, max_cgpa, placed_in_campus,
      company_name, package, job_role, current_job_title, current_company_name, current_salary,
      linkedin_profile_url, technology_expertise, domain_knowledge, contribution_towards_college,
      suggestions, other_information, alumni_id, photo
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33
    ) RETURNING *;
  `;
  const values = [
    userData.email, userData.password, userData.first_name, userData.middle_name, userData.last_name,
    userData.dob, userData.phone_number, userData.address, userData.country, userData.state, userData.city,
    userData.aadhaar_no, userData.reg_number, userData.year_of_joining, userData.graduation_year,
    userData.branch, userData.cgpa, userData.max_cgpa, userData.placed_in_campus, userData.company_name,
    userData.package, userData.job_role, userData.current_job_title, userData.current_company_name,
    userData.current_salary, userData.linkedin_profile_url, userData.technology_expertise,
    userData.domain_knowledge, userData.contribution_towards_college, // Pass as array
    userData.suggestions, userData.other_information, userData.alumniId, userData.photo
  ];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

// Get a user by email
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await pool.query(query, [email]);
    console.log(result.rows[0]);
    return result.rows[0]; // Return the user if found, otherwise return undefined
  } catch (error) {
    console.error('Error in getUser ByEmail:', error);
    throw error;
  }
};

const getUserDetails = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await pool.query(query, [email]);
    console.log(result.rows[0]);
    return result.rows[0]; // Return the user if found, otherwise return undefined
  } catch (error) {
    console.error('Error in getUser ByEmail:', error);
    throw error;
  }
};

module.exports = { createUser , getUserByEmail ,getUserDetails};