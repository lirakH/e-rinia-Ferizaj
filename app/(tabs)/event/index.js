import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SectionList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import EventList from "@/components/EventList";
import EventList2 from "@/components/EventList2";
import { getApprovedEvents, getOrganizationById } from '@/endpoints';

const POLLING_INTERVAL = 30000; // 30 seconds

const EventScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newestEvents, setNewestEvents] = useState([]);
  const [institutionalEvents, setInstitutionalEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const fetchEventsAndOrganizations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApprovedEvents();
      const fetchedEvents = response.data || [];
  
      const eventPromises = fetchedEvents.map(async (event) => {
        const organization = await getOrganizationById(event.organizationId);
        return { ...event, organizationType: organization.type };
      });
  
      const eventsWithOrgTypes = await Promise.all(eventPromises);
  
      // Sort events in descending order by creation time (newest first)
      const sortedEvents = eventsWithOrgTypes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      setEvents(sortedEvents);
  
      const latestEvents = sortedEvents.slice(0, 10); // Get the 10 most recently created events
      const instEvents = sortedEvents.filter(event => event.organizationType === 'Institution');
  
      setNewestEvents(latestEvents);
      setInstitutionalEvents(instEvents);
      setAllEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events and organizations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEventsAndOrganizations();
      return () => {
        // This is the cleanup function, which runs when the screen loses focus
        // You can cancel any subscriptions or async tasks here if needed
      };
    }, [fetchEventsAndOrganizations])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetchEventsAndOrganizations();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchEventsAndOrganizations]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderSectionHeader = ({ section }) => (
    <View style={styles.titleContainer}>
      <Text style={styles.titleContainerTitle}>{section.title}</Text>
    </View>
  );

  const sections = [
    { title: 'Aktivitetet e reja', data: [newestEvents], renderItem: () => <EventList events={newestEvents} /> },
    { title: 'Aktivitetet Institucionale', data: [institutionalEvents], renderItem: () => <EventList events={institutionalEvents} /> },
    { title: 'Te gjitha Aktivitetet', data: [allEvents], renderItem: () => <EventList2 events={allEvents} /> }
  ];

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      renderItem={({ section }) => section.renderItem()}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.sectionList}
      stickySectionHeadersEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  titleContainerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});

export default EventScreen;
