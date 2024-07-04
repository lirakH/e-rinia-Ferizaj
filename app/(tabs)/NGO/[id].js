import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Image, StyleSheet, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import EventItem2 from '@/components/EventItem2';
import MemberList from '@/components/MemberList';
import { getOrganizationById, getEventsByOrganization, favoriteOrganization, unfavoriteOrganization, getLikedOrganizations } from '@/endpoints';
import { AuthContext } from '@/AuthContext';
import { MEDIA_BASE_URL } from '@/config';

export default function Page() {
  const { id } = useLocalSearchParams();
  const [ngoDetails, setNgoDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { userToken, userRole } = useContext(AuthContext);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedNGODetails, fetchedEvents] = await Promise.all([
        getOrganizationById(id),
        getEventsByOrganization(id)
      ]);
      
      setNgoDetails(fetchedNGODetails);
      
      // Filter approved events and sort them by date (most recent first)
      const approvedEvents = fetchedEvents
        .filter(event => event.approved)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setEvents(approvedEvents);
      
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
  }, [id, userRole]);

  useEffect(() => {
    fetchData();

    return () => {
      // Reset state when component unmounts or id changes
      setNgoDetails(null);
      setEvents([]);
      setMembers([]);
      setIsLiked(false);
    };
  }, [id, fetchData]);

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
        <Image 
          source={{ uri: `${MEDIA_BASE_URL}${ngoDetails.picture}` }} 
          style={styles.logo} 
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        {userRole === 'volunteer' && (
          <TouchableOpacity style={styles.likeButton} onPress={handleLikeButtonPress}>
            <FontAwesome name={isLiked ? 'heart' : 'heart-o'} size={24} color="#007BFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.shortName}>{ngoDetails.shortname}</Text>
        <Text style={styles.name}>{ngoDetails.name}</Text>
      </View>
      
      <Text style={styles.description}>{ngoDetails.description}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }) => {
    if (section.title === 'Ngo Details') {
      return null;
    }
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  };

  const renderEventItem = ({ item }) => {
    if (item.id === 'no-events') {
      return <Text style={styles.noEventsText}>{item.title}</Text>;
    }
    return (
      <View style={styles.eventItemContainer}>
        <EventItem2 event={item} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sections = [
    { title: 'Ngo Details', data: [ngoDetails], renderItem: renderNGODetails },
    { 
      title: 'Eventet e Organizates', 
      data: events.length > 0 ? events : [{ id: 'no-events', title: 'No approved events at the moment' }], 
      renderItem: renderEventItem, 
      horizontal: true 
    },
  ];

  if (ngoDetails && ngoDetails.type === 'government' && members.length > 0) {
    sections.push({ title: 'Members', data: [{ members }], renderItem: renderMemberSection });
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: `NGO ${id}` }} />

      {ngoDetails ? (
        <SectionList
          sections={sections}
          renderItem={({ item, section }) => section.renderItem({ item })}
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
    width: '100%',
    position: 'relative',
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
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  eventItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  notFoundText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
