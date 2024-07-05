import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, ScrollView, Text, View } from "react-native";
import { AuthContext } from "@/AuthContext"; // Update with the correct path
import { getVolunteerById } from "@/endpoints"; // Update with the correct path

export default function VolunteerScreen() {
  const { userId, userRole } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (userRole === "volunteer") {
          const data = await getVolunteerById(userId);
          setUserInfo(data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userId, userRole]);

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text>Volunteer Information</Text>
      <Text>Name: {userInfo.name}</Text>
      <Text>Email: {userInfo.email}</Text>
      {/* Add more user info as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
