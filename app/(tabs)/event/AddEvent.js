import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createEvent, uploadEventPicture } from '@/endpoints'; // Adjust the import path as needed

const AddEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    picture: '',
    name: '',
    date: new Date(),
    place: '',
    description: '',
    adminComment: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setEventDetails({ ...eventDetails, [field]: value });
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEventDetails({ ...eventDetails, picture: result.uri });
    }
  };

  const handleAddEvent = async () => {
    try {
      // Create event data
      const eventData = {
        name: eventDetails.name,
        date: eventDetails.date.toISOString(),
        place: eventDetails.place,
        description: eventDetails.description,
        adminComment: eventDetails.adminComment,
      };

      const createdEvent = await createEvent(eventData);
      Alert.alert('Success', 'Event created successfully.');

      // Upload event picture
      if (eventDetails.picture) {
        const formData = new FormData();
        formData.append('picture', {
          uri: eventDetails.picture,
          name: 'eventPicture.jpg',
          type: 'image/jpeg',
        });

        await uploadEventPicture(createdEvent.id, formData);
        Alert.alert('Success', 'Event picture uploaded successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
      console.error(error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventDetails.date;
    setShowDatePicker(false);
    setEventDetails({ ...eventDetails, date: currentDate });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Event</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handlePickImage}>
          <View style={styles.imageContainer}>
            {eventDetails.picture ? (
              <Image source={{ uri: eventDetails.picture }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>Event Picture</Text>
            )}
          </View>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={eventDetails.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>{eventDetails.date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={eventDetails.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
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
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Admin Comment"
          value={eventDetails.adminComment}
          editable={false}
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
  readOnlyInput: {
    backgroundColor: '#f1f1f1',
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
});

export default AddEvent;
