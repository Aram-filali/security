import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://192.168.1.24:3000'; // Remplacez par l'adresse IP locale de votre machine

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sensitiveData, setSensitiveData] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/add-user`, {
        name,
        email,
        sensitiveData,
      });

      // Assurez-vous de bien accéder à la clé 'message' dans la réponse
      const message = response.data.message;  // Accès à la chaîne 'message' depuis la réponse JSON

      // Vérifiez que 'message' est une chaîne avant de l'afficher
      if (typeof message === 'string') {
        Alert.alert('Succès', message);  // Affiche le message dans une alerte
      } else {
        Alert.alert('Erreur', 'La réponse n\'est pas au format attendu');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'utilisateur.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Données sensibles"
        value={sensitiveData}
        onChangeText={setSensitiveData}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />
      <Button title="Ajouter l'utilisateur" onPress={handleSignUp} />
    </View>
  );
}
