import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginVolunteer, loginAdmin, loginOrganization, getAuthToken, verifyToken } from './endpoints';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        if (token && await verifyToken(token)) {
          setUserToken(token);
          setUserRole(role);
        }
      } catch (e) {
        console.error('Restoring token failed', e);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    isLoading,
    userToken,
    userRole,
    loginVolunteer: async (credentials) => {
      try {
        const response = await loginVolunteer(credentials);
        const token = response.token;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', 'volunteer');
        setUserToken(token);
        setUserRole('volunteer');
      } catch (error) {
        console.error('Volunteer login error:', error);
        throw error;
      }
    },
        
    loginAdmin: async (credentials) => {
      try {
        const response = await loginAdmin(credentials);
        const token = response.token;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', 'admin');
        setUserToken(token);
        setUserRole('admin');
      } catch (error) {
        console.error('Admin login error:', error);
        throw error;
      }
    },
    loginOrganization: async (credentials) => {
      try {
        const response = await loginOrganization(credentials);
        const token = response.token;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', 'organization');
        setUserToken(token);
        setUserRole('organization');
      } catch (error) {
        console.error('Organization login error:', error);
        throw error;
      }
    },
    logout: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userRole');
        setUserToken(null);
        setUserRole(null);
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    resetApp: async () => {
      try {
        await AsyncStorage.clear();
        setUserToken(null);
        setUserRole(null);
        setIsLoading(false);
      } catch (error) {
        console.error('Error resetting app:', error);
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
