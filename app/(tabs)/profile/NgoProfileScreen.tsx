import { Image, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

export default function NGOScreen() {
    const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.Title} > NGO Page</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('event/AddEvent')}>
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>

      <Text style={styles.Title2} > Events </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
   flex:1,
   alignItems:'center'
  },
  Title:{
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  Title2:{
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  link:{
    margin:10,
  },
  button: {
    backgroundColor: "#0091F9",
    padding: 20,
    borderRadius: 15,
    width: 200,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
