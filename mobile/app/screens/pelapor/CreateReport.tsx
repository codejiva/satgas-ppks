import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Untuk pick image dari gallery

export default function CreateReport() {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    phone: '',
    location: '',
    description: '',
    evidence: '', // Path file bukti
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, evidence: result.uri }));
    }
  };

  const handleSubmit = () => {
    // Validasi form, pastikan field yang wajib terisi
    if (!formData.title || !formData.name || !formData.description) {
      alert('Pastikan semua data yang wajib diisi sudah lengkap');
      return;
    }

    // Kirim form (contoh log ke console)
    console.log(formData);
    alert('Laporan berhasil dikirim');
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
        placeholder="Nomor Telepon / Email"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
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

      {/* Bukti (file upload) */}
      <Button title="Upload Bukti" onPress={handleFileUpload} />
      {formData.evidence && <Image source={{ uri: formData.evidence }} style={{ width: 200, height: 200 }} />}

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
