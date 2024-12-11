const crypto = require('crypto');

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
