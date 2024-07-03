import { Image, StyleSheet, ScrollView, Text } from 'react-native';

export default function VolunteerScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text> Volunteer </Text>
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
