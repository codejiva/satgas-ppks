import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const checkUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/screens/auth/login');
        return;
      }

      const response = await axios.get('http://10.0.2.2:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userRole = response.data.role;
      console.log("User Role:", userRole); // Debugging

      if (userRole === 'admin') {
        router.replace('/screens/admin/dashboard');
      } else if (userRole === 'satgas') {
        router.replace('/screens/satgas/dashboard');
      } else {
        router.replace('/screens/pelapor/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.replace('/screens/auth/login');
    }
  };

  checkUserRole();
}, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return <View />; // Tidak perlu menampilkan apa-apa karena akan langsung redirect
}
