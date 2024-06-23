import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Image, Button } from "react-native";
import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  Feather,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

const CustomDrawerContent = (props) => {
  const pathname = usePathname();

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
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} >
      </Drawer>
    </GestureHandlerRootView>
  );
}

// options={{headerTitle:"", headerRight: () => <Button onPress={() => {router.push('profile')}} title='o' />}}


const styles = StyleSheet.create({
  drawerContentContainer: {
    flex: 1,
    justifyContent: 'center', // Center the items vertically
  },
  drawerItemsContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center the items within the container
  },
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  navItem: {
    flexDirection: 'row', // Ensure the flex direction is row
    alignItems: 'center', // Center vertically
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
});
