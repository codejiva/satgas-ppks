import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import NavBar from '../../components/NavBar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PelaporDashboard() {
  const [latestReports, setLatestReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('❌ Token tidak ditemukan');
          return;
        }

        // Ambil data pengguna untuk sapaan
        const userResponse = await axios.get('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(userResponse.data.username);

        // Ambil laporan terbaru
        const response = await axios.get('http://10.0.2.2:5000/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLatestReports(response.data.slice(0, 1)); // Ambil 1 laporan terbaru
      } catch (error) {
        console.error('❌ Gagal mengambil laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    { title: 'Laporan Saya', icon: 'file-alt', path: '/screens/pelapor/LaporanList' },
    { title: 'Janji Temu', icon: 'calendar-alt', path: '/screens/pelapor/JanjiTemuList' },
  ];

  return (
    <View style={styles.container}>
      {/* Sapaan Pengguna */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Halo, {userName}!</Text>
      </View>

      {/* Tampilkan loading indicator saat data belum dimuat */}
      {loading && <ActivityIndicator size="large" color="#000" />}

      {/* FlatList Menu */}
      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(item.path)}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name={item.icon} size={32} color="#000" />
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      
      {/* Tampilkan laporan terbaru */}
      {!loading && latestReports.length > 0 && (
        <View style={styles.latestReports}>
          <Text style={styles.subHeader}>Laporan Terbaru</Text>
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>{latestReports[0].title}</Text>
            <Text style={styles.reportStatus(latestReports[0].status)}>
              Status: {latestReports[0].status}
            </Text>
            <Text style={styles.reportSchedule}>
              Jadwal Pertemuan: {latestReports[0].jadwal_pertemuan || '-'}
            </Text>
            <Text style={styles.reportDescription}>Deskripsi: {latestReports[0].description}</Text>
            <Text style={styles.reportLocation}>Lokasi: {latestReports[0].location}</Text>
            <Text style={styles.reportCreatedAt}>Dibuat pada: {latestReports[0].created_at}</Text>
          </View>
        </View>
      )}

      <NavBar /> {/* Tambahkan Navigation Bar */}
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
    backgroundColor: '#007bff',
    padding: 50,
    paddingLeft: 10,
    borderRadius: 10,
    marginBottom: 25,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  latestReports: {
    marginBottom: 20,
    paddingTop: 10,
  },
  reportCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 30,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  reportStatus: (status: string) => ({
    fontSize: 14,
    color: status === 'pending' ? 'orange' : status === 'accepted' ? 'green' : 'red',
  }),
  reportSchedule: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  reportDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  reportLocation: {
    fontSize: 14,
    marginTop: 5,
  },
  reportCreatedAt: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
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
  iconContainer: {
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
  },
});