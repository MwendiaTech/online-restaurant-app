// data/orders.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveOrder = async (order: any) => {
  try {
    const existingOrders = await readOrders();
    existingOrders.push(order);
    const jsonValue = JSON.stringify(existingOrders);
    await AsyncStorage.setItem('orders', jsonValue);
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

export const readOrders = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('orders');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

export const updateOrders = async (orders: any[]) => {
  try {
    const jsonValue = JSON.stringify(orders);
    await AsyncStorage.setItem('orders', jsonValue);
  } catch (error) {
    console.error('Error updating orders:', error);
  }
};