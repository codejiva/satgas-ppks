import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CreateReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return Alert.alert('Gagal', 'Anda belum login.');
      }

      if (!title || !description || !location) {
        return Alert.alert('Gagal', 'Mohon lengkapi semua kolom sebelum mengirim laporan.');
      }

      await axios.post(
        'http://10.0.2.2:5000/api/reports',
        { title, description, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sukses ✅', 'Laporan Anda berhasil dikirim dan akan segera diproses.');
      router.replace('/screens/report/list'); // Perbaiki route agar sesuai dengan expo-router
    } catch (error: unknown) {
      console.error('Error submitting report:', error);

      if (axios.isAxiosError(error)) {
        Alert.alert('Error ❌', error.response?.data?.message || 'Terjadi kesalahan');
      } else if (error instanceof Error) {
        Alert.alert('Error ❌', error.message);
      } else {
        Alert.alert('Error ❌', 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Laporan📢</Text>
      <TextInput
        style={styles.input}
        placeholder="Laporan Terkait"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Detail"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Lokasi Kejadian"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Kirim Laporan 📩" onPress={handleSubmit} />
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
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
