import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Remplacez par l'adresse IP locale de votre machine

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="AdminScreen"
        screenOptions={{
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: '#fff',
          cardStyle: styles.container,
        }}
      >
        <Stack.Screen 
          name="AdminScreen" 
          component={AdminScreen} 
          options={{ title: 'Connexion Admin' }}
        />
        <Stack.Screen 
          name="PatientScreen" 
          component={PatientScreen} 
          options={{ title: 'Gestion Patients' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007bff', // Blue header
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff', // White text
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});













/*import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminScreen from './screens/AdminScreen';
import { StatusBar } from 'expo-status-bar';
import PatientScreen from './screens/PatientScreen';

//const BASE_URL = 'http://192.168.44.247:3000'; // Remplacez par l'adresse IP locale de votre machine

const Stack = createStackNavigator();
export default function App() {
  return(
    <NavigationContainer>
    <Stack.Navigator initialRouteName="AdminScreen"
     screenOptions={{
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: '#fff',
    }}
    >
      <Stack.Screen name="AdminScreen" component={AdminScreen} 
      options={{ title: 'Admin Login' }} 
      />
      <Stack.Screen name="PatientScreen" component={PatientScreen} 
      options={{ title: 'Patient Management' }} 
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007bff', // Blue header
  },
  headerTitle: {
//    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff', // White text
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',

  },
});*/










