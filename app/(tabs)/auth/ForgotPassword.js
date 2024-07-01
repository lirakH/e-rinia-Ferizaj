import { Image, StyleSheet, Platform } from 'react-native';
import { ScrollView, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text> Forgot password </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
   flex:1,
   justifyContent:'center',
   alignItems:'center'
  }
});
