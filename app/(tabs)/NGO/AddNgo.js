import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, CheckBox } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddNgo = () => {
  const [ngoDetails, setNgoDetails] = useState({
    picture: '',
    name: '',
    shkurt: '',
    joinCode: '',
    email: '',
    description: '',
    type: '',
  });

  const handleInputChange = (field, value) => {
    setNgoDetails({ ...ngoDetails, [field]: value });
  };

  const handleTypeChange = (type) => {
    setNgoDetails((prevState) => ({
      ...prevState,
      type: type,
    }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNgoDetails({ ...ngoDetails, picture: result.uri });
    }
  };

  const handleAddNgo = () => {
    // Handle the logic to add the NGO
    console.log('NGO Details:', ngoDetails);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add NGO</Text>
      <TouchableOpacity onPress={handlePickImage}>
        <View style={styles.imageContainer}>
          {ngoDetails.picture ? (
            <Image source={{ uri: ngoDetails.picture }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>NGO Picture</Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="NGO Name"
          value={ngoDetails.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="NGO Shkurtesa"
          value={ngoDetails.shkurt}
          onChangeText={(value) => handleInputChange('shkurt', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="NGO JoinCode"
          value={ngoDetails.joinCode}
          onChangeText={(value) => handleInputChange('joinCode', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="NGO Email"
          value={ngoDetails.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="NGO Description"
          value={ngoDetails.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline={true}
        />
        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxLabel}>Type:</Text>
          <View style={styles.checkboxRow}>
            <CheckBox
              value={ngoDetails.type === 'NGO'}
              onValueChange={() => handleTypeChange('NGO')}
            />
            <Text style={styles.checkboxText}>NGO</Text>
            <CheckBox
              value={ngoDetails.type === 'Institution'}
              onValueChange={() => handleTypeChange('Institution')}
            />
            <Text style={styles.checkboxText}>Institution</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddNgo}>
          <Text style={styles.buttonText}>Add NGO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    color: '#fff',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default AddNgo;
