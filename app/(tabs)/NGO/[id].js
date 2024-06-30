// app/(tabs)/NGO/[id].js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import EventItem2 from '@/components/EventItem2';
import MemberList from '@/components/MemberList';
import { getOrganizationById } from '@/endpoints'; // Adjust path as necessary

export default function Page() {
  const { id } = useLocalSearchParams();
  const [ngoDetails, setNgoDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await getOrganizationById(id);
        setNgoDetails(data);
      } catch (error) {
        console.error('Error fetching NGO details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  const renderNGODetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: ngoDetails.logo || 'https://via.placeholder.com/150' }} style={styles.logo} />
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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  const sections = [
    { title: 'Ngo Details', data: [ngoDetails], renderItem: renderNGODetails },
  ];

  if (ngoDetails?.type === 'Institution' && ngoDetails.members) {
    sections.push({ title: 'Members', data: [{ members: ngoDetails.members }], renderItem: renderMemberSection });
  }

  if (ngoDetails?.events) {
    sections.push({ title: 'Upcoming Events', data: ngoDetails.events, horizontal: true });
  }

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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
