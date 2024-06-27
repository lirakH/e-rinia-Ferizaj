import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CircleItem from '@/components/CircleItem';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FavouriteScreen() {
  const [favouriteNGOs, setFavouriteNGOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFavouriteNGOs = async () => {
      try {
        // Sample JSON data
        const sampleData = [
          
        ];

        setFavouriteNGOs(sampleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavouriteNGOs();
  }, []);

  const handleNavigateToIndex = () => {
    router.push('/NGO');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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

  return (
    <View style={styles.container}>
      {favouriteNGOs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite" size={100} color="#bbb" />
          <Text style={styles.emptyTextTitle}>No favourite NGOs yet</Text>
          <Text style={styles.emptyTextBody}>Make sure you have added Favourite NGOs</Text>
          <TouchableOpacity onPress={handleNavigateToIndex} style={styles.button}>
            <Text style={styles.buttonText}>Add Favourite</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favouriteNGOs}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={({ item }) => (
            <FlatList
              data={item.data}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              numColumns={3}
              contentContainerStyle={styles.gridContainer}
              ListHeaderComponent={renderSectionHeader({ section: item })}
            />
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={handleNavigateToIndex} style={styles.button}>
              <Text style={styles.buttonText}>Add More Favourites</Text>
            </TouchableOpacity>
          }
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
    alignContent: 'center',
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
    alignContent: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    marginTop: -15,
    fontSize: 16,
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
    marginVertical: 10,
    textAlign: 'center',
  },
});
