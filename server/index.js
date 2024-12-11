const express = require('express');
const cors = require('cors');
const { pool } = require('./database');  // Assurez-vous d'importer la connexion à la base de données
const app = express();
const port = 3000;

// Middleware pour permettre les requêtes CORS
app.use(cors({
  origin: 'http://localhost:8100', // Remplacez par l'adresse de votre frontend Expo
}));

// Autres middlewares
app.use(express.json());  // Pour analyser le JSON des requêtes

// Endpoint pour ajouter un utilisateur à la base de données
app.post('/add-user', async (req, res) => {
  const { name, email, sensitiveData } = req.body;

  // Connexion à la base de données et insertion
  try {
    const [rows] = await pool.query('INSERT INTO users (name, email, sensitiveData) VALUES (?, ?, ?)', [name, email, sensitiveData]);

    // Si l'insertion réussit, on renvoie une réponse de succès
    res.json({ message: 'Utilisateur ajouté avec succès!' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
