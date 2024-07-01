import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import EventItem2 from '@/components/EventItem2';
import MemberList from '@/components/MemberList';
import { getOrganizationById, getEventsByOrganization } from '@/endpoints';

export default function Page() {
  const { id } = useLocalSearchParams();
  const [ngoDetails, setNgoDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGODetails = async () => {
      try {
        const fetchedNGODetails = await getOrganizationById(id);
        const fetchedEvents = await getEventsByOrganization(id);
        // Placeholder for fetching members
        const fetchedMembers = []; // await getMembersByOrganization(id);

        console.log('fetchedEvents', fetchedEvents);
        setNgoDetails(fetchedNGODetails);
        setEvents(fetchedEvents);
        setMembers(fetchedMembers);
      } catch (error) {
        console.error('Error fetching NGO details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNGODetails();
  }, [id]);

  const renderNGODetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: ngoDetails.picture }} style={styles.logo} />
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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const sections = [
    { title: 'Ngo Details', data: [ngoDetails], renderItem: renderNGODetails },
    { title: 'Eventet e Organizates', data: events.length > 0 ? events : [{ id: 'no-events', title: 'No Events at the moment', date: '', location: '', picture: '' }], horizontal: true },
  ];

  if (ngoDetails && ngoDetails.type === 'government' && members.length > 0) {
    sections.push({ title: 'Members', data: [{ members }], renderItem: renderMemberSection });
  }

  const renderItem = ({ item }) => {
    if (item.id === 'no-events') {
      return <Text style={styles.noEventsText}>{item.title}</Text>;
    }
    return <EventItem2 event={item} />;
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: `NGO ${id}` }} />

      {ngoDetails ? (
        <SectionList
          sections={sections}
          renderItem={renderItem}
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
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
});
