import React, { useContext, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, Image, ScrollView, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { userToken, userRole, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log('ProfilePage - userToken:', userToken);
    console.log('ProfilePage - userRole:', userRole);
    if (userToken && userRole) {
      redirectToProfileScreen();
    }
  }, [userToken, userRole]);

  const redirectToProfileScreen = () => {
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
  };

  if (userToken && userRole) {
    // User is logged in, redirect to the appropriate profile screen
    redirectToProfileScreen();
    return null; // Return null while redirecting
  }

  if (!userToken || !userRole) {
    // User is not logged in, show the welcome screen
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.subHeader}>Sign in or create a new account</Text>
        <Image source={require('@/assets/images/People.jpg')} style={styles.image} />
        <TouchableOpacity style={styles.button} onPress={() => router.push('auth/LoginScreen')}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={() => router.push('auth/SignupScreen')}>
          <Text style={styles.signUpText}>No account yet? <Text style={styles.linkText}>Sign up</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.ngoSignInButton]} onPress={() => router.push('auth/NgoLoginScreen')}>
          <Text style={styles.buttonText}>NGO Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // If we're still loading, show a loading indicator
  return (
    <View style={[styles.container, styles.loadingContainer]}>
      <ActivityIndicator size="large" color="#0000ff" />
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
  loadingContainer: {
    justifyContent: 'center',
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
  button: {
    backgroundColor: "#0091F9",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: "#f1f1ff",
  },
  ngoSignInButton: {
    backgroundColor: "#00B6AA",
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
