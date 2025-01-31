import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import NavBar from '../../components/NavBar'; // Import Navigation Bar

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems = [
    { title: 'Laporan', icon: 'file-alt', path: '/screens/admin/LaporanList' },
    { title: 'Satgas', icon: 'users', path: '/screens/admin/SatgasList' },
    { title: 'Pelapor', icon: 'user', path: '/screens/admin/PelaporList' },
    { title: 'Janji Temu', icon: 'calendar-alt', path: '/screens/admin/JanjiTemuList' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Pastikan string ini ada dalam <Text> */}
      <Text style={styles.header}>Dashboard Admin</Text>

      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(item.path)}>
            <FontAwesome5 name={item.icon} size={32} color="black" />
            {/* Pastikan string dibungkus <Text> */}
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Pastikan NavBar tetap ada */}
      <NavBar />
    </SafeAreaView>
  );
}

// ✅ **Styles setelah perbaikan**
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
    textAlign: 'center', // Pusatkan teks biar rapi
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center', // Pusatkan teks
  },
});
