// components/MemberList.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const MemberList = ({ members }) => {
  const renderMember = ({ item }) => (
    <View style={styles.memberContainer}>
      <Image source={{ uri: item.picture }} style={styles.memberPicture} />
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberPosition}>{item.position}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        numColumns={3} // Adjust this value to change the number of columns
        contentContainerStyle={styles.memberListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  memberContainer: {
    padding: 10,
    backgroundColor: '#fff',
    width: '30%', // Adjust this value to change the number of columns
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  memberPicture: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 14,
    textAlign: 'center',
  },
  memberPosition: {
    fontSize: 12,
    textAlign: 'center',
  },
  memberListContainer: {
    paddingHorizontal: 10,
  },
});

export default MemberList;
