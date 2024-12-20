// test-encryption.js
const { encrypt, decrypt, getPublicKey, getPrivateKey } = require('./rsaUtils');
const { pool, addAdmin } = require('./database');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

async function testEncryptionOnly() {
  try {
    const testData = {
      name: "Test Patient",
      condition: "Test Condition",
      notes: "Very long notes about the patient..."
    };

    const publicKey = getPublicKey();
    const privateKey = getPrivateKey();

    console.log('1. Testing encryption...');
    const encrypted = encrypt(testData, publicKey);
    console.log('Encryption successful!');

    console.log('2. Testing decryption...');
    const decrypted = decrypt(encrypted, privateKey);
    console.log('Decryption successful!');

    console.log('3. Verifying data integrity...');
    const isSuccess = JSON.stringify(testData) === JSON.stringify(decrypted);
    console.log('Test successful:', isSuccess);
    return isSuccess;
  } catch (error) {
    console.error('Encryption/Decryption test failed:', error);
    return false;
  }
}

async function testDatabaseOperations() {
  try {
    console.log('Testing database operations...');
    
    // Test data
    const testUser = {
      name: "Test Patient DB",
      email: "test@example.com",
      sensitiveData: {
        condition: "Test Condition",
        notes: "Test notes for database operation",
        medications: ["Test Med 1", "Test Med 2"]
      }
    };

    // 1. Insert test user
    console.log('1. Testing user insertion...');
    const publicKey = getPublicKey();
    const encryptedData = encrypt(testUser.sensitiveData, publicKey);
    
    const [insertResult] = await pool.execute(
      'INSERT INTO users (name, email, sensitiveData) VALUES (?, ?, ?)',
      [testUser.name, testUser.email, encryptedData]
    );
    
    const insertedId = insertResult.insertId;
    console.log('User inserted successfully with ID:', insertedId);

    // 2. Retrieve and decrypt
    console.log('2. Testing user retrieval and decryption...');
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [insertedId]);
    
    if (rows.length === 0) {
      throw new Error('Inserted user not found');
    }

    const privateKey = getPrivateKey();
    const decryptedData = decrypt(rows[0].sensitiveData, privateKey);
    
    console.log('3. Verifying retrieved data...');
    const isDataValid = JSON.stringify(testUser.sensitiveData) === JSON.stringify(decryptedData);
    console.log('Data verification:', isDataValid ? 'SUCCESS' : 'FAILED');

    // 3. Cleanup - Delete test user
    console.log('4. Cleaning up test data...');
    await pool.execute('DELETE FROM users WHERE id = ?', [insertedId]);
    console.log('Test user deleted successfully');

    return true;
  } catch (error) {
    console.error('Database operations test failed:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('=== Starting Test Suite ===\n');

  // Test 1: Database Connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('Stopping tests due to database connection failure');
    return;
  }

  // Test 2: Encryption/Decryption
  console.log('\n=== Testing Encryption/Decryption ===');
  const encryptionSuccess = await testEncryptionOnly();
  
  // Test 3: Database Operations
  console.log('\n=== Testing Database Operations ===');
  const dbOperationsSuccess = await testDatabaseOperations();

  console.log('\n=== Test Results Summary ===');
  console.log('Database Connection:', dbConnected ? 'PASSED' : 'FAILED');
  console.log('Encryption/Decryption:', encryptionSuccess ? 'PASSED' : 'FAILED');
  console.log('Database Operations:', dbOperationsSuccess ? 'PASSED' : 'FAILED');

  // Cleanup
  await pool.end();
}

// Run the tests
runAllTests().catch(console.error);