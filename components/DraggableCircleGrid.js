import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CircleItem from './CircleItem';

const DraggableCircleGrid = ({ items }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item) => (
        <CircleItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default DraggableCircleGrid;
