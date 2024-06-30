import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import EventList from "@/components/EventList.js";
import DraggableCircleGrid from '@/components/DraggableCircleGrid'; // Adjust path as necessary
import { getAllOrganizations } from '@/endpoints'; // Adjust path as necessary

const HomeScreen = () => {
  const [typeOneOrganizations, setTypeOneOrganizations] = useState([]);
  const [typeTwoOrganizations, setTypeTwoOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getAllOrganizations();
        //console.log('Fetched organizations data:', data); // Debugging line

        const typeOne = data.filter(org => org.type === 'Institution');
        const typeTwo = data.filter(org => org.type === 'NGO');

        setTypeOneOrganizations(typeOne);
        setTypeTwoOrganizations(typeTwo);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
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
        <Text>Type One Organizations</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <DraggableCircleGrid items={typeOneOrganizations.map(org => ({ id: org.id.toString(), label: org.name, picture: org.picture || 'https://via.placeholder.com/150' }))} />

      <View style={styles.titleContainer}>
        <Text>Type Two Organizations</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <DraggableCircleGrid items={typeTwoOrganizations.map(org => ({ id: org.id.toString(), label: org.name, picture: org.picture || 'https://via.placeholder.com/150' }))} />
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
