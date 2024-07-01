import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const ApproveEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    picture: '',
    name: '',
    date: '',
    place: '',
    description: '',
    adminComment: ''
  });

  const handleInputChange = (field, value) => {
    setEventDetails({ ...eventDetails, [field]: value });
  };

  const handleApproveEvent = () => {
    // Handle the logic to approve the event
    console.log('Approved Event Details:', eventDetails);
  };

  const handleRejectEvent = () => {
    // Handle the logic to reject the event
    console.log('Rejected Event Details:', eventDetails);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Approve Event</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Event Picture"
          value={eventDetails.picture}
          onChangeText={(value) => handleInputChange('picture', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={eventDetails.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Event Date"
          value={eventDetails.date}
          onChangeText={(value) => handleInputChange('date', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Event Place"
          value={eventDetails.place}
          onChangeText={(value) => handleInputChange('place', value)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Event Description"
          value={eventDetails.description}
          onChangeText={(value) => handleInputChange('description', value)}
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
});

export default ApproveEvent;
