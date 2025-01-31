import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native'; // Menggunakan useRoute untuk akses parameter URL
import AsyncStorage from '@react-native-async-storage/async-storage';

// Menentukan tipe untuk route params
type RouteParams = {
  id: string;
};

export default function LaporanDetail() {
  const [laporan, setLaporan] = useState<any | null>(null); // State untuk laporan
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading indicator
  const route = useRoute(); // Mengambil route
  const { id } = route.params as RouteParams; // Mendapatkan id dari route.params dan mendeklarasikan tipe

  useEffect(() => {
    const fetchLaporanDetail = async () => {
      try {
        if (!id) {
          console.error("❌ ID laporan tidak ditemukan.");
          return;
        }

        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error("❌ Token tidak ditemukan, silakan login kembali.");
          return;
        }

        const response = await axios.get(`http://10.0.2.2:5000/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLaporan(response.data); // Set data laporan
      } catch (error) {
        console.error('❌ Gagal mengambil detail laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporanDetail();
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detail Laporan</Text>

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {!loading && laporan && (
        <View style={styles.reportContainer}>
          <Text style={styles.title}>Judul: {laporan.title}</Text>
          <Text style={styles.status}>Status: {laporan.status}</Text>
          <Text style={styles.description}>Deskripsi: {laporan.description}</Text>
          <Text style={styles.location}>Lokasi: {laporan.location}</Text>
        </View>
      )}

      {!loading && !laporan && <Text style={styles.errorText}>Laporan tidak ditemukan.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reportContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
});
