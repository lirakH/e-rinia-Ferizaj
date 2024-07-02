import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import EventItem2 from '@/components/EventItem2';
import MemberList from '@/components/MemberList';
import { getOrganizationById, getEventsByOrganization, favoriteOrganization, unfavoriteOrganization, getLikedOrganizations } from '@/endpoints';
import { AuthContext } from '@/AuthContext';

export default function Page() {
  const { id } = useLocalSearchParams();
  const [ngoDetails, setNgoDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { userToken, userRole } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedNGODetails, fetchedEvents] = await Promise.all([
          getOrganizationById(id),
          getEventsByOrganization(id)
        ]);
        
        setNgoDetails(fetchedNGODetails);
        setEvents(fetchedEvents);
        
        if (userRole === 'volunteer') {
          const likedOrganizations = await getLikedOrganizations();
          setIsLiked(likedOrganizations.some(org => org.id.toString() === id.toString()));
        }
        
        // Placeholder for fetching members
        setMembers([]); // await getMembersByOrganization(id);
      } catch (error) {
        console.error('Error fetching NGO details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userRole]);

  const handleLikeButtonPress = async () => {
    if (userRole !== 'volunteer') {
      // Optionally, show an alert that only volunteers can like organizations
      return;
    }
    
    try {
      if (isLiked) {
        await unfavoriteOrganization(id);
      } else {
        await favoriteOrganization(id);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const renderNGODetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.logoContainer}>
        {userRole === 'volunteer' && (
          <TouchableOpacity style={styles.likeButton} onPress={handleLikeButtonPress}>
            <FontAwesome name={isLiked ? 'heart' : 'heart-o'} size={24} color="#007BFF" />
          </TouchableOpacity>
        )}
        <Image 
          source={{ uri: `http://192.168.178.131:4000${ngoDetails.picture}` }} 
          style={styles.logo} 
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        <Text style={styles.shortName}>{ngoDetails.shortname}</Text>
        <Text style={styles.name}>{ngoDetails.name}</Text>
      </View>
      
      <Text style={styles.description}>{ngoDetails.description}</Text>
    </View>
  );
  

  const renderMemberSection = ({ item }) => (
    <View style={styles.memberSectionContainer}>
      <MemberList members={item.members} />
    </View>
  );

  const renderSectionHeader = ({ section }) => {
    if (section.title === 'Ngo Details') {
      return null;
    }
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  };

  const renderEventItem = ({ item }) => <EventItem2 event={item} />;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sections = [
    { title: 'Ngo Details', data: [ngoDetails], renderItem: renderNGODetails },
    { title: 'Eventet e Organizates', data: events.length > 0 ? events : [{ id: 'no-events', title: 'No Events at the moment', date: '', location: '', picture: '' }], horizontal: true },
  ];

  if (ngoDetails && ngoDetails.type === 'government' && members.length > 0) {
    sections.push({ title: 'Members', data: [{ members }], renderItem: renderMemberSection });
  }

  const renderItem = ({ item }) => {
    if (item.id === 'no-events') {
      return <Text style={styles.noEventsText}>{item.title}</Text>;
    }
    return <EventItem2 event={item} />;
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: `NGO ${id}` }} />

      {ngoDetails ? (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.container}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <Text style={styles.notFoundText}>NGO not found</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  shortName: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  likeButton: {
    padding: 10,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  memberSectionContainer: {
    marginVertical: 10,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  notFoundText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
