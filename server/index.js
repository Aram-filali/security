const express = require('express');
const cors = require('cors');
const { pool } = require('./database');
const { encrypt, decrypt, generateKeyPair } = require('./rsaUtils');  // Importation des fonctions RSA
const app = express();
const port = 3000;

// Middleware pour permettre les requêtes CORS
app.use(cors({
  origin: 'http://192.168.1.24:8081', // Remplacez par l'adresse de votre frontend Expo
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

// Générer les clés RSA (à faire de manière sécurisée en production)
const { publicKey, privateKey } = generateKeyPair(); 

// Endpoint pour ajouter un utilisateur
app.post('/add-user', async (req, res) => {
  const { name, email, sensitiveData } = req.body;

  try {
    // Chiffrement des données sensibles avant de les insérer dans la base
    const encryptedSensitiveData = encrypt(sensitiveData, publicKey);

    // Insertion des données dans la base de données
    const [result] = await pool.execute('INSERT INTO users (name, email, sensitiveData) VALUES (?, ?, ?)', [name, email, encryptedSensitiveData]);

    res.json({ message: 'Utilisateur ajouté avec succès!', id: result.insertId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Exemple d'endpoint pour récupérer les données déchiffrées
app.get('/decrypt-user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = rows[0];
    
    // Déchiffrement des données sensibles avec la clé privée
    const decryptedSensitiveData = decrypt(user.sensitiveData, privateKey);

    res.json({
      name: user.name,
      email: user.email,
      sensitiveData: decryptedSensitiveData,
    });
  } catch (error) {
    console.error('Erreur lors du déchiffrement des données :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
