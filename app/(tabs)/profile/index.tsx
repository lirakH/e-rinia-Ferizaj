import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeVolunteerToken, decodeOrganizationToken, decodeAdminToken } from '@/endpoints';

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        const volunteerToken = await AsyncStorage.getItem('volunteerAuthToken');
        const organizationToken = await AsyncStorage.getItem('organizationAuthToken');
        const adminToken = await AsyncStorage.getItem('adminAuthToken');

        if (volunteerToken) {
          setIsLoggedIn(true);
          setUserRole('volunteer');
        } else if (organizationToken) {
          setIsLoggedIn(true);
          setUserRole('organization');
        } else if (adminToken) {
          setIsLoggedIn(true);
          setUserRole('admin');
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      };

      checkLoginStatus();
    }, [])
  );

  useEffect(() => {
    if (isLoggedIn) {
      switch (userRole) {
        case 'volunteer':
          router.push('profile/VolunteerProfileScreen');
          break;
        case 'organization':
          router.push('profile/NgoProfileScreen');
          break;
        case 'admin':
          router.push('profile/AdminProfileScreen');
          break;
        default:
          break;
      }
    }
  }, [isLoggedIn, userRole, router]);

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

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  ngoSignInButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpText: {
    fontSize: 16,
    color: '#555',
  },
  linkText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
});


export default ProfilePage;
