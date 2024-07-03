import { Image, StyleSheet, Platform } from 'react-native';
import { ScrollView, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function AdminScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text> Add Member </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
   flex:1,
   justifyContent:'center',
   alignItems:'center'
  },
  link:{
    margin:10,
  }
});
