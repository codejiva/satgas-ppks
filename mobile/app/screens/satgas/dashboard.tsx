import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import NavBar from '../../components/NavBar'; // Import NavBar
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SatgasDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    rejectedReports: 0,
  });
  const [reports, setReports] = useState([]); // State untuk menyimpan daftar laporan
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(''); // Tambahkan state untuk userName

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        // Ambil data laporan
        const response = await axios.get('http://10.0.2.2:5000/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const totalReports = response.data.length;
        const pendingReports = response.data.filter((report) => report.status === 'pending').length;
        const acceptedReports = response.data.filter((report) => report.status === 'accepted').length;
        const rejectedReports = response.data.filter((report) => report.status === 'rejected').length;

        setDashboardData({ totalReports, pendingReports, acceptedReports, rejectedReports });
        setReports(response.data); // Simpan daftar laporan
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const menuItems = [
    { title: 'Laporan', icon: 'file-alt', path: '/screens/satgas/LaporanList' },
    { title: 'Janji Temu', icon: 'calendar-alt', path: '/screens/satgas/JanjiTemuList' },
  ];

  return (
    <View style={styles.container}>
      {/* Sapaan Pengguna */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Halo, {userName}!</Text>
      </View>

      {/* Tampilkan loading indicator saat data belum dimuat */}
      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {/* Dashboard Stats */}
      <View style={styles.dashboardStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboardData.totalReports}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboardData.acceptedReports}</Text>
          <Text style={styles.statLabel}>Diterima</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboardData.pendingReports}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Menu Items */}
      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.menuContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(item.path)}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name={item.icon} size={32} color="#007bff" />
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Daftar Laporan Terbaru (tampilkan hanya 1 laporan terbaru) */}
      {reports.length > 0 && (
        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>{reports[0].title}</Text>
          <Text style={styles.reportStatus(reports[0].status)}>Status: {reports[0].status}</Text>
          <Text style={styles.reportDescription}>Deskripsi: {reports[0].description}</Text>
          <Text style={styles.reportLocation}>Lokasi: {reports[0].location}</Text>
          <Text style={styles.reportCreatedAt}>Dibuat pada: {new Date(reports[0].created_at).toLocaleString()}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  greeting: {
    backgroundColor: '#007bff',
    padding: 50,
    paddingLeft: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dashboardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
  },
  menuContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#007bff',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reportStatus: (status) => ({
    fontSize: 14,
    color: status === 'pending' ? 'orange' : status === 'accepted' ? 'green' : 'red',
    marginTop: 5,
  }),
  reportDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  reportLocation: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  reportCreatedAt: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});