// app/(tabs)/orders.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { mealData } from '@/data/mealData';
import mealImages from '@/assets/images/meals';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { readOrders, saveOrder, updateOrders } from '@/data/orders';

const OrdersPage = () => {
  const params = useLocalSearchParams();
  const [currentOrder, setCurrentOrder] = useState<{ [key: string]: number }>({});
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const router = useRouter();

  // Process incoming order data (stringified) from route params
  useEffect(() => {
    if (params.order) {
      try {
        const parsedOrder = JSON.parse(params.order as string);
        setCurrentOrder(parsedOrder);
      } catch (error) {
        console.error('Error parsing order:', error);
      }
    }
  }, [params.order]);

  useEffect(() => {
    const loadOrders = async () => {
      const storedOrders = await readOrders();
      setOrderHistory(storedOrders);
    };
    loadOrders();
  }, []);

  const getImage = (imageName: string) => {
    const key = imageName.replace(/\.[^.]+$/, '');
    return mealImages[key];
  };

  const addToOrder = (mealId: string) => {
    setCurrentOrder((prev) => {
      if (prev[mealId]) {
        const newCount = prev[mealId] + 1;
        return { ...prev, [mealId]: newCount };
      } else {
        return { ...prev, [mealId]: 1 };
      }
    });
  };

  const removeFromOrder = (mealId: string) => {
    setCurrentOrder((prev) => {
      if (prev[mealId] > 1) {
        return { ...prev, [mealId]: prev[mealId] - 1 };
      } else {
        const newOrder = { ...prev };
        delete newOrder[mealId];
        return newOrder;
      }
    });
  };

  const submitOrder = async () => {
    const orderDetails = {
      items: currentOrder,
      total: Object.entries(currentOrder).reduce((sum, [mealId, quantity]) => {
        const meal = mealData.find((m) => m.id.toString() === mealId);
        return sum + (meal?.price || 0) * quantity;
      }, 0),
      date: new Date().toISOString(),
    };

    await saveOrder(orderDetails);
    setOrderHistory((prev) => [...prev, orderDetails]);
    setCurrentOrder({});
    router.push({
      pathname: '/checkout',
      params: { order: JSON.stringify(orderDetails) },
    });
  };

  const handleClearOrder = () => {
    setCurrentOrder({});
  };

  // Delete a single order from the history using its index
  const deleteOrderEntry = async (index: number) => {
    const newHistory = [...orderHistory];
    newHistory.splice(index, 1);
    await updateOrders(newHistory);
    setOrderHistory(newHistory);
  };

  // Delete all saved orders
  const clearAllOrders = async () => {
    await updateOrders([]);
    setOrderHistory([]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Your Order
      </ThemedText>

      {Object.keys(currentOrder).length > 0 ? (
        <>
          <FlatList
            data={Object.entries(currentOrder)}
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => {
              const mealId = item[0];
              const quantity = item[1];
              const meal = mealData.find((m) => m.id.toString() === mealId);

              return (
                <ThemedView style={styles.orderItem}>
                  <Image
                    source={getImage(meal?.image || '')}
                    style={styles.mealImage}
                  />
                  <ThemedView style={styles.mealInfo}>
                    <ThemedText style={styles.mealName} type="defaultSemiBold">
                      {meal?.name}
                    </ThemedText>
                    <ThemedView style={styles.quantityContainer}>
                      <TouchableOpacity onPress={() => removeFromOrder(mealId)}>
                        <ThemedText style={styles.quantityButton}>-</ThemedText>
                      </TouchableOpacity>
                      <ThemedText style={styles.quantity}>{quantity}</ThemedText>
                      <TouchableOpacity onPress={() => addToOrder(mealId)}>
                        <ThemedText style={styles.quantityButton}>+</ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                    <ThemedText style={styles.mealPrice} type="defaultSemiBold">
                    £
                      {meal?.price
                        ? (meal.price * quantity).toFixed(2)
                        : '0.00'}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              );
            }}
          />
          <ThemedText style={styles.totalText} type="defaultSemiBold">
            Total: £
            {Object.entries(currentOrder)
              .reduce((sum, [mealId, quantity]) => {
                const meal = mealData.find((m) => m.id.toString() === mealId);
                return sum + (meal?.price || 0) * quantity;
              }, 0)
              .toFixed(2)}
          </ThemedText>
          <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
            <ThemedText style={styles.submitText} type="defaultSemiBold">
              Proceed to Checkout
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearOrder}>
            <ThemedText style={styles.clearText} type="defaultSemiBold">
              Clear Items in Order
            </ThemedText>
          </TouchableOpacity>
        </>
      ) : (
        <ThemedText style={styles.emptyState} type="default">
          No items in your current order
        </ThemedText>
      )}

      {orderHistory.length > 0 && (
        <>
          <ThemedText style={styles.orderHistoryTitle} type="subtitle">
            Order History
          </ThemedText>
          <TouchableOpacity style={styles.clearAllButton} onPress={clearAllOrders}>
            <ThemedText style={styles.clearAllText} type="defaultSemiBold">
              Clear All Orders
            </ThemedText>
          </TouchableOpacity>
          <FlatList
            data={orderHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              // Get a list of item names with quantities
              const itemNames = Object.entries(item.items)
                .map(([mealId, quantity]) => {
                  const meal = mealData.find(
                    (m) => m.id.toString() === mealId
                  );
                  return meal ? `${meal.name} x${quantity}` : '';
                })
                .filter((name) => name !== '')
                .join(', ');
              return (
                <ThemedView style={styles.historyItem}>
                  <ThemedText style={styles.historyDate} type="default">
                    {new Date(item.date).toLocaleDateString()}
                  </ThemedText>
                  <ThemedText style={styles.historyItems} type="default">
                    Items: {itemNames}
                  </ThemedText>
                  <ThemedText style={styles.historyTotal} type="defaultSemiBold">
                    Total: £{item.total.toFixed(2)}
                  </ThemedText>
                  <TouchableOpacity
                    style={styles.deleteEntryButton}
                    onPress={() => deleteOrderEntry(index)}>
                    <ThemedText style={styles.deleteEntryText}>
                      Delete
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              );
            }}
          />
        </>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  orderItem: {
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
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealPrice: {
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  emptyState: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  clearButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  clearText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearAllButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  clearAllText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderHistoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 16,
  },
  historyItem: {
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
    position: 'relative',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  historyItems: {
    fontSize: 14,
    marginBottom: 4,
  },
  historyTotal: {
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  deleteEntryButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#B71C1C',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteEntryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OrdersPage;
