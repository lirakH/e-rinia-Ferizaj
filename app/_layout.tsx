import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity, Text, View, Image, StatusBar } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  Feather,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, AuthContext } from '@/AuthContext';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from "@/config";

const CustomDrawerContent = (props) => {
  const pathname = usePathname();
  const { userToken, logout, resetApp } = useContext(AuthContext);

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentContainer}>
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
           name="home" 
           size={size} 
           color={pathname === "/" ? "#fff" : "#000"}
           />
        )}
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/" ? "#0091F9" : "#fff" }}
        onPress={() => {
          router.push("/");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Feather 
            name="user" 
            size={size} 
            color={pathname === "/profile" ? "#fff" : "#000"}
            />
        )}
        label={"Profili"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/profile" ? "#0091F9" : "#fff" }}
        onPress={() => {
          router.push("/profile");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="list"
            size={size}
            color={pathname === "/event" ? "#fff" : "#000"}
          />
        )}
        label={"Aktivitet"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/event" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/event" ? "#0091F9" : "#fff" }}
        onPress={() => {
          router.push("/event");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <MaterialCommunityIcons
            name="hand-heart-outline"
            size={size}
            color={pathname === "/NGO" ? "#fff" : "#000"}
          />
        )}
        label={"Organizatat"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/NGO" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/NGO" ? "#0091F9" : "#fff" }}
        onPress={() => {
          router.push("/NGO");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign 
            name="Safety" 
            size={size} 
            color={pathname === "/safe" ? "#fff" : "#000"}
            />
        )}
        label={"Safe Zona"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/safe" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/safe" ? "#0091F9" : "#fff" }}
        onPress={() => {
          router.push("/safe");
        }}
      />
      {userToken && (
        <DrawerItem
          icon={({ color, size }) => (
            <Feather
              name="log-out"
              size={size}
              color="#000"
            />
          )}
          label={"Logout"}
          labelStyle={[
            styles.navItemLabel,
            { color: "#000" },
          ]}
          style={{ backgroundColor: "#fff" }}
          onPress={async () => {
            await logout();
            router.push('/');
          }}
        />
      )}
    </DrawerContentScrollView>
  );
};

function RootLayoutNav() {
  const { resetApp } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const checkConnection = async () => {
      try {
        // Attempt to make a request to your API
        await fetch(API_BASE_URL);
        setIsConnected(true);
      } catch (error) {
        console.error('Network error:', error);
        setIsConnected(false);
      }
    };

    // Check connection status periodically
    const intervalId = setInterval(checkConnection, 5000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (__DEV__) {
      resetApp();
    }
  }, []);

  if (!isConnected) {
    return (
      <View style={styles.offlineContainer}>
        <View style={styles.offlineHeader}>
          <Text style={styles.headerText}>E-rinia</Text>
        </View>
        <View style={styles.offlineContent}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.logo}
          />
          <Text style={styles.errorText}>Check your internet connection</Text>
        </View>
        <View style={styles.offlineFooter}>
          <Text style={styles.footerText}>© 2023 E-rinia</Text>
        </View>
      </View>
    );
  }

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(props) => <CustomDrawerContent {...props} />} 
        screenOptions={{ 
          headerTitle: () =>
            <TouchableOpacity onPress={() => {router.push('/')}} style={{ paddingHorizontal: 20 }}>
              <Text style={{ color:"#0091F9", fontSize:20, fontWeight:"500" }}>E-rinia</Text>
            </TouchableOpacity>,
          headerTintColor: "#0091F9",
          headerTitleAlign: "center",
          headerRight: () => 
            <TouchableOpacity onPress={() => {router.push('profile')}} style={{ paddingHorizontal: 20 }}>
              <Feather 
                  name="user" 
                  size={25} 
                  color="#0091F9"
                  />
            </TouchableOpacity>
        }}
      >
      </Drawer>
    </GestureHandlerRootView>
    </>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  drawerContentContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 25
  },
  drawerItemsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#0091F9',
  },
  offlineContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  offlineHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0091F9',
  },
  headerText: {
    marginTop: 40,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '500',
    color: '#0091F9',
  },
  offlineContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#0091F9',
  },
  offlineFooter: {
    backgroundColor: '#0091F9',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
  },
});