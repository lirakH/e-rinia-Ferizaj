import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '@/AuthContext';
import { getVolunteerById, updateVolunteer, uploadVolunteerProfilePicture, decodeVolunteerToken } from '@/endpoints';

const VolunteerProfileScreen = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { logout, userToken } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log('VolunteerProfileScreen mounted');
    console.log('userToken:', userToken);
    fetchVolunteerData();
  }, []);

  useEffect(() => {
    console.log('volunteer state changed:', volunteer);
  }, [volunteer]);

  const fetchVolunteerData = async () => {
    console.log('fetchVolunteerData called');
    try {
      setIsLoading(true);
      console.log('Decoding token...');
      const volunteerId = decodeVolunteerToken(userToken);
      console.log('Volunteer ID:', volunteerId);
      if (volunteerId) {
        console.log('Fetching volunteer data...');
        const data = await getVolunteerById(volunteerId);
        console.log('Fetched volunteer data:', data);
        setVolunteer(data);
      } else {
        console.log('Invalid token - no volunteer ID');
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Error in fetchVolunteerData:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
      console.log('fetchVolunteerData completed');
    }
  };
  
  

  const handleEditProfilePicture = async () => {
    console.log('handleEditProfilePicture called');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled) {
        setIsUpdating(true);
        const uri = result.assets[0].uri;
        const name = uri.split('/').pop();
        const type = "image/" + uri.split('.').pop();

        const formData = new FormData();
        formData.append('profilePicture', { uri, name, type });

        console.log('Uploading profile picture...');
        const response = await uploadVolunteerProfilePicture(volunteer.id, formData);
        console.log('Upload response:', response);
        
        setVolunteer(prevState => ({
          ...prevState,
          profilePicture: response.imageUrl
        }));

        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    console.log('handleLogout called');
    try {
      await logout();
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!volunteer) {
    console.log('No volunteer data found');
    return (
      <View style={styles.centered}>
        <Text>No volunteer data found</Text>
      </View>
    );
  }

  console.log('Rendering volunteer profile');
  return (
    <View style={styles.container}>
      <Image
        source={volunteer.profilePicture ? { uri: volunteer.profilePicture } : require('@/assets/images/placeholder.png')}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{volunteer.name}</Text>
      <Text style={styles.email}>{volunteer.email}</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfilePicture}>
        <Text style={styles.buttonText}>Edit Profile Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {isUpdating && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VolunteerProfileScreen;
