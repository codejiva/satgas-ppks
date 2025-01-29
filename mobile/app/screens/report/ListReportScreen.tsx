import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Definisikan tipe laporan
interface Report {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function ListReportScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          return router.replace('/screens/auth/login');
        }

        const response = await axios.get<Report[]>('http://10.0.2.2:5000/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        Alert.alert('Error', 'Gagal mengambil laporan');
      }
    };

    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Laporan Anda</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reportItem}>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
      <Button title="Buat Laporan Baru" onPress={() => router.push('/screens/report/CreateReportScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reportItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
