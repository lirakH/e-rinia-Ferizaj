import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import EventList from "@/components/EventList.js";
import DraggableCircleGrid from '@/components/DraggableCircleGrid';
import { getAllOrganizations } from '@/endpoints';

const HomeScreen = () => {
  const [typeOneOrganizations, setTypeOneOrganizations] = useState([]);
  const [typeTwoOrganizations, setTypeTwoOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getAllOrganizations();
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

  const handleSafePress = () => {
    router.push('/safe');
  };
  
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

      <View style={styles.titleContainer}>
        <Text>Safe Zona</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <TouchableOpacity onPress={handleSafePress} style={styles.safeContainer}>
        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Kosovo-Police_logo.svg/1200px-Kosovo-Police_logo.svg.png' }} style={styles.logoPlaceholder} />
        <View style={styles.safeContent}>
          <Text style={styles.safeText}>Lajmro Policine</Text>
          <Text style={styles.safeText2}>Instalo aplikacionin e Policise</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.newSectionContent}>
        <Text style={styles.newSectionTitle}>Falenderim Donatorit</Text>
        <Text style={styles.newSectionDescription}>
          Aplikacioni E-Rinia u realizua fale:
          Projektit "filan fiskteku", projekt i realizuar nga organizata KUSA - Kosovo US Alumni dhe financuar nga Ambasada Amerikane ne Kosove
        </Text>
        <View style={styles.newSectionImages}>
        <Image source={{ uri: 'https://d2v9ipibika81v.cloudfront.net/uploads/sites/133/Pristina_Seal-1.png' }} style={styles.logoPlaceholder2} />
        <Image source={{ uri: 'https://kusalumni.org/wp-content/uploads/2022/07/Kusa-png-512x512_tinified.png' }} style={styles.logoPlaceholder2} />
        </View>
      </View>

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
  newSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  newSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newSectionContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  newSectionDescription: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    margin: 15,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  logoPlaceholder2:{
    width: 120,
    height: 120,
    margin: 15,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  safeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#0091F9',
    padding: 10,
    borderRadius: 20,
  },
  safeContent: {
    flex: 1,
  },
  safeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  safeText2: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
  },
  newSectionImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  }
});

export default HomeScreen;
