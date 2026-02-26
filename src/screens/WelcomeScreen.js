import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { WelcomeStyles as s } from "../styles/WelcomeStyles";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={s.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        }}
        style={s.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
          locations={[0, 0.5, 0.85]}
          style={s.overlay}
        >
          <View style={s.content}>
            <Text style={s.title}>
              Fall in Love with{"\n"}
              <Text style={s.titleHighlight}>Handbags</Text> in Blissful
              {"\n"}Delight!
            </Text>
            <Text style={s.subtitle}>
              Welcome to our luxury collection, where{"\n"}
              every bag is a statement piece for you.
            </Text>
            <TouchableOpacity
              style={s.button}
              activeOpacity={0.85}
              onPress={() => navigation.replace("MainTabs")}
            >
              <LinearGradient
                colors={["#D4A574", "#C4956A", "#9B7353"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.buttonGradient}
              >
                <Text style={s.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
