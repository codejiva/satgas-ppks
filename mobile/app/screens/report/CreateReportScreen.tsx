import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CreateReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      return Alert.alert('Error', 'Anda belum login.');
    }

    await axios.post(
      'http://10.0.2.2:5000/api/reports',
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Alert.alert('Sukses', 'Laporan berhasil dikirim!');
    router.replace('/screens/report/ListReportScreen');
  } catch (error: unknown) {
    console.error('Error submitting report:', error);

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
      <Text style={styles.title}>Buat Laporan Baru</Text>
      <TextInput
        style={styles.input}
        placeholder="Judul Laporan"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Deskripsi Laporan"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Kirim Laporan" onPress={handleSubmit} />
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
