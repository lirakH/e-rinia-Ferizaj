import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { registerVolunteer } = useContext(AuthContext);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: '463733012532-ckmdrfn98fjb96oooqpl9gt9eivv4rof.apps.googleusercontent.com',
    iosClientId: '463733012532-foq1rr4vts8d4n554p16onae52fu2m6p.apps.googleusercontent.com',
    androidClientId: '463733012532-h1emp6eldre7e1p5e92nt2mckhqgg2s4.apps.googleusercontent.com',
    webClientId: '463733012532-ckmdrfn98fjb96oooqpl9gt9eivv4rof.apps.googleusercontent.com',
  });

  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      // Here you would typically send the authentication token to your backend
      // and receive a JWT token in response
      Alert.alert('Sign up successful', `Google sign-up was successful. Token: ${authentication}`);
      router.push('auth/LoginScreen');
    }

    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      // Similar to Google sign-up, send this token to your backend
      Alert.alert('Sign up successful', 'Facebook sign-up was successful.');
      router.push('auth/LoginScreen');
    }
  }, [googleResponse, facebookResponse]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateAlert =  async () =>{
    Alert.alert("Next Update","Ky funksionalitet nuk është i mundur në këtë moment, do të rregullohet në përditësimin e ardhshëm.")
  }

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await registerVolunteer({ name: fullName, email, password });
      Alert.alert('Registration successful', 'You can now log in with your new account.');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      router.push('auth/LoginScreen');
    } catch (error) {
      if (error.response) {
        Alert.alert('Registration failed', error.response.data.message || 'Please try again.');
      } else if (error.request) {
        Alert.alert('Network error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Sign up</Text>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="abc@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>SIGN UP</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.orText}>Or With</Text>
        <TouchableOpacity style={styles.socialButton} onPress={updateAlert} /* () => googlePromptAsync() }> */> 
          <FontAwesome name="google" size={20} color="red" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={updateAlert} /*() => facebookPromptAsync()}> */> 
          <FontAwesome name="facebook" size={20} color="blue" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('auth/LoginScreen')}>
          <Text style={styles.signupText}>Already have an account? <Text style={styles.signupLink}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#007BFF',
  },
});

export default SignupScreen;
