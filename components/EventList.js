import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import EventItem from './EventItem';

const EventList = ({ events }) => {
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <View style={styles.noEventsContainer}>
        <Text>No events available</Text>
      </View>
    );
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => (
    <EventItem item={item} drag={drag} isActive={isActive} />
  );

  return (
    <View style={{ flex: 1, marginLeft: -15 }}>
      <DraggableFlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={({ data }) => {/* Handle drag end if needed */}}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20, gap: 5 }}
        simultaneousHandlers={[]}
        activationDistance={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginBottom: 40,
  },
});

export default EventList;
