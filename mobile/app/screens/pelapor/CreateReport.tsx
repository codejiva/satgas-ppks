import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateReport() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jadwalPertemuan, setJadwalPertemuan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !location || !jadwalPertemuan) {
      Alert.alert('Form tidak lengkap', 'Harap lengkapi semua field');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Token tidak ditemukan', 'Harap login terlebih dahulu');
        return;
      }

      const response = await axios.post(
        'http://10.0.2.2:5000/api/reports',
        {
          title,
          description,
          location,
          jadwal_pertemuan: jadwalPertemuan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Sukses', 'Laporan berhasil dibuat!');
      // Reset form after submission
      setTitle('');
      setDescription('');
      setLocation('');
      setJadwalPertemuan('');
    } catch (error) {
      console.error('❌ Gagal mengirim laporan:', error);
      Alert.alert('Gagal', 'Terjadi masalah saat mengirim laporan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buat Laporan</Text>

      <TextInput
        style={styles.input}
        placeholder="Judul Laporan"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Deskripsi Laporan"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Lokasi"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Jadwal Pertemuan"
        value={jadwalPertemuan}
        onChangeText={setJadwalPertemuan}
      />

      <Button title={loading ? 'Menyimpan...' : 'Buat Laporan'} onPress={handleSubmit} disabled={loading} />

      {loading && <Text>Loading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
