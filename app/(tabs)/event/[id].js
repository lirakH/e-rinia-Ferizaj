import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getEventById, getOrganizationById } from '@/endpoints'; // Adjust path as necessary

export default function Page() {
  const { id } = useLocalSearchParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        setEventDetails(eventData);
        if (eventData.organizationId) {
          const organizationData = await getOrganizationById(eventData.organizationId);
          setOrganization(organizationData);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Event ${id}` }} />

      {eventDetails ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: eventDetails.picture || 'https://via.placeholder.com/150' }} style={styles.image} />
            <View style={styles.titleContainer1}>
              <View style={styles.titleContainer}>
              <Text style={styles.title}>{eventDetails.name}</Text>
            </View>
            </View>
          </View>
          <View style={styles.detailsContainer}>
{/*            <View style={styles.shareContainer}>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={{ color: '#fff' }}>Share</Text>
            </TouchableOpacity>
            </View> */}
            <View style={styles.dateContainer}>
              <View style={styles.IconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                </View>
                <View style={styles.infoContainer}>
                <Text style={styles.NGOtitle}>Data:</Text>
                <Text style={styles.date}>{eventDetails.date}</Text>
                </View>
            </View>
            <View style={styles.locationContainer}>
                <View style={styles.IconContainer}>
                <Ionicons name="location-outline" size={20} color="#fff" />
                </View>
                <View style={styles.infoContainer}>
                <Text style={styles.NGOtitle}>Lokacioni:</Text>
                <Text style={styles.location}>{eventDetails.place}</Text>
                </View>
            </View>
            {organization && (
              <View style={styles.organizationContainer}>
                <Image source={{ uri: organization.picture || 'https://via.placeholder.com/100' }} style={styles.organizationImage} />
                <View style={styles.infoContainer}>
                  <Text style={styles.NGOtitle}>Event i organizuar nga:</Text>
                  <Text style={styles.ngoName}>{organization.name}</Text>
                </View>
              </View>
            )}
            <Text style={styles.descriptionTitle}>Pershkrimi i Eventit</Text>
            <Text style={styles.description}>{eventDetails.description}</Text>
          </View>
        </ScrollView>
      ) : (
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>Event not found</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  titleContainer1: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    bottom: -15,
    padding: 20,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  shareContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#0091F9',
    padding: 10,
    borderRadius: 5,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  IconContainer: {
    backgroundColor: '#0091F9',
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  organizationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  organizationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ngoName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  descriptionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'left',
  }
});
