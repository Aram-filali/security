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
  ScrollView,
  Modal 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.16.165:3000';

export default function PatientListScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSensitiveData, setEditSensitiveData] = useState('');

  const handleAuthentication = async () => {
    if (!password) {
      Alert.alert('Error', 'Password is required');
      return;
    }

    try {
      const adminEmail = await AsyncStorage.getItem('adminEmail');
      console.log('Admin Email:', adminEmail);  // Vérifiez si l'email est récupéré correctement

      if (!adminEmail) {
        Alert.alert('Error', 'Admin email is not set');
        return;
      }

      const response = await axios.post(`${BASE_URL}/verify-admin`, {
        email: adminEmail,
        password
      });

      console.log('Response from server:', response.data);  // Vérifiez la réponse du serveur

      if (response.data.message === 'Verification successful') {
        setIsAuthenticated(true);
        fetchPatients();
      } else {
        Alert.alert('Error', 'Invalid password');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      Alert.alert('Error', 'Invalid password');
    }
  };

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      let errorMessage = 'Unable to fetch patients';
      
      if (error.response) {
        // Si le serveur répond avec un code d'erreur, afficher un message spécifique
        errorMessage = `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Si la requête n'a pas de réponse
        errorMessage = 'No response from server';
      } else {
        // Autres erreurs
        errorMessage = error.message;
      }
  
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setEditName(patient.name);
    setEditEmail(patient.email);
    setEditSensitiveData(patient.sensitiveData);
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/users/${selectedPatient.id}`, {
        name: editName,
        email: editEmail,
        sensitiveData: editSensitiveData
      });

      Alert.alert('Success', 'Patient updated successfully');
      setIsEditModalVisible(false);
      fetchPatients();
    } catch (error) {
      console.error('Error updating patient:', error);
      Alert.alert('Error', 'Unable to update patient');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this patient?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${BASE_URL}/users/${id}`);
              Alert.alert('Success', 'Patient deleted successfully');
              fetchPatients();
            } catch (error) {
              console.error('Error deleting patient:', error);
              Alert.alert('Error', 'Unable to delete patient');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('adminToken');
    await AsyncStorage.removeItem('adminEmail');
    navigation.navigate('AdminScreen');
  };

  if (!isAuthenticated) {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.authContainer}>
          <Text style={styles.title}>Authentication Required</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleAuthentication}
          >
            <Text style={styles.buttonText}>Authenticate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Patient List</Text>
        
        {patients.map(patient => (
          <View key={patient.id} style={styles.patientCard}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientEmail}>{patient.email}</Text>
            <Text style={styles.patientData}>{patient.sensitiveData}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEdit(patient)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(patient.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {isLoading ? (
          <Text style={styles.loadingText}>Loading patients...</Text>
        ) : null}

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Patient</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
            />
            
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
            />
            
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Patient details"
              value={editSensitiveData}
              onChangeText={setEditSensitiveData}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  patientEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  patientData: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  }
});
