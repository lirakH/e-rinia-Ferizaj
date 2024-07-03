import { Image, StyleSheet, ScrollView, Text } from 'react-native';

export default function AdminScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text> Admin </Text>
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
