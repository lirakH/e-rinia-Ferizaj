import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('authToken');
        setIsLoggedIn(!!token);
      };

      checkLoginStatus();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.subHeader}>Sign in or create a new account</Text>
        <Image source={require('@/assets/images/People.jpg')} style={styles.image} />
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('auth/LoginScreen')}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('auth/SignupScreen')}>
          <Text style={styles.signUpText}>No account yet? <Text style={styles.linkText}>Sign up</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ngoSignInButton} onPress={() => router.push('auth/NgoLoginScreen')}>
          <Text style={styles.buttonText}>NGO Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Page</Text>
      {/* Display user's profile information here */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#0088cc',
    padding: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  signUpButton: {
    borderColor: '#0088cc',
    borderWidth: 1,
    padding: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  ngoSignInButton: {
    backgroundColor: '#00B6AA',
    padding: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpText: {
    color: '#0088cc',
    fontSize: 16,
  },
  linkText: {
    color: '#0088cc',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
