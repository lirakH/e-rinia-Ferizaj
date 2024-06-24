import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CircleItem = ({ item, drag, isActive }) => {
  return (
    <View style={styles.itemContainer} onLongPress={drag}>
      <View style={[styles.circle, isActive && styles.activeCircle]}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    width: 100,
    marginHorizontal: 0,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  activeCircle: {
    borderColor: '#aaa',
    borderWidth: 2,
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default CircleItem;