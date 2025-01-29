import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.replace('/screens/auth/login');
          return;
        }

        const response = await axios.get('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Menu untuk Admin
  const adminMenu = [
    { title: 'Laporan', icon: 'file-alt', path: '/screens/report/list' },
    { title: 'Satgas', icon: 'users', path: '/screens/report/satgas' },
    { title: 'Pelapor', icon: 'user', path: '/screens/report/pelapor' },
    { title: 'Janji Temu', icon: 'calendar-alt', path: '/screens/report/janjitemu' },
  ];

  // Menu untuk Satgas
  const satgasMenu = [
    { title: 'Total Laporan', icon: 'file-alt', path: '/screens/report/list' },
    { title: 'Pending', icon: 'clock', path: '/screens/report/pending' },
    { title: 'Accepted', icon: 'check-circle', path: '/screens/report/accepted' },
    { title: 'Rejected', icon: 'times-circle', path: '/screens/report/rejected' },
    { title: 'Janji Temu', icon: 'calendar-alt', path: '/screens/report/janjitemu' },
  ];

  const pelaporMenu = [
  { title: 'Laporan Saya', icon: 'file-alt', path: '/screens/report/mylaporan' },
  { title: 'Status Laporan', icon: 'info-circle', path: '/screens/report/status' },
  { title: 'Janji Temu', icon: 'calendar-alt', path: '/screens/report/janjitemu' },
  ];

  // Pilih menu berdasarkan role
const menuItems =
  user?.role === 'admin' ? adminMenu :
  user?.role === 'satgas' ? satgasMenu :
  pelaporMenu; // Default ke pelapor

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Halo, {user?.username}!</Text>
      <Text style={styles.dashboardTitle}>
        {user?.role === 'admin' ? 'Dashboard Admin' : 'Dashboard Satgas'}
      </Text>

      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(item.path)}>
            <FontAwesome5 name={item.icon} size={32} color="#007bff" />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/screens/home')} style={styles.navItem}>
          <FontAwesome5 name="home" size={20} color="blue" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/profile')} style={styles.navItem}>
          <FontAwesome5 name="user" size={20} color="blue" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#007bff',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    marginTop: 4,
    color: 'blue',
  },
});
