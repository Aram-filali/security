
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Secure key generation and storage
function generateAndStoreKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: process.env.KEY_ENCRYPTION_PASSPHRASE
    }
  });

  const keysDir = path.join(__dirname, 'keys');
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir);
  }

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

// Enhanced encryption with chunking for larger data
function encrypt(data, publicKey) {
  try {
    const dataString = JSON.stringify(data);
    const maxChunkSize = 446; // Maximum size for RSA-4096 with OAEP padding
    const chunks = [];

    for (let i = 0; i < dataString.length; i += maxChunkSize) {
      const chunk = dataString.slice(i, i + maxChunkSize);
      const encryptedChunk = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(chunk)
      );
      chunks.push(encryptedChunk.toString('base64'));
    }

    return JSON.stringify(chunks);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Enhanced decryption with chunk handling
function decrypt(encryptedData, privateKey) {
  try {
    console.log("Encrypted Data:", encryptedData); // Debug log
    const chunks = JSON.parse(encryptedData);
    let decryptedData = '';

    for (const chunk of chunks) {
      const buffer = Buffer.from(chunk, 'base64');
      const decryptedChunk = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
          passphrase: process.env.KEY_ENCRYPTION_PASSPHRASE
        },
        buffer
      );
      decryptedData += decryptedChunk.toString('utf8');
    }

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
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

/*
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
// Read stored private key
function getPrivateKey() {
  try {
    const privateKey = fs.readFileSync(path.join(__dirname, 'keys', 'private_key.pem'), 'utf8');
    console.log('Loaded Private Key:', privateKey); // Add this log here
    return privateKey;
  } catch (error) {
    console.error('Private key not found. Generating new key pair.');
    const newPrivateKey = generateAndStoreKeyPair().privateKey;
    console.log('Generated New Private Key:', newPrivateKey); // Log new private key if regenerated
    return newPrivateKey;
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
};*/























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