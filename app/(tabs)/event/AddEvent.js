import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AddEvent = () => {
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

  const handleAddEvent = () => {
    // Handle the logic to add the event
    console.log('Event Details:', eventDetails);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Event</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
          <Text style={styles.buttonText}>Add Event</Text>
        </TouchableOpacity>
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
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEvent;
