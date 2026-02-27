import React from "react";
import { Pressable, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import DetailScreen from "../screens/DetailScreen";
import OrderScreen from "../screens/OrderScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import MapScreen from "../screens/MapScreen";
import AddressPickerScreen from "../screens/AddressPickerScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import { useFavorites } from "../context/FavoritesContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* Heart icon in Detail header */
function DetailHeaderHeart({ route }) {
  const { isFavorite, toggleFav } = useFavorites();
  const item = route.params?.item;
  if (!item) return null;
  const fav = isFavorite(item.handbagName);
  return (
    <Pressable onPress={() => toggleFav(item)} hitSlop={10}>
      <Ionicons
        name={fav ? "heart" : "heart-outline"}
        size={24}
        color={fav ? "#FF6B6B" : "#1B1B1B"}
      />
    </Pressable>
  );
}

function PlaceholderScreen() {
  return null;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? "home" : "home-outline",
            Favorites: focused ? "heart" : "heart-outline",
            Orders: focused ? "bag-handle" : "bag-handle-outline",
            Map: focused ? "map" : "map-outline",
          };
          return (
            <View style={{ alignItems: "center", gap: 4 }}>
              <Ionicons name={icons[route.name]} size={22} color={color} />
              {focused && (
                <View
                  style={{
                    width: 18,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#D4A574",
                  }}
                />
              )}
            </View>
          );
        },
        tabBarActiveTintColor: "#D4A574",
        tabBarInactiveTintColor: "#BFBFBF",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#F0F0F0",
          height: 60,
          paddingTop: 8,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -4 },
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ navigation, route }) => ({
            title: "Detail",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "#FAFAFA" },
            headerTitleStyle: { fontWeight: "700", fontSize: 17 },
            headerLeft: () => (
              <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
                <Ionicons name="chevron-back" size={24} color="#1B1B1B" />
              </Pressable>
            ),
            headerRight: () => <DetailHeaderHeart route={route} />,
          })}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddressPicker"
          component={AddressPickerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
