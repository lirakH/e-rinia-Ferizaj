import React, { useState } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import EventItem from './EventItem'; // Ensure this path is correct

const initialEvents = [
    { id: '1', title: 'International Band Music', date: '10 June', location: '36 Guild Street London, UK', image: 'https://via.placeholder.com/150' },
    { id: '2', title: 'International Band Music', date: '10 June', location: '36 Guild Street London, UK', image: 'https://via.placeholder.com/150' },
    { id: '3', title: 'International Band Music', date: '10 June', location: '36 Guild Street London, UK', image: 'https://via.placeholder.com/150' },
    { id: '4', title: 'International Band Music', date: '10 June', location: '36 Guild Street London, UK', image: 'https://via.placeholder.com/150' },
    { id: '5', title: 'International Band Music', date: '10 June', location: '36 Guild Street London, UK', image: 'https://via.placeholder.com/150' },
    // Include additional events as required
];

const EventList = () => {
  const [events, setEvents] = useState(initialEvents);

  return (
    <View style={{ flex: 1, marginLeft: -15,  }}>
      <DraggableFlatList
        data={events}
        renderItem={({ item }) => <EventItem item={item} />}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setEvents(data)}
        horizontal
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20, gap: 5 }} // Adjust padding as needed
      />
    </View>
  );
};

export default EventList;
