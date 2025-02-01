import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import axios from 'axios'; // Untuk memanggil API
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateReport() {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '', // Email diambil dari user yang login
    location: '',
    description: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ambil data pengguna yang sudah login (dari token yang ada)
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://10.0.2.2:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData((prevData) => ({
          ...prevData,
          email: response.data.email, // Ambil email dari response dan set
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async () => {
  // Pastikan semua data wajib diisi
  if (!formData.title || !formData.name || !formData.location || !formData.description || !formData.email) {
    alert('Pastikan semua data yang wajib diisi sudah lengkap');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      alert('Token tidak ditemukan, pastikan Anda sudah login');
      return;
    }

    const response = await axios.post(
      'http://10.0.2.2:5000/api/reports',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Kirimkan token dalam header
        },
      }
    );
    console.log('Laporan berhasil dikirim', response.data);
    alert('Laporan berhasil dikirim');
  } catch (error) {
    console.error('Error mengirim laporan:', error);
    alert('Terjadi kesalahan saat mengirim laporan.');
  }
};



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Formulir Laporan Kasus Pelecehan dan Kekerasan Seksual</Text>

      {/* Judul Laporan */}
      <TextInput
        style={styles.input}
        placeholder="Judul Laporan"
        value={formData.title}
        onChangeText={(text) => handleChange('title', text)}
      />

      <Text style={styles.subHeader}>Informasi Pelapor (Bersifat Rahasia):</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)} // User bisa mengisi email mereka sendiri
      />


      <Text style={styles.subHeader}>Informasi Kejadian:</Text>

      <TextInput
        style={styles.input}
        placeholder="Lokasi Kejadian"
        value={formData.location}
        onChangeText={(text) => handleChange('location', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Deskripsi Kejadian"
        value={formData.description}
        onChangeText={(text) => handleChange('description', text)}
      />

      {/* Submit Button */}
      <Button title="Kirim Laporan" onPress={handleSubmit} />
    </ScrollView>
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
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
