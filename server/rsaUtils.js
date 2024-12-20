
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Secure key generation and storage
function generateAndStoreKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // Increased key size for better security
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc', // Optional encryption of private key
      passphrase: process.env.KEY_ENCRYPTION_PASSPHRASE
    }
  });

  // Ensure keys directory exists
  const keysDir = path.join(__dirname, 'keys');
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir);
  }

  // Store keys securely
  fs.writeFileSync(path.join(keysDir, 'public_key.pem'), publicKey);
  fs.writeFileSync(path.join(keysDir, 'private_key.pem'), privateKey);

  return { publicKey, privateKey };
}

// Read stored public key
function getPublicKey() {
  try {
    return fs.readFileSync(path.join(__dirname, 'keys', 'public_key.pem'), 'utf8');
  } catch (error) {
    console.error('Public key not found. Generating new key pair.');
    return generateAndStoreKeyPair().publicKey;
  }
}

// Read stored private key
function getPrivateKey() {
  try {
    return fs.readFileSync(path.join(__dirname, 'keys', 'private_key.pem'), 'utf8');
  } catch (error) {
    console.error('Private key not found. Generating new key pair.');
    return generateAndStoreKeyPair().privateKey;
  }
}

// Enhanced encryption with error handling
function encrypt(data, publicKey) {
  try {
    const buffer = Buffer.from(JSON.stringify(data), 'utf8');
    return crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      buffer
    ).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Enhanced decryption with error handling
function decrypt(encryptedData, privateKey) {
  try {
    // Décoder les données de base64
    const buffer = Buffer.from(encryptedData, 'base64');
    
    // Déchiffrement
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      buffer
    );
    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}



module.exports = { 
  encrypt, 
  decrypt, 
  generateAndStoreKeyPair,
  getPublicKey,
  getPrivateKey 
};























/*const crypto = require('crypto');

// Générer des clés RSA
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  return { publicKey, privateKey };
}

// Chiffrer les données
function encrypt(data, publicKey) {
  return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
}

// Déchiffrer les données
function decrypt(encryptedData, privateKey) {
  return crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString();
}

module.exports = { encrypt, decrypt, generateKeyPair };




*/