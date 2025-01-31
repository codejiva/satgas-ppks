import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LaporanList() {
  const [laporan, setLaporan] = useState<any[]>([]); // State untuk menyimpan laporan
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading indicator

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        // Mendapatkan token pengguna dari AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error("❌ Token tidak ditemukan, silakan login kembali.");
          return;
        }

        // Mengambil data laporan yang dibuat oleh pengguna yang sedang login (pelapor)
        const response = await axios.get('http://10.0.2.2:5000/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLaporan(response.data);
      } catch (error) {
        console.error('❌ Gagal mengambil laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  // Fungsi untuk menentukan warna status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange'; // Warna untuk status pending
      case 'accepted':
        return 'green'; // Warna untuk status diterima
      case 'rejected':
        return 'red'; // Warna untuk status ditolak
      default:
        return 'gray'; // Warna default jika status tidak dikenali
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Laporan Saya</Text>

      {/* Tampilkan loading indicator saat data belum dimuat */}
      {loading && <ActivityIndicator size="large" color="#000" />}

      {/* Pesan jika tidak ada laporan */}
      {!loading && laporan.length === 0 && <Text style={styles.emptyText}>Tidak ada laporan ditemukan.</Text>}

      {/* Render list menggunakan FlatList */}
      <FlatList
        data={laporan}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.title}</Text>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              Status: {item.status}
            </Text>
            <Text>Deskripsi: {item.description}</Text>
            <Text>Lokasi: {item.location}</Text>
          </View>
        )}
      />
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
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 8,
  },
});
