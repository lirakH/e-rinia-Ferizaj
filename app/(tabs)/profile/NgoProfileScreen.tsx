import { Image, StyleSheet, ScrollView, Text } from 'react-native';

export default function NGOScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text> NGO </Text>
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
