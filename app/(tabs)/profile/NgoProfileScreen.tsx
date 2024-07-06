import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getOrganizationById, getEventsByOrganization, decodeOrganizationToken } from '@/endpoints';
import EventItem2 from '@/components/EventItem2';
import { FontAwesome } from '@expo/vector-icons';
import { MEDIA_BASE_URL } from '@/config';
import { AuthContext } from '@/AuthContext';

const NGOScreen = () => {
  const { userRole, isLoading } = useContext(AuthContext);
  const [ngoDetails, setNgoDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Checking user role and loading state...');
      if (!isLoading) {
        if (userRole !== 'organization' || userRole === null) {
          console.log('Redirecting to index due to invalid role or null role...');
          router.push('profile');
        }
      }
    }, [isLoading, userRole, router])
  );

  useEffect(() => {
    const fetchOrganizationId = async () => {
      try {
        const id = await decodeOrganizationToken();
        setOrganizationId(id);
      } catch (error) {
        console.error('Error decoding organization token:', error);
      }
    };
    fetchOrganizationId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (!organizationId) return;
        setLoading(true);
        try {
          const [fetchedNGODetails, fetchedEvents] = await Promise.all([
            getOrganizationById(organizationId),
            getEventsByOrganization(organizationId)
          ]);
          
          setNgoDetails(fetchedNGODetails);
          
          // Sort events by date (most recent first)
          const sortedEvents = fetchedEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setEvents(sortedEvents);
        } catch (error) {
          console.error('Error fetching NGO details and events:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [organizationId])
  );

  const handleAddEvent = () => {
    router.push('event/AddEvent');
  };

  const handleEditEvent = (eventId) => {
    router.push({
      pathname: 'event/UpdateEvent',
      params: { id: eventId },
    });
  };

  const getApprovalStatus = (approved) => {
    return approved ? 'Aprovuar' : 'Ne Pritje';
  };

  const getApprovalStatusColor = (approved) => {
    return approved ? 'green' : 'red';
  };

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>NGO Profile</Text>

      {ngoDetails && (
        <View style={styles.ngoDetailsContainer}>
          <Image 
            source={{ uri: `${MEDIA_BASE_URL}${ngoDetails.picture}` }} 
            style={styles.logo} 
          />
          <Text style={styles.ngoName}>{ngoDetails.name}</Text>
          <Text style={styles.ngoDescription}>{ngoDetails.description}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>

      <Text style={styles.eventsTitle}>Events</Text>

      {events.length > 0 ? (
        events.map((event) => (
          <View key={event.id} style={styles.eventContainer}>
            <View style={styles.eventHeader}>
              <EventItem2 event={event} />
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => handleEditEvent(event.id)}
              >
                <FontAwesome name="edit" size={24} color="#007BFF" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.eventStatus, { color: getApprovalStatusColor(event.approved) }]}>
              {getApprovalStatus(event.approved)}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noEventsText}>No events at the moment</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ngoDetailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  ngoName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ngoDescription: {
    textAlign: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventContainer: {
    marginBottom: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventStatus: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
  editButton: {
    padding: 10,
  },
  noEventsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default NGOScreen;
