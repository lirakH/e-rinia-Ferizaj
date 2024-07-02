import React, { useContext, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, Image, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { userToken, userRole, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log('ProfilePage - userToken:', userToken);
    console.log('ProfilePage - userRole:', userRole);
    if (userToken) {
      // User is logged in, redirect based on role
      switch (userRole) {
        case 'volunteer':
          router.replace('/(tabs)/profile/VolunteerProfileScreen');
          break;
        case 'organization':
          router.replace('/(tabs)/profile/NgoProfileScreen');
          break;
        case 'admin':
          router.replace('/(tabs)/profile/AdminProfileScreen');
          break;
        default:
          console.error('Unknown user role:', userRole);
      }
    }
  }, [userToken, userRole]);

  // If user is not logged in, show the welcome screen
  if (!userToken) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
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
      </ScrollView>
    );
  }

  // If userToken exists but we haven't redirected yet, show a loading state
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  image: {
    width: 400,
    height: 300,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "#0091F9",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: "#f1f1ff",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  ngoSignInButton: {
    backgroundColor: "#00B6AA",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpText: {
    fontSize: 16,
    color: "#555",
  },
  linkText: {
    color: "#0091F9",
    fontWeight: "bold",
  },
});
