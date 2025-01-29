import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SatgasProcessScreen() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<{ title: string; description: string; status: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          return router.replace('/screens/auth/login');
        }

        const response = await axios.get(`http://10.0.2.2:5000/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
        Alert.alert('Error', 'Gagal mengambil detail laporan.');
      }
    };

    fetchReport();
  }, [id]);

  const handleProcess = async (newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return Alert.alert('Error', 'Anda belum login.');
      }

      await axios.put(
        `http://10.0.2.2:5000/api/reports/${id}/process`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sukses', `Laporan telah ${newStatus}`);
      router.replace('/screens/report/satgaslist');
    } catch (error: unknown) {
      console.error('Error processing report:', error);

      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Terjadi kesalahan');
      } else if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proses Laporan</Text>
      {report ? (
        <>
          <Text style={styles.label}>Judul: {report.title}</Text>
          <Text style={styles.label}>Deskripsi: {report.description}</Text>
          <Text style={styles.label}>Status: {report.status}</Text>
          <Button title="Terima" onPress={() => handleProcess('diterima')} />
          <Button title="Tolak" onPress={() => handleProcess('ditolak')} />
        </>
      ) : (
        <Text>Memuat detail laporan...</Text>
      )}
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
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
});
