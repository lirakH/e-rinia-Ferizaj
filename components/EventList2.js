import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import EventItem2 from './EventItem2';

const EventList2 = ({ events }) => {
  return (
    <View style={styles.eventsContainer}>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventItem2 event={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  eventsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  eventListContainer: {
    paddingVertical: 20,
  },
});

export default EventList2;
