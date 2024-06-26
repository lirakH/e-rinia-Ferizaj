// app/(tabs)/NGO/[id].js
import React from 'react';
import { View, Text, Image, StyleSheet, SectionList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import EventItem2 from '@/components/EventItem2';
import MemberList from '@/components/MemberList';

// Sample NGO data
const sampleNGOs = [
  {
    id: '1',
    name: 'Music Lovers Foundation',
    description: 'We are a non-profit organization dedicated to promoting music education and appreciation.',
    logo: 'https://via.placeholder.com/150',
    type: 'ngo',
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
    ],
  },
  {
    id: '2',
    name: 'Ministry of Education',
    description: 'Government organization for education',
    logo: 'https://via.placeholder.com/150',
    type: 'government',
    members: [
      { id: '1', name: 'John Doe', position: "kryetarë", picture: 'https://via.placeholder.com/100' },
      { id: '2', name: 'Jane Smith', position: "kryetarë", picture: 'https://via.placeholder.com/100' },
      { id: '3', name: 'Michael Johnson', position: "kryetarë", picture: 'https://via.placeholder.com/100' },
      { id: '4', name: 'Michael Johnson', position: "kryetarë", picture: 'https://via.placeholder.com/100' },
    ],
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
        id: '3',
        title: 'National Education Conference',
        date: '20 August',
        location: 'Washington D.C., USA',
      },
    ],
  },
];

export default function Page() {
  const { id } = useLocalSearchParams();

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

  const renderMemberSection = ({ item }) => (
    <View style={styles.memberSectionContainer}>
      <MemberList members={item.members} />
    </View>
  );

  const renderSectionHeader = ({ section }) => {
    if (section.title === 'Ngo Details') {
      return null;
    }
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  };

  const renderEventItem = ({ item }) => <EventItem2 event={item} />;

  const sections = [
    { title: 'Ngo Details', data: [ngoDetails], renderItem: renderNGODetails },
  ];

  if (ngoDetails.type === 'government' && ngoDetails.members) {
    sections.push({ title: 'Members', data: [{ members: ngoDetails.members }], renderItem: renderMemberSection });
  }

  sections.push({ title: 'Upcoming Events', data: ngoDetails.events, horizontal: true });

  return (
    <>
      <Stack.Screen options={{ headerTitle: `NGO ${id}` }} />

      {ngoDetails ? (
        <SectionList
          sections={sections}
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
  memberSectionContainer: {
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#f1f1f1',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
