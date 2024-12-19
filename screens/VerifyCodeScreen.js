import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.44.247:3000';

export default function VerifyCodeScreen({ route, navigation }) {
  const { email } = route.params; // Retrieve the email from the previous screen
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/verify-code`, { email, verificationCode });

      if (response.data.success) {
        const token = response.data.token;

        if (token) {
          await AsyncStorage.setItem('adminToken', token);
          Alert.alert('Success', 'Logged in successfully.');
          navigation.navigate('PatientScreen'); // Redirect after successful login
        } else {
          Alert.alert('Error', 'Invalid token received.');
        }
      } else {
        Alert.alert('Error', 'Invalid verification code.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Code</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter verification code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4158d1ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
