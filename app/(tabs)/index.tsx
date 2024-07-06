// app/(tabs)/index.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, Image, TouchableOpacity, RefreshControl, Linking, BackHandler } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import EventList from "@/components/EventList";
import DraggableCircleGrid from '@/components/DraggableCircleGrid';
import { getAllOrganizations, getApprovedEvents } from '@/endpoints';

const POLLING_INTERVAL = 30000; // 30 seconds

const HomeScreen = () => {
  const [typeOneOrganizations, setTypeOneOrganizations] = useState([]);
  const [typeTwoOrganizations, setTypeTwoOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const scrollViewRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [organizationsData, eventsData] = await Promise.all([
        getAllOrganizations(),
        getApprovedEvents()
      ]);
      
      const typeOne = organizationsData.filter(org => org.type === 'Institution');
      const typeTwo = organizationsData.filter(org => org.type === 'NGO');

      setTypeOneOrganizations(typeOne);
      setTypeTwoOrganizations(typeTwo);
      setEvents(eventsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (loading) {
        fetchData();
      }

      const onBackPress = () => {
        // Navigate to the previous screen
        router.back();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [fetchData, loading, router])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSafePress = async () => {
    const appURL = 'myapp://'; // Replace with your app's deep link scheme
    const storeURL = 'https://play.google.com/store/apps/details?id=org.nativescript.raportopolicin&hl=sq'; // Replace with your app's Google Play Store URL

    try {
      const supported = await Linking.canOpenURL(appURL);
      if (supported) {
        await Linking.openURL(appURL);
      } else {
        await Linking.openURL(storeURL);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to open the app or store.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <ScrollView 
      ref={scrollViewRef}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleContainerTitle}>Aktivitetet e reja</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <EventList events={events} />

      <View style={styles.titleContainer}>
        <Text style={styles.titleContainerTitle}>Institucionet</Text>
        <Link href="/NGO" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <DraggableCircleGrid 
        items={typeOneOrganizations.map(org => ({ id: org.id.toString(), label: org.shortname, picture: org.picture || 'https://via.placeholder.com/150' }))} 
        scrollViewRef={scrollViewRef}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.titleContainerTitle}>Organizatat</Text>
        <Link href="/NGO" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <DraggableCircleGrid 
        items={typeTwoOrganizations.map(org => ({ id: org.id.toString(), label: org.shortname, picture: org.picture || 'https://via.placeholder.com/150' }))} 
        scrollViewRef={scrollViewRef}
      />

      <View style={styles.titleContainer2}>
        <Text style={styles.titleContainerTitle}>Safe Zona</Text>
        <Link href="/safe" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <TouchableOpacity onPress={handleSafePress} style={styles.safeContainer}>
        <Image source={require('@/assets/images/Kosovo-Police.png')} style={styles.logoPlaceholder} />
        <View style={styles.safeContent}>
          <Text style={styles.safeText}>Lajmro Policinë</Text>
          <Text style={styles.safeText2}>Instalo aplikacionin e Policisë</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.newSectionContent}>
        <Text style={styles.newSectionTitle}>Falenderim Donatorit</Text>
        <Text style={styles.newSectionDescription}>
          Aplikacioni u realizua në kuadër të projektit 
          {"\n"}
          "Angazhimi i të rinjve, një zë për ndikim"
          </Text>
        <Text style={styles.newSectionDescription2}>
        Financuar nga Departamenti i Shtetit i Shteteve të Bashkuara të Amerikës përmes programit “AEIF2023”, mbështetur nga Ambasada
        e SHBA-ve në Kosovë, administruar nga KUSA, dhe implementuar nga dy anëtarë të Alumni nga Ferizaj
        dhe Drenas, në partneritet me OJQ "AdVOICE".
        </Text>
        <View style={styles.newSectionImages}>
          <Image source={require('@/assets/images/Kusa Logo Transparent.png')} style={styles.logoPlaceholder2} />
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
  titleContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  titleContainerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
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
  safeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0,
    borderColor: '#0091F9',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  safeContent: {
    flex: 1,
  },
  safeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0091F9',
    marginLeft: 10,
  },
  safeText2: {
    fontSize: 14,
    color: '#0091F9',
    marginLeft: 10,
  },
  logoPlaceholder: {
    width: 100,
    height: 80,
    margin: 15,
    padding: 20,
    borderColor: '#0091F9',
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  logoPlaceholder2: {
    width: "100%",
    height: 330,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  newSectionContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  newSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newSectionDescription: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  newSectionDescription2: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  newSectionImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default HomeScreen;
