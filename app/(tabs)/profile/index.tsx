import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { useRouter, useFocusEffect, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { getLikedOrganizations, updateVolunteer, getVolunteerById, decodeVolunteerToken } from '@/endpoints';
import DraggableCircleGrid from '@/components/DraggableCircleGrid';
import { AntDesign } from '@expo/vector-icons';

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ id: '', name: '', email: '', profilePicture: null });
  const [favoriteNGOs, setFavoriteNGOs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsLoggedIn(true);
          const volunteerId = await decodeVolunteerToken(); // Decode the token to get the volunteer ID
          fetchUserData(volunteerId); // Fetch user data using the volunteer ID
          fetchFavoriteNGOs();
        } else {
          setIsLoggedIn(false);
        }
      };

      checkLoginStatus();
    }, [])
  );

  const fetchUserData = async (volunteerId) => {
    try {
      console.log('Fetching user data for volunteer ID:', volunteerId);
      const userData = await getVolunteerById(volunteerId);
      console.log('Fetched user data:', userData);
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

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

    if (!result.canceled) {
      setUserData({ ...userData, profilePicture: result.uri });
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setFavoriteNGOs([]); // Clear favorite NGOs on logout
    router.push('auth/LoginScreen');
  };

  const renderFavoriteNGO = ({ item }) => (
    <View style={styles.ngoItem}>
      <Text>{item.name}</Text>
    </View>
  );

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.subHeader}>Sign in or create a new account</Text>
        <Image source={require('@/assets/images/People.jpg')} style={styles.image} />
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('auth/LoginScreen')}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('auth/SignupScreen')}>
          <Text style={styles.signUpText}>No account yet? <Text style={styles.linkText}>Sign up</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ngoSignInButton} onPress={() => router.push('auth/NgoLoginScreen')}>
          <Text style={styles.buttonText}>NGO Sign in</Text>
        </TouchableOpacity>
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
        <Link href="/ngo" style={styles.link}>
          <AntDesign name="caretleft" size={12} color="#555" />
          Add   
        </Link>
        <Text style={styles.ngoTitle}>Liked NGOs</Text>
        <Link href="/ngo" style={styles.link}>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  image: {
    width: 400,
    height: 300,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "#0091F9",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: "#f1f1ff",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  ngoSignInButton: {
    backgroundColor: "#00B6AA",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpText: {
    fontSize: 16,
    color: "#555",
  },
  linkText: {
    color: "#0091F9",
    fontWeight: "bold",
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
});

export default ProfilePage;
