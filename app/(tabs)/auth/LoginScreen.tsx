import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { loginVolunteer } = useContext(AuthContext);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: '463733012532-ckmdrfn98fjb96oooqpl9gt9eivv4rof.apps.googleusercontent.com',
    iosClientId: '463733012532-foq1rr4vts8d4n554p16onae52fu2m6p.apps.googleusercontent.com',
    androidClientId: '463733012532-h1emp6eldre7e1p5e92nt2mckhqgg2s4.apps.googleusercontent.com',
    //webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      // Here you would typically send the authentication token to your backend
      // and receive a JWT token in response
      //Alert.alert('Login successful', 'Google login was successful.');
      router.push('/profile');
    }

    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      // Similar to Google login, send this token to your backend
      //Alert.alert('Login successful', 'Facebook login was successful.');
      router.push('/profile');
    }
  }, [googleResponse, facebookResponse]);

  const updateAlert =  async () =>{
    Alert.alert("Next Update","Ky funksionalitet nuk është i mundur në këtë moment, do të rregullohet në përditësimin e ardhshëm.")
  }

  const handleSignIn = async () => {
    try {
      await loginVolunteer({ email, password });
      //Alert.alert('Login successful');
      setEmail('');
      setPassword('');
      router.push('/profile');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert('Login failed', 'Invalid email or password. Please try again.');
        } else {
          Alert.alert('Login failed', 'An unexpected error occurred. Please try again later.');
        }
      } else if (error.request) {
        Alert.alert('Network error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Sign in</Text>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="abc@email.com"
            value={email}
            onChangeText={setEmail}
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
        <View style={styles.rememberContainer}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
          />
          <Text style={styles.rememberText}>Remember Me</Text>
                            {/* onPress={() => router.push('auth/ForgotPassword')} */}
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.buttonText}>SIGN IN</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity style={styles.socialButton} onPress={updateAlert} /* () => googlePromptAsync() }> */> 
          <FontAwesome name="google" size={20} color="red" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={updateAlert} /*() => facebookPromptAsync()}> */> 
          <FontAwesome name="facebook" size={20} color="blue" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Login with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('auth/SignupScreen')}>
          <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign up</Text></Text>
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
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberText: {
    marginLeft: 10,
    flex: 1,
  },
  forgotText: {
    color: '#007BFF',
  },
  signInButton: {
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

export default LoginScreen;
