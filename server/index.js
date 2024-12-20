const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, addAdmin } = require('./database');
const bcrypt = require('bcrypt');
const { encrypt, decrypt, getPublicKey, getPrivateKey } = require('./rsaUtils');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json({
  limit: '10kb'
}));

app.use(async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({ message: 'Service unavailable' });
  }
});

// Admin login endpoint
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ? AND is_active = TRUE', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await pool.execute('UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [admin.id]);

    res.json({
      message: 'Login successful',
      token: generateJWT(admin),
      email: admin.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify admin password endpoint
app.post('/verify-admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ? AND is_active = TRUE', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Verification successful' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add user endpoint
app.post('/add-user', async (req, res) => {
  const { name, email, sensitiveData } = req.body;

  if (!name || !email || !sensitiveData) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const publicKey = getPublicKey();
    const encryptedSensitiveData = encrypt(sensitiveData, publicKey);

    console.log('Encrypted Data:', encryptedSensitiveData);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, sensitiveData) VALUES (?, ?, ?)',
      [name, email, encryptedSensitiveData]
    );

    res.json({
      message: 'Patient added successfully!',
      id: result.insertId
    });
  } catch (error) {
    console.error('User addition error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users endpoint
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    const privateKey = getPrivateKey();

    const decryptedUsers = rows.map(user => {
      try {
        return {
          ...user,
          sensitiveData: decrypt(user.sensitiveData, privateKey),
        };
      } catch (error) {
        console.error(`Decryption failed for user ID ${user.id}:`, error);
        return { ...user, sensitiveData: null }; // Return user with null sensitive data if decryption fails
      }
    });

    res.json(decryptedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user endpoint
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, sensitiveData } = req.body;

  try {
    const publicKey = getPublicKey();
    const encryptedSensitiveData = encrypt(sensitiveData, publicKey);

    await pool.execute(
      'UPDATE users SET name = ?, email = ?, sensitiveData = ? WHERE id = ?',
      [name, email, encryptedSensitiveData, id]
    );

    res.json({ message: 'Patient updated successfully!' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user endpoint
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Patient deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

function generateJWT(admin) {
  // Implement JWT token generation
  return 'placeholder-jwt-token';
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;








/*const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, addAdmin } = require('./database');
const bcrypt = require('bcrypt');
const { encrypt, getPublicKey } = require('./rsaUtils');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enhanced security middleware
app.use(helmet()); // Adds various HTTP headers for security

// CORS configuration with more strict settings
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({
  limit: '10kb' // Prevent large payloads
}));

// Database connection check middleware
app.use(async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({ message: 'Service unavailable' });
  }
});

// Enhanced admin login endpoint
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ? AND is_active = TRUE', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login timestamp
    await pool.execute('UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [admin.id]);

    res.json({ 
      message: 'Login successful', 
      token: generateJWT(admin) // Implement JWT generation
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhanced user addition endpoint with encryption
app.post('/add-user', async (req, res) => {
  const { name, email, sensitiveData } = req.body;

  if (!name || !email || !sensitiveData) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const publicKey = getPublicKey(); // Get current public key
    const encryptedSensitiveData = encrypt(sensitiveData, publicKey);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, sensitiveData) VALUES (?, ?, ?)', 
      [name, email, encryptedSensitiveData]
    );

    res.json({ 
      message: 'Patient added successfully!', 
      id: result.insertId 
    });

  } catch (error) {
    console.error('User addition error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Placeholder for JWT generation (you'll need to implement this)
function generateJWT(admin) {
  // Implement JWT token generation
  return 'placeholder-jwt-token';
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;*/










/*
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, addAdmin } = require('./database');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // To send email verification code
const crypto = require('crypto'); // For generating random codes
const { encrypt, getPublicKey } = require('./rsaUtils');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enhanced security middleware
app.use(helmet()); // Adds various HTTP headers for security

// CORS configuration with more strict settings
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({
  limit: '10kb' // Prevent large payloads
}));

// Database connection check middleware
app.use(async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({ message: 'Service unavailable' });
  }
});

// Utility function to send verification code via email
const sendVerificationCode = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Your Gmail email address
      pass: process.env.EMAIL_PASS   // The App Password you generated
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Admin Login Verification Code',
    text: `Your verification code is: ${code}`
  };

  return transporter.sendMail(mailOptions);
};

// Generate a random verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-character hex code
};

// Admin login with email verification
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ? AND is_active = TRUE', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate verification code and send to the admin's email
    const verificationCode = generateVerificationCode();
    await sendVerificationCode(email, verificationCode);

    // Save the code in the session or database (for verification later)
    // You can store it in a temporary database or in-memory for session validation
    await pool.execute('UPDATE admin SET verification_code = ? WHERE id = ?', [verificationCode, admin.id]);

    res.json({ message: 'Login successful. Please check your email for the verification code.' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to verify the code sent via email
app.post('/verify-code', async (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ? AND verification_code = ?', [email, verificationCode]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid verification code' });
    }

    const admin = rows[0];

    // Successfully verified, you can generate JWT or grant access
    res.json({ message: 'Verification successful' });

  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhanced user addition endpoint with encryption
app.post('/add-user', async (req, res) => {
  const { name, email, sensitiveData } = req.body;

  if (!name || !email || !sensitiveData) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const publicKey = getPublicKey(); // Get current public key
    const encryptedSensitiveData = encrypt(sensitiveData, publicKey);

    const query = 'INSERT INTO users (name, email, sensitiveData) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [name, email, encryptedSensitiveData]);

    res.json({ 
      message: 'Patient added successfully!', 
      id: result.insertId 
    });

  } catch (error) {
    console.error('User addition error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Placeholder for JWT generation (you'll need to implement this)
function generateJWT(admin) {
  // Implement JWT token generation
  return 'placeholder-jwt-token';
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;*/

























































