import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Definisi tipe data laporan
interface Report {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function SatgasListScreen() {
  const [reports, setReports] = useState<Report[]>([]); // Pastikan ini memiliki tipe Report[]
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          return router.replace('/screens/auth/login');
        }

        const response = await axios.get('http://10.0.2.2:5000/api/reports/all', {
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
      <Text style={styles.title}>Daftar Laporan Masuk</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()} // Pastikan item.id ada dalam data
        renderItem={({ item }) => (
          <View style={styles.reportItem}>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
            <Button title="Proses" onPress={() => router.push(`/screens/report/satgasprocess?id=${item.id}`)} />
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
