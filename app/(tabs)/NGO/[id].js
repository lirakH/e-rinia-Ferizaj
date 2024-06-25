import React from 'react';
import { View, Text, Image, StyleSheet, SectionList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import EventItem2 from '@/components/EventItem2';

// Sample NGO data
const sampleNGOs = [
  {
    id: '1',
    name: 'Music Lovers Foundation',
    description: 'We are a non-profit organization dedicated to promoting music education and appreciation.',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/350x200',
    events: [
      {
        id: '1',
        title: 'International Band Music',
        date: '10 June',
        location: '36 Guild Street London, UK',
      },
      {
        id: '2',
        title: 'Jazz Festival',
        date: '15 July',
        location: '42 Park Avenue, New York',
      },
      {
        id: '1',
        title: 'International Band Music',
        date: '10 June',
        location: '36 Guild Street London, UK',
      },
      {
        id: '2',
        title: 'Jazz Festival',
        date: '15 July',
        location: '42 Park Avenue, New York',
      },
      {
        id: '1',
        title: 'International Band Music',
        date: '10 June',
        location: '36 Guild Street London, UK',
      },
      {
        id: '2',
        title: 'Jazz Festival',
        date: '15 July',
        location: '42 Park Avenue, New York',
      },
      // Add more events as needed
    ],
  },
  // Add more sample NGOs as needed
];

export default function Page() {
  const { id } = useLocalSearchParams();

  // Find the NGO details from the sample data based on the `id`
  const ngoDetails = sampleNGOs.find((ngo) => ngo.id === id);

  const renderNGODetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: ngoDetails.logo }} style={styles.logo} />
        <Text style={styles.name}>{ngoDetails.name}</Text>
      </View>
      <Text style={styles.description}>{ngoDetails.description}</Text>
    </View>
  );

  const renderEventItem = ({ item }) => <EventItem2 event={item} />;

  const renderSectionHeader = ({ section }) => {
    if (section.title === 'Upcoming Events') {
      return <Text style={styles.sectionHeader}>{section.title}</Text>;
    }
    return null;
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: `NGO ${id}` }} />

      {ngoDetails ? (
        <SectionList
          sections={[
            { data: [ngoDetails], renderItem: renderNGODetails },
            { title: 'Upcoming Events', data: ngoDetails.events, horizontal: true },
          ]}
          renderItem={renderEventItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.container}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>NGO not found</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 10,
  },
});
