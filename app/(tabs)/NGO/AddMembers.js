import React, { useEffect, useContext } from 'react';
import { Image, StyleSheet, Platform, ScrollView, Text, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { AuthContext } from '@/AuthContext';

const AddMembers = () => {
  const router = useRouter();
  const { userRole } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      if (userRole !== 'admin') {
        Alert.alert('Access Denied', 'Only administrators can add members.');
        router.push('profile');
      }
    }, [userRole])
  );

  if (userRole !== 'admin') {
    return null; // Render nothing while redirecting
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text>Add Member</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    margin: 10,
  },
});

export default AddMembers;
