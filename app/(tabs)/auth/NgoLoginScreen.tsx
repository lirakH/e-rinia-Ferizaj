import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { loginAdmin, loginOrganization } from '@/endpoints'; // Adjust the import path as needed

const NgoLoginScreen = () => {
  const [ngoName, setNgoName] = useState('');
  const [email, setEmail] = useState('');
  const [ngoCode, setNgoCode] = useState('');

  const handleLogin = async () => {
    const credentials = { email, password: ngoCode };
    try {
      if (ngoName.toLowerCase() === 'admin') {
        const adminResponse = await loginAdmin(credentials);
        Alert.alert('Success', 'Logged in as admin');
        console.log(adminResponse.data);
        setEmail('');
        setNgoCode('');
        setNgoName('');
        // Handle admin login success (e.g., navigation, storing tokens)
      } else {
        const ngoResponse = await loginOrganization(credentials);
        Alert.alert('Success', 'Logged in as NGO');
        console.log(ngoResponse.data);
        setEmail('');
        setNgoCode('');
        setNgoName('');
        // Handle NGO login success (e.g., navigation, storing tokens)
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please check your credentials and try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign in</Text>
      <View style={styles.inputContainer}>
        <Feather name="user" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="NGO Official Name"
          value={ngoName}
          onChangeText={setNgoName}
        />
      </View>
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
          placeholder="NGO Code*"
          secureTextEntry
          value={ngoCode}
          onChangeText={setNgoCode}
        />
      </View>
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>SIGN IN</Text>
        <Feather name="arrow-right" size={20} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.infoText}>
        To register as an NGO please send a request at{' '}
        <Text style={styles.linkText} onPress={() => Linking.openURL('mailto:roe.kosovo@gmail.com')}>
          roe.kosovo@gmail.com
        </Text>
      </Text>
      <Text style={styles.footerText}>
        *The NGO code is specific for your organization and can be found in the confirmation email if you have registered
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
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
  infoText: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  linkText: {
    color: '#007BFF',
  },
  footerText: {
    textAlign: 'center',
    color: 'black',
    marginTop: 20,
    fontSize: 12,
  },
});

export default NgoLoginScreen;
