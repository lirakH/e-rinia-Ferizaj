import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const CircleItem = ({ item }) => {
  const router = useRouter();

  const handleCirclePress = () => {
    router.push(`/NGO/${item.id}`);
  };

  return (
    <Pressable style={styles.itemContainer} onPress={handleCirclePress}>
      <View style={styles.circle}>
        <Image source={{ uri: item.picture }} style={styles.image} />
      </View>
      <Text style={styles.label}>{item.label}</Text>
    </Pressable>
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
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default CircleItem;
