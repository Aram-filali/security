

const express = require('express');
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
      message: 'User added successfully!', 
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

module.exports = app;


















































/*const express = require('express');
const cors = require('cors');
const { pool, addAdmin } = require('./database');
const bcrypt = require('bcrypt');  // For password comparison

const app = express();
const port = 3000;

// Middleware pour permettre les requêtes CORS
app.use(cors({
  origin: 'http://192.168.44.247:8081', // Remplacez par l'adresse de votre frontend Expo
}));

// Autres middlewares
app.use(express.json());  // Pour analyser le JSON des requêtes

// Vérification de la connexion à la base de données
pool.query('SELECT 1')
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données :', error);
  });

// Admin login endpoint
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email not found' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If login is successful, respond with a success message
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint pour ajouter un utilisateur
app.post('/add-user', async (req, res) => {
  const { name, email, sensitiveData } = req.body;

  try {
    const encryptedSensitiveData = encrypt(sensitiveData, publicKey);
    const [result] = await pool.execute('INSERT INTO users (name, email, sensitiveData) VALUES (?, ?, ?)', [name, email, encryptedSensitiveData]);

    res.json({ message: 'Utilisateur ajouté avec succès!', id: result.insertId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

*/