import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CircleItem from '@/components/CircleItem';
import { useRouter } from 'expo-router';

export default function NgoScreen() {
  const [NGOs, setNGOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        // Sample JSON data
        const sampleData = [
          {
            title: 'NGOs',
            data: [
              {
                id: '1',
                name: 'NGO 1',
                picture: 'https://example.com/ngo1.jpg',
                description: 'Description of NGO 1',
                type: 'NGO',
              },
              {
                id: '2',
                name: 'NGO 2',
                picture: 'https://example.com/ngo2.jpg',
                description: 'Description of NGO 2',
                type: 'NGO',
              },
              {
                id: '1',
                name: 'NGO 1',
                picture: 'https://example.com/ngo1.jpg',
                description: 'Description of NGO 1',
                type: 'NGO',
              },
              {
                id: '2',
                name: 'NGO 2',
                picture: 'https://example.com/ngo2.jpg',
                description: 'Description of NGO 2',
                type: 'NGO',
              },
              {
                id: '1',
                name: 'NGO 1',
                picture: 'https://example.com/ngo1.jpg',
                description: 'Description of NGO 1',
                type: 'NGO',
              },
              {
                id: '2',
                name: 'NGO 2',
                picture: 'https://example.com/ngo2.jpg',
                description: 'Description of NGO 2',
                type: 'NGO',
              },
              {
                id: '1',
                name: 'NGO 1',
                picture: 'https://example.com/ngo1.jpg',
                description: 'Description of NGO 1',
                type: 'NGO',
              },
              {
                id: '2',
                name: 'NGO 2',
                picture: 'https://example.com/ngo2.jpg',
                description: 'Description of NGO 2',
                type: 'NGO',
              },
            ],
          },
          {
            title: 'Other Organizations',
            data: [
              {
                id: '2',
                name: 'NGO 1',
                picture: 'https://example.com/org1.jpg',
                description: 'Description of Organization 1',
                type: 'government',
              },
              {
                id: '4',
                name: 'NGO 2',
                picture: 'https://example.com/org2.jpg',
                description: 'Description of Organization 1',
                type: 'government',
              },
              {
                id: '3',
                name: 'NGO 1',
                picture: 'https://example.com/org1.jpg',
                description: 'Description of Organization 1',
                type: 'Other',
              },
              {
                id: '4',
                name: 'Organizata aaa  2',
                picture: 'https://example.com/org2.jpg',
              },
              {
                id: '3',
                name: 'NGO 1',
                picture: 'https://example.com/org1.jpg',
                description: 'Description of Organization 1',
                type: 'government',
              },
              {
                id: '4',
                name: 'NGO 2',
                picture: 'https://example.com/org2.jpg',
              },
              {
                id: '3',
                name: 'Organizata aaa 1',
                picture: 'https://example.com/org1.jpg',
                description: 'Description of Organization 1',
                type: 'government',
              },
              {
                id: '4',
                name: 'NGO 2',
                picture: 'https://example.com/org2.jpg',
              },

            ],
          },
        ];

        setNGOs(sampleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNGOs();
  }, []);


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
      {NGOs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTextTitle}>No NGOs yet</Text>
          <Text style={styles.emptyTextBody}>They will be added shortly</Text>
        </View>
      ) : (
        <FlatList
          data={NGOs}
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
    marginHorizontal: 10,
    width: 100,
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
    marginVertical: 20,
    textAlign: 'center',
    marginBottom: 25,
  },
});
