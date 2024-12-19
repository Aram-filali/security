
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.120:3000';

export default function PatientScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [sensitiveData, setSensitiveData] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for admin token when screen loads
    checkAdminToken();
  }, []);

  const checkAdminToken = async () => {
    const token = await AsyncStorage.getItem('adminToken');
    if (!token) {
      Alert.alert('Error', 'Try reconnecting');
      navigation.navigate('AdminScreen');
    }
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleAdminLogin = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Invalid e-mail address!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/admin-login`, {
        email,
        password
      });

      if (response.data.message === 'Login successful') {
        setIsAdmin(true);
        Alert.alert('Success', 'Login successful');
      } else {
        Alert.alert('Error', 'Incorrect credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Connexion error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!isAdmin) {
      Alert.alert('Error', 'YOU ARE NOT THE ADMIN');
      return;
    }

    if (!name || !email || !sensitiveData) {
      Alert.alert('Error', 'All fields are required!!');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'invalid e-mail address!!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/add-user`, {
        name,
        email,
        sensitiveData
      });

      Alert.alert('Success', response.data.message);
      
      // Reset form after successful submission
      setName('');
      setEmail('');
      setSensitiveData('');
    } catch (error) {
      console.error('Error adding patients:', error);
      Alert.alert('Error', 'Unable to add patient');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('adminToken');
    navigation.navigate('AdminScreen');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'
      >
        {!isAdmin && (
          <View style={styles.loginSection}>
            <Text style={styles.title}>Admin Authentication</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAdminLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Connecting...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isAdmin && (
          <View style={styles.patientSection}>
            <Text style={styles.title}>Add Patient</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Patient name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Patient email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Patient details"
              value={sensitiveData}
              onChangeText={setSensitiveData}
              multiline
              numberOfLines={10}
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Adding in progress...' : 'Add patient'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>disconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});




































/*import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://192.168.1.120:3000';

export default function PatientScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [sensitiveData, setSensitiveData] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleAdminLogin = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Erreur', 'L\'adresse e-mail est invalide!');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/admin-login`, {
        email,
        password,
      });

      if (response.data.message === 'Login successful') {
        setIsAdmin(true);  // Admin successfully logged in
        Alert.alert('Succès', 'Login successful');
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Erreur', 'Erreur de connexion');
    }
  };

  const handleSignUp = async () => {
    if (!isAdmin) {
      Alert.alert('Erreur', 'Vous devez être un admin pour ajouter des patients');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erreur', 'L\'adresse e-mail est invalide!');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/add-user`, {
        name,
        email,
        sensitiveData,
      });

      const message = response.data.message;
      if (message === 'Utilisateur ajouté avec succès!') {
        Alert.alert('Succès', message);
      } else {
        Alert.alert('Erreur', 'La réponse n\'est pas au format attendu');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'utilisateur.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin Login</Text>
      <TextInput
        placeholder="Admin Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.textInput}
      />
      <TextInput
        placeholder="Admin Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textInput}
      />
      <Button title="Login as Admin" onPress={handleAdminLogin} />

      {isAdmin && (
        <>
          <Text style={styles.text}>Add New Patient</Text>
          <TextInput
            placeholder="Patient Name"
            value={name}
            onChangeText={setName}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Patient Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.textInput}
          />
          <TextInput
            placeholder="Patient Details"
            value={sensitiveData}
            onChangeText={setSensitiveData}
            style={styles.textInput}
          />
          <Button title="Add Patient" onPress={handleSignUp} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    marginBottom: 15,
  },
});

*/