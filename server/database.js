const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config(); // For environment variable management

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bigworld',
  connectionLimit: 10, // Connection pooling
  waitForConnections: true,
  queueLimit: 0
});

// Enhanced table creation with more robust error handling
const createAdminTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE
      )
    `;
    await pool.query(query);
    console.log('Admin table ensured');
  } catch (error) {
    console.error('Error creating admin table:', error);
    throw error;
  }
};

// Enhanced admin addition with validation
const addAdmin = async (email, password) => {
  // Email validation
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Password strength check
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  try {
    // Check if admin already exists
    const [existingAdmin] = await pool.execute('SELECT * FROM admin WHERE email = ?', [email]);
    
    if (existingAdmin.length > 0) {
      throw new Error('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds
    const query = 'INSERT INTO admin (email, password) VALUES (?, ?)';
    await pool.execute(query, [email, hashedPassword]);
    
    return true;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
};

// Initialize database setup
const initializeDatabase = async () => {
  try {
    await createAdminTable();
    
    // Check if any admins exist, if not, create a default admin
    const [admins] = await pool.execute('SELECT * FROM admin');
    if (admins.length === 0) {
      console.log('No admins found. Creating default admin account...');
      try {
        await addAdmin('soumaya@gmail.com', 'azertyyy');
        console.log('Default admin account created successfully');
      } catch (error) {
        console.error('Error creating default admin:', error);
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }

};

initializeDatabase();

module.exports = { 
  pool, 
  addAdmin 
};





/*const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config(); // For environment variable management

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bigworld',
  connectionLimit: 10, // Connection pooling
  waitForConnections: true,
  queueLimit: 0
});

// Enhanced table creation with more robust error handling
const createAdminTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        verification_code VARCHAR(255) NULL 
      )
    `;
    await pool.query(query);
    console.log('Admin table ensured');
  } catch (error) {
    console.error('Error creating admin table:', error);
    throw error;
  }
};

// Enhanced admin addition with validation
const addAdmin = async (email, password) => {
  // Email validation
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Password strength check
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  try {
    // Check if admin already exists
    const [existingAdmin] = await pool.execute('SELECT * FROM admin WHERE email = ?', [email]);
    
    if (existingAdmin.length > 0) {
      throw new Error('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds
    const query = 'INSERT INTO admin (email, password) VALUES (?, ?)';
    await pool.execute(query, [email, hashedPassword]);
    
    console.log(`Admin created: ${email}`);
    return true;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
};

// Initialize database setup
const initializeDatabase = async () => {
  try {
    await createAdminTable();
    
    // Check if any admins exist, if not, create a default admin
    const [admins] = await pool.execute('SELECT * FROM admin');
    if (admins.length === 0) {
      console.log('No admins found. Creating default admin account...');
      try {
        await addAdmin('soumayaayadi40@gmail.com', 'ngtf ziqo jkbg ssbj');
        console.log('Default admin account created successfully');
      } catch (error) {
        console.error('Error creating default admin:', error);
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }

};

// Initialize the database
initializeDatabase();

module.exports = { 
  pool, 
  addAdmin 
};



EMAIL_USER=soumayaayadi40@gmail.com
EMAIL_PASS=ngtf ziqo jkbg ssbj
*/



