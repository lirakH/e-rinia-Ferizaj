import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert, Platform } from 'react-native';
import { useRouter, useFocusEffect, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { getLikedOrganizations, updateVolunteer, getVolunteerById, uploadVolunteerProfilePicture } from '@/endpoints';
import DraggableCircleGrid from '@/components/DraggableCircleGrid';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '@/AuthContext';
import { MEDIA_BASE_URL } from '@/config';

const VolunteerScreen = () => {
  const { userRole, isLoading, userId, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({ id: '', name: '', email: '', profilePicture: null });
  const [favoriteNGOs, setFavoriteNGOs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tempProfilePicture, setTempProfilePicture] = useState(null); // Temporary state for profile picture
  const [isImageRemoved, setIsImageRemoved] = useState(false); // State to track image removal
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Checking user role and loading state...');
      if (!isLoading) {
        if (userRole !== 'volunteer' || userRole === null) {
          console.log('Redirecting to index due to invalid role or null role...');
          router.push('profile');
        }
      }
    }, [isLoading, userRole, router])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        if (userId) {
          setLoading(true);
          try {
            const userData = await getVolunteerById(userId);
            setUserData({
              ...userData,
              profilePicture: userData.profilePicture ? `${MEDIA_BASE_URL}${userData.profilePicture}` : null,
            });
            setTempProfilePicture(null);
            setIsImageRemoved(false);
            await fetchFavoriteNGOs();
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchUserData();
    }, [userId])
  );

  const fetchFavoriteNGOs = async () => {
    try {
      const ngos = await getLikedOrganizations();
      setFavoriteNGOs(ngos);
    } catch (error) {
      console.error('Error fetching favorite NGOs:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      // If there's a new profile picture, upload it first
      if (tempProfilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', {
          uri: tempProfilePicture,
          type: 'image/jpeg',
          name: 'profile_picture.jpg',
        });

        const updatedUser = await uploadVolunteerProfilePicture(userId, formData);
        userData.profilePicture = updatedUser.imageUrl ? `${updatedUser.imageUrl}` : null;
      } else if (isImageRemoved) {
        // If the image was removed, set profilePicture to null
        userData.profilePicture = null;
      }

      // Ensure the profile picture URL is relative before sending it to the server
      const updatedUserData = {
        ...userData,
        profilePicture: userData.profilePicture ? userData.profilePicture.replace(MEDIA_BASE_URL, '') : null,
      };

      await updateVolunteer(userData.id, updatedUserData);
      alert('Profile updated successfully');
      setIsEditing(false);
      console.log('Updated user data:', userData); // Log user data after update
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Error updating profile. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      if (Platform.OS === 'android') {
        // For Android 13+ (API 33+)
        if (Platform.Version >= 33) {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            presentationStyle: 'pageSheet',
            selectionLimit: 1,
          });

          if (!result.canceled && result.assets[0]) {
            setTempProfilePicture(result.assets[0].uri);
            setIsImageRemoved(false);
          }
        } else {
          // For older Android versions
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Photo access permission is required');
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled && result.assets[0]) {
            setTempProfilePicture(result.assets[0].uri);
            setIsImageRemoved(false);
          }
        }
      } else {
        // For iOS
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          setTempProfilePicture(result.assets[0].uri);
          setIsImageRemoved(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setTempProfilePicture(null);
    setUserData({ ...userData, profilePicture: null });
    setIsImageRemoved(true); // Set image removal state
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Page</Text>
      <TouchableOpacity onPress={isEditing ? handlePickImage : undefined}>
        {tempProfilePicture ? (
          <Image
            source={{ uri: tempProfilePicture }}
            style={styles.profileImage}
            onError={(error) => console.error('Error loading image:', error)} // Log image loading errors
          />
        ) : userData.profilePicture ? (
          <Image
            source={{ uri: userData.profilePicture }}
            style={styles.profileImage}
            onError={(error) => console.error('Error loading image:', error)} // Log image loading errors
          />
        ) : (
          <Image
            source={require('@/assets/images/placeholder.png')}
            style={styles.profileImage}
            onError={(error) => console.error('Error loading placeholder image:', error)} // Log placeholder image loading errors
          />
        )}
      </TouchableOpacity>
      {isEditing ? (
        <>
          <TouchableOpacity onPress={handleRemoveImage}>
            <Text style={styles.removeImageText}>Remove Image</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            placeholder="Email"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.ngoTitleContainer}>
        <Link href="/NGO" style={styles.link}>
          <AntDesign name="caretleft" size={12} color="#555" />
          Add  
        </Link>
        <Text style={styles.ngoTitle}>Liked NGOs</Text>
        <Link href="/favorite" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>

      {favoriteNGOs.length > 0 ? (
        <DraggableCircleGrid
          items={favoriteNGOs.map((ngo) => ({
            id: ngo.id.toString(),
            label: ngo.name,
            picture: ngo.picture || 'https://via.placeholder.com/150',
          }))}
        />
      ) : (
        <Text style={styles.noNGO} >No liked NGOs yet.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  removeImageText: {
    color: 'red',
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  ngoTitleContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ngoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Add this line to center the text
    textAlign: 'center', // Add this line to center the text
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNGO: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    marginTop: 40,
  },
});

export default VolunteerScreen;
