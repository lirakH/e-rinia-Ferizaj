import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  Feather,
} from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
      <View style={styles.container2}>
        <Link href="/" >
        <Feather
              name="home" 
              size={25} 
              color={"#fff"}
            />
        </Link>
        <Link href="/favourite" >
        <Feather
              name="heart" 
              size={25} 
              color={"#fff"}
            />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    height: 50,
    backgroundColor: "#0091F9",
    color: "#fff"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
