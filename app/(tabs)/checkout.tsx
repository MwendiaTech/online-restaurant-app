import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { mealData } from '@/data/mealData';
import mealImages from '@/assets/images/meals';
import { useRoute } from '@react-navigation/native';

const CheckoutPage = () => {
  const route = useRoute();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Initialize local order state from route params
  useEffect(() => {
    if (route.params?.order) {
      try {
        const parsed = JSON.parse(route.params.order as string);
        setOrderDetails(parsed);
      } catch (error) {
        console.error('Error parsing order:', error);
      }
    }
  }, [route.params?.order]);

  // Payment details state
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = () => {
    // Basic validation of fields
    if (!customerName || !email || !cardNumber || !expiryDate || !cvv) {
      Alert.alert('Missing Information', 'Please fill in all payment details.');
      return;
    }

    // Payment successful: show alert for demo purposes
    Alert.alert(
      'Payment Successful',
      `Name: ${customerName}\nEmail: ${email}\nCard: ${cardNumber}\nExpiry: ${expiryDate}\nCVV: ${cvv}\nOrder Total: £${orderDetails?.total?.toFixed(2)}`
    );

    // Reset inputs and remove order from checkout
    setCustomerName('');
    setEmail('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setOrderDetails(null);
  };

  // Helper function to select image
  const getImage = (imageName: string) => {
    const key = imageName.replace(/\.[^.]+$/, '');
    return mealImages[key];
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Checkout
      </ThemedText>
      <ThemedText style={styles.subtitle} type="subtitle">
        Review your order and complete payment
      </ThemedText>

      {orderDetails && orderDetails.items && (
        <>
          <FlatList
            data={Object.entries(orderDetails.items)}
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
                    <ThemedText style={styles.quantity}>
                      Quantity: {quantity}
                    </ThemedText>
                    <ThemedText style={styles.mealPrice} type="defaultSemiBold">
                    £{meal?.price ? (meal.price * quantity).toFixed(2) : '0.00'}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              );
            }}
          />
          <ThemedText style={styles.totalText} type="defaultSemiBold">
            Total: £{orderDetails.total.toFixed(2)}
          </ThemedText>
        </>
      )}

      <ThemedText style={styles.instruction} type="default">
        Enter your payment details below to complete your order.
      </ThemedText>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
        />
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Credit Card Number"
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="number-pad"
        />
        <View style={styles.rowInputs}>
          <TextInput
            placeholder="Expiry Date (MM/YY)"
            style={[styles.input, styles.halfInput]}
            value={expiryDate}
            onChangeText={setExpiryDate}
            keyboardType="number-pad"
          />
          <TextInput
            placeholder="CVV"
            style={[styles.input, styles.halfInput]}
            value={cvv}
            onChangeText={setCvv}
            keyboardType="number-pad"
            secureTextEntry={true}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.completeButton} onPress={handlePayment}>
        <ThemedText style={styles.completeText}>Complete Payment</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
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
  quantity: {
    fontSize: 14,
    color: '#666',
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
  instruction: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  completeButton: {
    backgroundColor: Colors.primary || '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  completeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutPage;
