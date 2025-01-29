import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.replace('/screens/auth/login'); // Redirect kalau belum login
          return;
        }

        const response = await axios.get('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsername(response.data.username);
      } catch (error) {
        console.log('Error fetching user data:', error);
        Alert.alert('Error', 'Gagal mendapatkan data user');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/screens/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang, {username}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
