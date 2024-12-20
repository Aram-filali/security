import React, { useState } from 'react';
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

const BASE_URL = 'http://192.168.44.247:3000'; // Update to your backend URL

export default function AdminScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to store admin email
  const storeAdminEmail = async (email) => {
    try {
      await AsyncStorage.setItem('adminEmail', email);
      console.log('Admin email stored:', email);
    } catch (error) {
      console.error('Error saving admin email:', error);
    }
  };

  // Enhanced email validation
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleAdminLogin = async () => {
    // Input validation
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required!!');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'invalid e-mail address!!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/admin-login`, {
        email,
        password
      }, {
        timeout: 5000 // 5 seconds timeout
      });

      // Store authentication token
      await AsyncStorage.setItem('adminToken', response.data.token);

      // Store admin email
      await storeAdminEmail(email);

      // Clear sensitive data
      setPassword('');

      Alert.alert('Success', 'Login successful');
      navigation.navigate('PatientScreen');
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        Alert.alert('Error', error.response.data.message || 'Incorrect credentials');
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Error', 'No server response. Verify your connection plz.');
      } else {
        // Something happened in setting up the request
        Alert.alert('Error', 'Connexion error');
      }
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.title}>admin connection</Text>
        
        <TextInput
          style={styles.textInput}
          placeholder="Enter admin Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
    backgroundColor: '#4158d1ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});







/*import React, { useState } from 'react';
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

const BASE_URL = 'http://192.168.44.247:3000'; // Update to your backend URL

export default function AdminScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced email validation
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleAdminLogin = async () => {
    // Input validation
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required!!');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'invalid e-mail address!!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/admin-login`, {
        email,
        password
      }, {
        timeout: 5000 // 5 seconds timeout
      });

      // Store authentication token
      await AsyncStorage.setItem('adminToken', response.data.token);

      // Clear sensitive data
      setPassword('');
      
      Alert.alert('Success', 'Login successful');
      navigation.navigate('PatientScreen');
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        Alert.alert('Error', error.response.data.message || 'Incorrect credentials');
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Error', 'No server response. Verify your connection plz.');
      } else {
        // Something happened in setting up the request
        Alert.alert('Error', 'Connexion error');
      }
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.title}>admin connection</Text>
        
        <TextInput
          style={styles.textInput}
          placeholder="Enter admin Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
    backgroundColor: '#4158d1ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f4f4f4',
    fontSize: 18,
    fontWeight: 'bold',
  },
});*/

























