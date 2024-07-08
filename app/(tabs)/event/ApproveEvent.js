import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getEventById, approveEvent, updateEvent } from '@/endpoints';
import { MEDIA_BASE_URL } from '@/config';
import { AuthContext } from '@/AuthContext';

const ApproveEvent = () => {
  const router = useRouter();
  const { userRole } = useContext(AuthContext);
  const { id } = useLocalSearchParams();
  const [eventDetails, setEventDetails] = useState({
    picture: '',
    name: '',
    date: new Date(),
    place: '',
    description: '',
    adminComment: '',
    organizationId: null
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) {
        console.log('No id provided');
        return;
      }
      try {
        console.log('Attempting to fetch event details for id:', id);
        const event = await getEventById(id);
        console.log('Received event details:', event);
        if (!event) {
          console.log('Event not found for id:', id);
          return;
        }
        setEventDetails({
          ...event,
          date: new Date(event.date),
          adminComment: event.adminComment || '',
          organizationId: event.organizationId
        });
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleInputChange = (field, value) => {
    setEventDetails({ ...eventDetails, [field]: value });
  };

  const handleApproveEvent = async () => {
    try {
      await approveEvent(id);
      Alert.alert('Success', 'Event approved successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error approving event:', error);
      Alert.alert('Error', 'Failed to approve event. Please try again.');
    }
  };

  const handleRejectEvent = async () => {
    if (!eventDetails.adminComment || eventDetails.adminComment.trim() === '') {
      Alert.alert('Error', 'Please provide a reason for rejection in the admin comment.');
      return;
    }
  
    try {
      await updateEvent(id, {
        adminComment: eventDetails.adminComment,
        approved: false,
        organizationId: eventDetails.organizationId // Include this line
      });
      Alert.alert('Success', 'Event rejected successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error rejecting event:', error);
      Alert.alert('Error', 'Failed to reject event. Please try again.');
    }
  };
 
  

  if (userRole !== 'admin') {
    return <Text>Access Denied. Admin privileges required.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Approve Event</Text>
      <View style={styles.inputContainer}>
        <View style={styles.imageContainer}>
          {eventDetails.picture ? (
            <Image source={{ uri: `${MEDIA_BASE_URL}${eventDetails.picture}` }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>No Event Picture</Text>
          )}
        </View>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Event Name"
          value={eventDetails.name}
          editable={false}
        />
        <View style={[styles.dateInput, styles.readOnlyInput]}>
          <Text style={styles.dateText}>{eventDetails.date.toDateString()}</Text>
        </View>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Event Place"
          value={eventDetails.place}
          editable={false}
        />
        <TextInput
          style={[styles.input, styles.textArea, styles.readOnlyInput]}
          placeholder="Event Description"
          value={eventDetails.description}
          editable={false}
          multiline={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Admin Comment"
          value={eventDetails.adminComment}
          onChangeText={(value) => handleInputChange('adminComment', value)}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.approveButton, eventDetails.approved && styles.disabledButton]} 
            onPress={handleApproveEvent}
            disabled={eventDetails.approved}
          >
            <Text style={styles.buttonText}>
              {eventDetails.approved ? 'Already Approved' : 'Approve'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.rejectButton]} 
            onPress={handleRejectEvent}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 200,
    height: 100,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 100,
    borderRadius: 15,
  },
  imagePlaceholder: {
    color: '#fff',
    textAlign: 'center',
  },
  dateInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  dateText: {
    color: '#000',
  },
  readOnlyInput: {
    backgroundColor: '#f1f1f1',
  },
});

export default ApproveEvent;
