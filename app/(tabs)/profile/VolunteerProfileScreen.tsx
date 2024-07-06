import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { useRouter, useFocusEffect, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { getLikedOrganizations, updateVolunteer, getVolunteerById, uploadVolunteerProfilePicture } from '@/endpoints';
import DraggableCircleGrid from '@/components/DraggableCircleGrid';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '@/AuthContext';

const VolunteerScreen = () => {
  const { userRole, isLoading, userId, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({ id: '', name: '', email: '', profilePicture: null });
  const [favoriteNGOs, setFavoriteNGOs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
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
            setUserData(userData);
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
      await updateVolunteer(userData.id, userData);
      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Error updating profile. Please try again.');
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      try {
        const formData = new FormData();
        formData.append('profilePicture', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile_picture.jpg',
        });

        const updatedUser = await uploadVolunteerProfilePicture(userId, formData);
        setUserData({ ...userData, profilePicture: updatedUser.profilePicture });
        alert('Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('auth/LoginScreen');
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
        <Image
          source={userData.profilePicture ? { uri: userData.profilePicture } : require('@/assets/images/placeholder.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      {isEditing ? (
        <>
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
        <Text>No liked NGOs yet.</Text>
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
});

export default VolunteerScreen;
