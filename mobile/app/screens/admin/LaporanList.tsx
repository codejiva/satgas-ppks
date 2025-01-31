import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function LaporanList() {
  const [laporan, setLaporan] = useState<{ id: number; title: string; status: string }[]>([]);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndLaporan = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error("❌ Token tidak ditemukan, silakan login kembali.");
          return;
        }

        // ✅ Ambil data user
        const userResponse = await axios.get('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data);
        console.log("👤 User Role:", userResponse.data.role);

        let laporanEndpoint = '';

        // 🔥 Admin & Satgas harus pakai `/api/reports`
        if (userResponse.data.role === 'admin' || userResponse.data.role === 'satgas') {
          laporanEndpoint = 'http://10.0.2.2:5000/api/reports'; // Pastikan ini benar
        } 
        // 🔥 Pelapor harus pakai `/api/reports/user`
        else if (userResponse.data.role === 'pelapor') {
          laporanEndpoint = 'http://10.0.2.2:5000/api/reports/user';
        } 
        // ❌ Role tidak valid
        else {
          console.error("❌ Akses ditolak: Role tidak valid.");
          return;
        }

        // ✅ Fetch laporan berdasarkan role
        const response = await axios.get(laporanEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLaporan(response.data);
      } catch (error: any) {
        if (error.response) {
          console.error(`❌ Gagal mengambil laporan: ${error.response.status} - ${error.response.data.message}`);
        } else {
          console.error('❌ Kesalahan jaringan:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLaporan();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List Laporan</Text>

      {loading ? <ActivityIndicator size="large" color="#000" /> : null}

      {!loading && laporan.length === 0 && <Text style={styles.emptyText}>Tidak ada laporan ditemukan.</Text>}

      <FlatList
        data={laporan}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/screens/admin/LaporanDetail?id=${item.id}`)}>
            <Text style={styles.cardText}>{item.title}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
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
});
