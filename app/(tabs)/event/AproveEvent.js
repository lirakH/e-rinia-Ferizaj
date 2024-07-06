import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getEventById, approveEvent } from '@/endpoints';
import { MEDIA_BASE_URL } from '@/config';
import { AuthContext } from '@/AuthContext';

const ApproveEvent = () => {
  const { id } = useLocalSearchParams();
  const [eventDetails, setEventDetails] = useState({
    picture: '',
    name: '',
    date: new Date(),
    place: '',
    description: '',
    adminComment: ''
  });
  const router = useRouter();
  const { userRole } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      if (userRole !== 'admin') {
        Alert.alert('Access Denied', 'Only administrators can approve events.');
        router.push('profile');
      }
    }, [userRole])
  );

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const event = await getEventById(id);
        setEventDetails({
          ...event,
          date: new Date(event.date),
          adminComment: ''
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
      alert('Event approved successfully');
      router.back();
    } catch (error) {
      console.error('Error approving event:', error);
      alert('Failed to approve event. Please try again.');
    }
  };

  const handleRejectEvent = () => {
    // Handle the logic to reject the event
    console.log('Rejected Event Details:', eventDetails);
  };

  if (userRole !== 'admin') {
    return null; // Render nothing while redirecting
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
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={handleApproveEvent}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={handleRejectEvent}>
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
