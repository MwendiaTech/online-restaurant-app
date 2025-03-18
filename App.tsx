// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from 'expo-router';

export default function App() {
  return (
    <NavigationContainer>
      <Tabs>
        <Tabs.Screen name="index" options={{ headerShown: false }} />
        <Tabs.Screen name="meals" options={{ headerShown: false }} />
        <Tabs.Screen name="orders" options={{ headerShown: false }} />
        <Tabs.Screen name="checkout" options={{ headerShown: false }} />
      </Tabs>
    </NavigationContainer>
  );
}