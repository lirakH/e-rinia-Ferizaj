import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SectionList } from 'react-native';
import CircleItem from '@/components/CircleItem';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getLikedOrganizations, getAuthToken } from '@/endpoints'; // Adjust the path as necessary

export default function FavouriteScreen() {
  const [favouriteNGOs, setFavouriteNGOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const checkAuthentication = async () => {
        const token = await getAuthToken();
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
        } else {
          setIsAuthenticated(true);
          fetchFavouriteNGOs();
        }
      };

      const fetchFavouriteNGOs = async () => {
        try {
          const data = await getLikedOrganizations();
          const ngos = data.filter(item => item.type === 'NGO');
          const otherOrganizations = data.filter(item => item.type !== 'NGO');

          setFavouriteNGOs([
            { title: 'Institutions', data: otherOrganizations },
            { title: 'NGOs', data: ngos }
          ]);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthentication();
    }, [])
  );

  const handleNavigateToLogin = () => {
    router.push('/profile'); // Redirect to login page
  };
  const handleNavigateToNGO = () => {
    router.push('/NGO'); // Redirect to login page
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyTextTitle}>You are not signed in</Text>
        <Text style={styles.emptyTextBody}>Sign in to check your favourite NGOs</Text>
        <TouchableOpacity onPress={handleNavigateToLogin} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CircleItem item={item} />
      <Text style={styles.itemName}>{item.name}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderSection = ({ section }) => (
    <>
      {renderSectionHeader({ section })}
      <FlatList
        data={section.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {favouriteNGOs.every(section => section.data.length === 0) ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite" size={100} color="#bbb" />
          <Text style={styles.emptyTextTitle}>No favourite NGOs yet</Text>
          <Text style={styles.emptyTextBody}>Make sure you have added Favourite NGOs</Text>
          <TouchableOpacity onPress={handleNavigateToNGO} style={styles.button}>
            <Text style={styles.buttonText}>Add Favourite</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={favouriteNGOs}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item, section }) => null}
          ListHeaderComponent={() => null}
          ListFooterComponent={() => null}
          SectionSeparatorComponent={() => null}
          renderSectionFooter={({ section }) => renderSection({ section })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextTitle: {
    fontSize: 18,
    marginTop: 20,
    color: '#888',
  },
  emptyTextBody: {
    fontSize: 14,
    marginTop: 10,
    color: '#888',
  },
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    width: 100,
  },
  itemName: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    marginBottom: 25,
  },
});
