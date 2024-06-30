import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, FlatList } from 'react-native';
import CircleItem from '@/components/CircleItem';
import { getAllOrganizations } from '@/endpoints'; // Adjust the path as necessary

export default function NgoScreen() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const data = await getAllOrganizations();
        const institutions = data.filter(item => item.type === 'Institution');
        const ngos = data.filter(item => item.type === 'NGO');
        
        setSections([
          { title: 'Institutions', data: institutions },
          { title: 'NGOs', data: ngos }
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CircleItem item={item} />
      <Text style={styles.itemName}>{item.name}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderSection = ({ section }) => (
    <>
      {renderSectionHeader({ section })}
      <FlatList
        data={section.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTextTitle}>No NGOs yet</Text>
          <Text style={styles.emptyTextBody}>They will be added shortly</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, section }) => null}
          ListHeaderComponent={() => null}
          ListFooterComponent={() => null}
          SectionSeparatorComponent={() => null}
          renderSectionFooter={({ section }) => renderSection({ section })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextTitle: {
    fontSize: 18,
    marginTop: 20,
    color: '#888',
  },
  emptyTextBody: {
    fontSize: 14,
    marginTop: 10,
    color: '#888',
  },
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    width: 100,
  },
  itemName: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    marginBottom: 25,
  },
});
