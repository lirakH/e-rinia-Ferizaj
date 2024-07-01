import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SectionList, FlatList } from 'react-native';
import EventItem2 from '@/components/EventItem2';
import { getAllEvents, getOrganizationById } from '@/endpoints';

const EventScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newestEvents, setNewestEvents] = useState([]);
  const [institutionalEvents, setInstitutionalEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const fetchEventsAndOrganizations = async () => {
      try {
        const response = await getAllEvents();
        const fetchedEvents = response.data || [];

        const eventPromises = fetchedEvents.map(async (event) => {
          const organization = await getOrganizationById(event.organizationId);
          return { ...event, organizationType: organization.type };
        });

        const eventsWithOrgTypes = await Promise.all(eventPromises);

        setEvents(eventsWithOrgTypes);

        const sortedEvents = [...eventsWithOrgTypes].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestEvents = sortedEvents.slice(0, 10);
        const instEvents = sortedEvents.filter(event => event.organizationType === 'Institution');

        setNewestEvents(latestEvents);
        setInstitutionalEvents(instEvents);
        setAllEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events and organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndOrganizations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderSectionHeader = ({ section }) => {
    if (section.horizontal) {
      return null;
    }
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleContainerTitle}>{section.title}</Text>
      </View>
    );
  };

  const renderHorizontalList = (data, title) => (
    <View style={styles.horizontalSection}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleContainerTitle}>{title}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <EventItem2 event={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const renderVerticalList = (data) => (
    <FlatList
      data={data}
      renderItem={({ item }) => <EventItem2 event={item} />}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.verticalList}
    />
  );

  const sections = [
    {
      title: 'Te gjitha Aktivitetet',
      data: allEvents.length > 0 ? allEvents : [{ id: 'no-events', title: 'No Events at the moment', date: '', location: '', picture: '' }],
      horizontal: false
    }
  ];

  return (
    <SectionList
      sections={sections}
      renderItem={({ item, section }) => null} // Handle rendering in ListFooterComponent
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.sectionList}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={() => (
        <>
          {renderHorizontalList(newestEvents, 'Aktivitetet e reja')}
          {renderHorizontalList(institutionalEvents, 'Aktivitetet Institucionale')}
        </>
      )}
      ListFooterComponent={() => (
        <View style={styles.verticalSection}>
          {sections.map((section, index) => (
            <View key={index}>
              {renderVerticalList(section.data)}
            </View>
          ))}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 30,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  horizontalSection: {
    paddingVertical: 10,
    marginBottom: 20, // Add margin to separate sections
  },
  horizontalList: {
    paddingVertical: 10,
    alignItems: 'center', // Center the events horizontally
  },
  verticalSection: {
    paddingVertical: 10,
    marginBottom: 20,
    alignItems: 'center', // Center the events vertically
  },
  verticalList: {
    paddingVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionList: {
    paddingBottom: 20,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
});

export default EventScreen;
