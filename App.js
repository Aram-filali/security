import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminScreen from './screens/AdminScreen';
import PatientScreen from './screens/PatientScreen';
import PatientListScreen from './screens/PatientListScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

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
          options={{ title: 'SecureCare' }}
        />
        <Stack.Screen 
          name="PatientScreen" 
          component={PatientScreen} 
          options={{ title: 'Patient Management' }}
        />
        <Stack.Screen 
          name="PatientListScreen" 
          component={PatientListScreen} 
          options={{ title: 'Patient List' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4158d1ff',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});








/*import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminScreen from './screens/AdminScreen';
import PatientScreen from './screens/PatientScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

//const BASE_URL = 'http://localhost:3000'; // Remplacez par l'adresse IP locale de votre machine

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
          options={{ title: 'SecPac' }}
        />
        <Stack.Screen 
          name="PatientScreen" 
          component={PatientScreen} 
          options={{ title: 'Patients management' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4158d1ff', // Blue header
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
*/




/*import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminScreen from './screens/AdminScreen';
import PatientScreen from './screens/PatientScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen'; // Import the new screen
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

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
          options={{ title: 'SecureCare' }}
        />
        <Stack.Screen 
          name="PatientScreen" 
          component={PatientScreen} 
          options={{ title: 'Patients Management' }}
        />
        <Stack.Screen 
          name="VerifyCodeScreen" 
          component={VerifyCodeScreen} 
          options={{ title: 'Verify Code' }} // Add the new screen here
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4158d1ff', // Blue header
  },
  headerTitle: {
    fontSize: 20,
    color: '#f4f4f4', // White text
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});*/




