// app/(tabs)/meals.tsx
import React, { useState, useRef } from 'react';
import { FlatList, Image, StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { mealData } from '@/data/mealData';
import mealImages from '@/assets/images/meals';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

const MealsPage = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedMeals, setSelectedMeals] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  // Helper function to get the correct image
  const getImage = (imageName: string) => {
    const key = imageName.replace(/\.[^.]+$/, '');
    return mealImages[key];
  };

  const addToOrder = (mealId: string) => {
    setSelectedMeals(prev => {
      if (prev[mealId]) {
        const newCount = prev[mealId] + 1;
        return { ...prev, [mealId]: newCount };
      } else {
        return { ...prev, [mealId]: 1 };
      }
    });
  };

  const viewOrder = () => {
    router.push({
      pathname: '/orders',
      params: { order: JSON.stringify(selectedMeals) }
    });
  };

  // Interpolations for parallax header
  const parallaxHeaderHeight = 250;
  const headerScrollDistance = parallaxHeaderHeight;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [0, -headerScrollDistance],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={[...mealData]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.mealItem}>
            <Image
              source={getImage(item.image)}
              style={styles.mealImage}
            />
            <ThemedView style={styles.mealInfo}>
              <ThemedText style={styles.mealName} type="defaultSemiBold">
                {item.name}
              </ThemedText>
              <ThemedText style={styles.mealDescription}>
                {item.description}
              </ThemedText>
              <ThemedText style={styles.mealPrice} type="defaultSemiBold">
              £{item.price.toFixed(2)}
              </ThemedText>
              <TouchableOpacity
                style={styles.addToOrderButton}
                onPress={() => addToOrder(item.id.toString())}>
                <ThemedText style={styles.addToOrderText}>
                  Add to Order
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}
        ListHeaderComponent={
          <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}>
            <Image
              source={require('@/assets/images/restaurant-header.png')}
              style={styles.headerImage}
            />
            <ThemedText style={styles.title} type="title">
              Browse Our Menu
            </ThemedText>
          </Animated.View>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      {Object.keys(selectedMeals).length > 0 && (
        <View style={styles.orderActionsContainer}>
          <TouchableOpacity
            style={styles.viewOrderButton}
            onPress={viewOrder}>
            <ThemedText style={styles.viewOrderText}>
              View Order
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearOrderButton}
            onPress={() => setSelectedMeals({})}>
            <ThemedText style={styles.clearOrderText}>
              Clear Order
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 20,
    textAlign: 'center',
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mealImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  mealPrice: {
    fontSize: 16,
  },
  addToOrderButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  addToOrderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orderActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  viewOrderButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  viewOrderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearOrderButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  clearOrderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MealsPage;
