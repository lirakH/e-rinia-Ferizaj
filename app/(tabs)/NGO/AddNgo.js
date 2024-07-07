import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '@/AuthContext';
import { registerOrganization, uploadOrganizationPicture } from '@/endpoints';

const AddNgo = () => {
  const [ngoDetails, setNgoDetails] = useState({
    picture: '',
    name: '',
    shortname: '',
    joinCode: '',
    email: '',
    description: '',
    type: 'NGO',
  });

  const router = useRouter();
  const { userRole } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      if (userRole !== 'admin') {
        //Alert.alert('Access Denied', 'Only administrators can add NGOs.');
        router.push('profile');
      }
    }, [userRole])
  );

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
      }
    })();
  }, []);

  const handleInputChange = (field, value) => {
    setNgoDetails({ ...ngoDetails, [field]: value });
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setNgoDetails({ ...ngoDetails, picture: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddNgo = async () => {
    const { picture, name, shortname, joinCode, email, description, type } = ngoDetails;

    if (!name || !shortname || !joinCode || !email || !description || !type) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const organizationData = {
        name,
        shortname,
        joinCode,
        email,
        description,
        type,
      };

      const createdOrganization = await registerOrganization(organizationData);

      if (picture) {
        const formData = new FormData();
        const uriParts = picture.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('picture', {
          uri: picture,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });

        await uploadOrganizationPicture(createdOrganization.id, formData);
      }

      Alert.alert('Success', 'NGO created successfully');
      router.back();
    } catch (error) {
      console.error('Error creating NGO:', error);
      Alert.alert('Error', 'Failed to create NGO. Please try again.');
    }
  };

  if (userRole !== 'admin') {
    return null; // Render nothing while redirecting
  }

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
          placeholder="NGO Shortname"
          value={ngoDetails.shortname}
          onChangeText={(value) => handleInputChange('shortname', value)}
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
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="NGO Description"
          value={ngoDetails.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline={true}
        />
        <View style={styles.typeContainer}>
          <Text style={styles.typeLabel}>Type:</Text>
          <TouchableOpacity
            style={[styles.typeButton, ngoDetails.type === 'NGO' && styles.selectedType]}
            onPress={() => handleInputChange('type', 'NGO')}
          >
            <Text style={styles.typeButtonText}>NGO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, ngoDetails.type === 'Institution' && styles.selectedType]}
            onPress={() => handleInputChange('type', 'Institution')}
          >
            <Text style={styles.typeButtonText}>Institution</Text>
          </TouchableOpacity>
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
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    color: '#fff',
    textAlign: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  typeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  selectedType: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  typeButtonText: {
    color: '#000',
  },
});

export default AddNgo;
