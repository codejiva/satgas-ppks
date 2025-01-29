import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.replace('/screens/auth/login'); // Perbaikan path untuk login
          return;
        }

        const response = await axios.get('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.log('Error fetching user data:', error);
        Alert.alert('Error', 'Gagal mendapatkan data pengguna');
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
      <Text style={styles.title}>Selamat Datang, {user?.username}!</Text>

      {/* Jika pengguna adalah pelapor, tampilkan tombol buat laporan */}
      {user?.role === 'pelapor' && (
        <Button title="Buat Laporan" onPress={() => router.push('/screens/report/create')} />
      )}

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
