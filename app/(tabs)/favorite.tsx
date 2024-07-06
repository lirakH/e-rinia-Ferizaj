import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SectionList } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import CircleItem from '@/components/CircleItem';
import { MaterialIcons } from '@expo/vector-icons';
import { getLikedOrganizations } from '@/endpoints';
import { AuthContext } from '@/AuthContext';

export default function FavouriteScreen() {
  const [favouriteNGOs, setFavouriteNGOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { userToken, userRole } = useContext(AuthContext);

  const fetchFavorites = useCallback(async () => {
    if (userRole === 'volunteer') {
      try {
        setIsLoading(true);
        const data = await getLikedOrganizations();
        const ngos = data.filter(item => item.type === 'NGO');
        const otherOrganizations = data.filter(item => item.type !== 'NGO');

        setFavouriteNGOs([
          { title: 'Institutions', data: otherOrganizations },
          { title: 'NGOs', data: ngos }
        ]);
      } catch (err) {
        console.error('Error fetching liked organizations:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [userRole]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchFavorites().then(() => setIsRefreshing(false));
  }, [fetchFavorites]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CircleItem item={item} onRemove={fetchFavorites} />
      <Text style={styles.itemName}>{item.shortname}</Text>
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userToken) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyTextTitle}>You are not signed in</Text>
        <Text style={styles.emptyTextBody}>Sign in to check your favourite NGOs</Text>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (userRole === 'organization' || userRole === 'admin') {
    return (
      <View style={styles.container}>
        <MaterialIcons name="block" size={100} color="#bbb" />
        <Text style={styles.emptyTextTitle}>Access Restricted</Text>
        <Text style={styles.emptyTextBody}>
          This page is only accessible to volunteers. You are currently logged in as {userRole === 'organization' ? 'an organization' : 'an admin'}.
        </Text>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.button}>
          <Text style={styles.buttonText}>Go to Profile</Text>
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

  const allSectionsEmpty = favouriteNGOs.every(section => section.data.length === 0);

  return (
    <View style={styles.container}>
      {allSectionsEmpty ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite" size={100} color="#bbb" />
          <Text style={styles.emptyTextTitle}>No favourite NGOs yet</Text>
          <Text style={styles.emptyTextBody}>Make sure you have added Favourite NGOs</Text>
          <TouchableOpacity onPress={() => router.push('/NGO')} style={styles.button}>
            <Text style={styles.buttonText}>Add Favourite</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <SectionList
            sections={favouriteNGOs}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item, section }) => null}
            ListHeaderComponent={() => null}
            ListFooterComponent={() => null}
            SectionSeparatorComponent={() => null}
            renderSectionFooter={({ section }) => renderSection({ section })}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
          <TouchableOpacity onPress={() => router.push('/NGO')} style={styles.button}>
            <Text style={styles.buttonText}>Add More Favourites</Text>
          </TouchableOpacity>
        </>
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
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
  emptyTextBody: {
    fontSize: 14,
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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
    textAlign: 'center',
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
  },
});
