import { Image, StyleSheet, Platform } from 'react-native';
import { ScrollView, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text> Safe </Text>
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
