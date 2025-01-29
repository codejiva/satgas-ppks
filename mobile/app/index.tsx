import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function IndexScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
        router.replace('/screens/home');  // Langsung ke Home kalau sudah login
      } else {
        router.replace('/screens/auth/login');  // Redirect ke login kalau belum login
      }
    };
    checkAuth();
  }, []);

  return null; // Tidak perlu render apa pun, hanya untuk redirect
}
