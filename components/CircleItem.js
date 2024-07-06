import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MEDIA_BASE_URL } from '@/config';


const CircleItem = ({ item }) => {
  const router = useRouter();

  const handleCirclePress = () => {
    router.push(`/NGO/${item.id}`);
  };

  return (
    <Pressable style={styles.itemContainer} onPress={handleCirclePress}>
      <View style={styles.circle}>
        <Image 
          source={{ uri: `${MEDIA_BASE_URL}${item.picture}` }} 
          style={styles.image}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      </View>
      <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
        {item.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    width: 100,
    marginHorizontal: 5,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    height: 40, // Adjust this value as needed
  },
});

export default CircleItem;
