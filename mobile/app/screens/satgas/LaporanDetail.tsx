import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Use useLocalSearchParams

export default function LaporanDetail() {
  const [laporanDetail, setLaporanDetail] = useState<any>(null); // State untuk menyimpan detail laporan
  const [status, setStatus] = useState<string>(''); // Status laporan
  const [appointmentDate, setAppointmentDate] = useState<string>(''); // Tanggal janji temu jika diterima
  const [rejectionReason, setRejectionReason] = useState<string>(''); // Alasan penolakan jika ditolak
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  const { id } = useLocalSearchParams(); // Menggunakan useLocalSearchParams untuk mendapatkan id

  useEffect(() => {
    // Mengecek jika id laporan ada di query params
    if (!id) {
      console.error("❌ ID laporan tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchLaporanDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error("❌ Token tidak ditemukan, silakan login kembali.");
          setLoading(false);
          return;
        }

        // Mengambil detail laporan berdasarkan ID
        const response = await axios.get(`http://10.0.2.2:5000/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLaporanDetail(response.data);
        setStatus(response.data.status); // Set status laporan
      } catch (error) {
        console.error('❌ Gagal mengambil detail laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporanDetail();
  }, [id]);

  const handleAccept = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error("❌ Token tidak ditemukan");
      return;
    }

    // Validasi appointmentDate sebelum mengirim request
    if (!appointmentDate) {
      alert("Mohon isi tanggal janji temu!");
      return;
    }

    // Kirim status diterima dan appointmentDate
    await axios.put(
      `http://10.0.2.2:5000/api/reports/${id}/process`,
      { 
        status: 'accepted',
        appointment_date: appointmentDate,
        notes: "Laporan diterima. Terima kasih sudah melapor."  // Default notes jika diterima
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Laporan diterima, janji temu telah dijadwalkan!');
    router.push('/screens/satgas/dashboard'); // Kembali ke dashboard
  } catch (error) {
    console.error('❌ Gagal menerima laporan:', error);
    alert("Terjadi kesalahan, coba lagi nanti.");
  }
};

const handleReject = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error("❌ Token tidak ditemukan");
      return;
    }

    // Validasi rejectionReason sebelum mengirim request
    if (!rejectionReason) {
      alert("Mohon isi alasan penolakan!");
      return;
    }

    // Kirim status ditolak dan rejectionReason
    await axios.put(
      `http://10.0.2.2:5000/api/reports/${id}/process`,
      { 
        status: 'rejected',
        rejectionReason: rejectionReason,
        notes: rejectionReason  // notes berisi alasan penolakan
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Laporan ditolak, alasan telah dicatat!');
    router.push('/screens/satgas/dashboard'); // Kembali ke dashboard
  } catch (error) {
    console.error('❌ Gagal menolak laporan:', error);
    alert("Terjadi kesalahan, coba lagi nanti.");
  }
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!laporanDetail) {
    return (
      <View style={styles.container}>
        <Text>Laporan tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{laporanDetail.title}</Text>
      <Text style={styles.text}>Status: {laporanDetail.status}</Text>
      <Text style={styles.text}>Deskripsi: {laporanDetail.description}</Text>
      <Text style={styles.text}>Lokasi: {laporanDetail.location}</Text>
      <Text style={styles.text}>Dibuat pada: {new Date(laporanDetail.created_at).toLocaleString()}</Text>

      {status === 'pending' && (
        <View>
          <Text style={styles.text}>Jika diterima, pilih tanggal janji temu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Tanggal Janji Temu"
            value={appointmentDate}
            onChangeText={setAppointmentDate}
          />
          <Button title="Terima Laporan" onPress={handleAccept} />
          <Text style={styles.text}>Jika ditolak, beri alasan penolakan:</Text>
          <TextInput
            style={styles.input}
            placeholder="Alasan Penolakan"
            value={rejectionReason}
            onChangeText={setRejectionReason}
          />
          <Button title="Tolak Laporan" onPress={handleReject} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
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