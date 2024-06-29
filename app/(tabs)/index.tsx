import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import EventList from "@/components/EventList.js";
import DraggableCircleGrid from '@/components/DraggableCircleGrid'; // Adjust path as necessary
import { getAllOrganizations } from '@/endpoints'; // Adjust path as necessary

const HomeScreen = () => {
  const [typeOneNGOs, setTypeOneNGOs] = useState([]);
  const [typeTwoNGOs, setTypeTwoNGOs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await getAllOrganizations();
        const ngos = response.data || [];
        console.log("Fetched NGOs:", ngos); // Debug log
        setTypeOneNGOs(ngos.filter(org => org.type === 'inst')); // Filter for type 'inst'
        setTypeTwoNGOs(ngos.filter(org => org.type === 'NGO')); // Filter for type 'NGO'
        console.log("Type One NGOs:", ngos.filter(org => org.type === 'inst')); // Debug log
        console.log("Type Two NGOs:", ngos.filter(org => org.type === 'NGO')); // Debug log
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNGOs();
  }, []);
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text>Activities and Events</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <EventList />

      <View style={styles.titleContainer}>
        <Text>Type One NGOs</Text>
        <Link href="/organizations" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      {typeOneNGOs.length > 0 ? (
        <DraggableCircleGrid items={typeOneNGOs} />
      ) : (
        <Text>No Type One NGOs at the moment</Text>
      )}

      <View style={styles.titleContainer}>
        <Text>Type Two NGOs</Text>
        <Link href="/organizations" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      {typeTwoNGOs.length > 0 ? (
        <DraggableCircleGrid items={typeTwoNGOs} />
      ) : (
        <Text>No Type Two NGOs at the moment</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
