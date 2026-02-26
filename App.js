import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { FavoritesProvider } from "./src/context/FavoritesContext";

export default function App() {
  return (
    <FavoritesProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </FavoritesProvider>
  );
}
