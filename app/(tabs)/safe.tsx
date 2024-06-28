import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Safe = () => {
  const handlePress = async () => {
    const appURL = 'myapp://'; // Replace with your app's deep link scheme
    const storeURL = 'https://play.google.com/store/apps/details?id=org.nativescript.raportopolicin&hl=sq'; // Replace with your app's Google Play Store URL

    try {
      const supported = await Linking.canOpenURL(appURL);
      if (supported) {
        await Linking.openURL(appURL);
      } else {
        await Linking.openURL(storeURL);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to open the app or store.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Zona e Sigurise</Text>
      <Text style={styles.description}>
        Siguria juaj mbrohet me ligj! Raporto cdo parregullesi qe ndodhe ne shkollen tuaj! 
        Lajmro Policine per rastet kriminale apo problemet e sigurise ne aktivitetet publike!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Kosovo-Police_logo.svg/1200px-Kosovo-Police_logo.svg.png' }} style={styles.logo} />
        <Text style={styles.buttonText}>Lajmro Policine</Text>
      </TouchableOpacity>
      <Text style={styles.placeholderText}>Rreth këtij aplikacioni.</Text>
      <Text style={styles.placeholderText}>
      Aplikimi do të përdoret nga qytetarët e Kosovës për të njoftuar policinë për krime të ndryshme. Qytetari ka të drejtë të mos i zbulojë informacionet e tij personale nëse nuk do të donte t'i zbulonte ato detaje. Për përdorim më të mirë kur të dërgohet një informacion në polici do të marrim gjithashtu IP të përdoruesit që dërgon informacionin. Qytetari mund të dërgojë gjithashtu vendndodhjen nga ku po raporton. Për më shumë detaje, ju lutemi referojuni dokumentacionit.
      </Text>
      <TouchableOpacity style={styles.storeButton} onPress={handlePress}>
        <Image source={{ uri: 'https://getsby.com/wp-content/uploads/2023/06/google-play-badge.png' }} style={styles.storeImage} />
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
  description: {
    fontSize: 16,
    textAlign: 'Justify',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0088cc',
    padding: 30,
    borderRadius: 25,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: -10,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 20,
  },
  storeButton: {
    padding: 10,
    marginTop: -10,
  },
  storeImage: {
    width: 250,
    height: 80,
  },
});

export default Safe;
