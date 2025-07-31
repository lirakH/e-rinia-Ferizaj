import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Alert, ScrollView } from 'react-native';

const Safe = () => {
  const handlePress = async () => {
    const appURL =  'https://play.google.com/store/apps/details?id=org.nativescript.raportopolicin&hl=sq'; //'myapp://'; // Replace with your app's deep link scheme
    const storeURL = 'https://play.google.com/store/apps/details?id=org.nativescript.raportopolicin&hl=sq';

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Zona e Sigurise</Text>
      <Text style={styles.description}>
        Siguria juaj mbrohet me ligj! Raporto çdo parregullësi që ndodhë në shkollën tuaj! 
        Lajmëro Policinë për rastet kriminale apo problemet e sigurisë në aktivitetet publike!
      </Text>
      <TouchableOpacity onPress={handlePress} style={styles.safeContainer}>
      <Image source={require('@/assets/images/Kosovo-Police.png')} style={styles.logo} />
          <Text style={styles.safeText}>Lajmro Policine</Text>
      </TouchableOpacity>
      <Text style={styles.placeholderText}>Rreth këtij aplikacioni.</Text>
      <Text style={styles.placeholderText}>
        Aplikimi do të përdoret nga qytetarët e Kosovës për të njoftuar policinë për krime të ndryshme. Qytetari ka të drejtë të mos i zbulojë informacionet e tij personale nëse nuk do të donte t'i zbulonte ato detaje. Për përdorim më të mirë kur të dërgohet një informacion në polici do të marrim gjithashtu IP të përdoruesit që dërgon informacionin. Qytetari mund të dërgojë gjithashtu vendndodhjen nga ku po raporton. Për më shumë detaje, ju lutemi referojuni dokumentacionit.
      </Text>
      <TouchableOpacity style={styles.storeButton} onPress={handlePress}>
      <Image source={require('@/assets/images/google-play.png')} style={styles.storeImage} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0088cc',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  logo: {
    width: 80,
    height: 80,
    margin: 15,
    marginLeft: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 20,
  },
  storeButton: {
    padding: 10,
  },
  storeImage: {
    width: 250,
    height: 80,
  },
  safeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#0091F9',
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 30,
  },
  safeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

export default Safe;
