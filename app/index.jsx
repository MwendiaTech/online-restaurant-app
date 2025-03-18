// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  const colorScheme = useColorScheme();

  return (
    <ImageBackground
      source={require('@/assets/images/restaurant-background.png')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: '#FFFFFF' }]}>
          Welcome to Our Online Restaurant
        </Text>
        <Text style={[styles.subtitle, { color: '#EFEFEF' }]}>
          Discover delicious meals and place your order easily
        </Text>
        
        {/* Rounded button for navigation (placeholder for prototype) */}
        <TouchableOpacity style={styles.roundedButton} onPress={() => router.push('/(tabs)/meals')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backgroundImageStyle: {
    opacity: 0.7,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8,
  },
  roundedButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
