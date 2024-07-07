import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getEventById, updateEvent, uploadEventPicture } from '@/endpoints';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '@/AuthContext';
import { MEDIA_BASE_URL } from '@/config';

const UpdateEvent = () => {
  const route = useRoute();
  const eventId = route.params?.id;

  const [eventDetails, setEventDetails] = useState({
    id: '',
    picture: '',
    name: '',
    date: new Date(),
    place: '',
    description: '',
    adminComment: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter();
  const { userRole } = useContext(AuthContext);

  useEffect(() => {
    if (userRole !== 'organization') {
      //Alert.alert('Access Denied', 'Only organizations can update events.');
      router.replace('/'); // or wherever you want to redirect non-organization users
      return;
    }

    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
      }
    })();
  }, [userRole]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEventDetails({
          id: eventData.id,
          picture: eventData.picture ? `${MEDIA_BASE_URL}${eventData.picture}` : '',
          name: eventData.name,
          date: new Date(eventData.date),
          place: eventData.place,
          description: eventData.description,
          adminComment: eventData.adminComment || '',
        });
      } catch (error) {
        console.error('Error fetching event data:', error);
        Alert.alert('Error', 'Failed to fetch event data. Please try again.');
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const handleInputChange = (field, value) => {
    setEventDetails({ ...eventDetails, [field]: value });
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled) {
        setEventDetails({ ...eventDetails, picture: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const eventData = {
        name: eventDetails.name,
        date: eventDetails.date.toISOString(),
        place: eventDetails.place,
        description: eventDetails.description,
        approved: 0, // Set approved to 0 when updating the event
      };

      console.log('Sending event data:', eventData);

      const updatedEvent = await updateEvent(eventDetails.id, eventData);
      console.log('Event updated:', updatedEvent);

      if (eventDetails.picture && eventDetails.picture !== updatedEvent.picture) {
        const formData = new FormData();
        const uriParts = eventDetails.picture.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('picture', {
          uri: eventDetails.picture,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });

        console.log('Uploading picture for event:', updatedEvent.id);
        await uploadEventPicture(updatedEvent.id, formData);
        console.log('Picture uploaded successfully');
      }

      Alert.alert('Success', 'Event updated and picture uploaded successfully.');
      router.back();
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response) {
        errorMessage = error.response.data.message || error.response.data;
      } else if (error.request) {
        errorMessage = 'No response received from server';
      } else {
        errorMessage = error.message;
      }
      Alert.alert('Error', `Failed to update event: ${errorMessage}`);
      console.error('Full error:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setEventDetails({ ...eventDetails, date: selectedDate });
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
        setShowTimePicker(true);
      }
    } else {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const currentDate = new Date(eventDetails.date);
      currentDate.setHours(selectedTime.getHours());
      currentDate.setMinutes(selectedTime.getMinutes());
      setEventDetails({ ...eventDetails, date: currentDate });
    }
    setShowTimePicker(false);
  };

  if (userRole !== 'organization') {
    return null; // Render nothing while redirecting
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Update Event</Text>
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
          <Text style={styles.dateText}>{eventDetails.date.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={eventDetails.date}
            mode="date" // Set mode to "date" for date selection
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={eventDetails.date}
            mode="time" // Set mode to "time" for time selection
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
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
        <View style={styles.readOnlyInputContainer}>
          <ScrollView nestedScrollEnabled={true}>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Admin Comment"
              value={eventDetails.adminComment}
              editable={false}
              multiline={true}
            />
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleUpdateEvent}>
          <Text style={styles.buttonText}>Update Event</Text>
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
  readOnlyInputContainer: {
    maxHeight: 100, // Adjust max height as needed
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    textAlignVertical: 'top', // Align text to the top
    borderWidth: 0,
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
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    color: '#fff',
    fontSize: 16,
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

export default UpdateEvent;
