import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllEvents } from '@/endpoints';
import EventItem2 from '@/components/EventItem2';
import { AuthContext } from '@/AuthContext';

const AdminScreen = () => {
  const { userRole, isLoading, logout } = useContext(AuthContext);
  const [nonApprovedEvents, setNonApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Checking user role and loading state...');
      console.log('isLoading:', isLoading, 'userRole:', userRole);
      if (!isLoading) {
        if (userRole !== 'admin' || userRole === null) {
          console.log('Redirecting to profile/index due to invalid role or null role...');
          router.push('profile');
        }
      }
    }, [isLoading, userRole, router])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchNonApprovedEvents = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getAllEvents();
          if (!response || !response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response from getAllEvents');
          }

          const filteredEvents = response.data.filter(event => event.approved === false);
          setNonApprovedEvents(filteredEvents);
        } catch (error) {
          console.error('Error fetching non-approved events:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNonApprovedEvents();
    }, [])
  );

  const handleAddNGO = () => {
    router.push('NGO/AddNgo');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleApproveEvent = (eventId) => {
    console.log('Navigating to ApproveEvent with id:', eventId);
    router.push(`/event/ApproveEvent?id=${eventId}`);
  };
  
  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddNGO}>
        <Text style={styles.buttonText}>Add NGO</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Non-Approved Events</Text>

      {nonApprovedEvents.length > 0 ? (
        nonApprovedEvents.map((event) => (
          <View key={event.id} style={styles.eventContainer}>
            <EventItem2 event={event} />
            <TouchableOpacity 
              style={styles.approveButton} 
              onPress={() => handleApproveEvent(event.id)}
            >
              <Text style={styles.approveButtonText}>Approve / Reject</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noEventsText}>No events pending approval</Text>
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noEventsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AdminScreen;
