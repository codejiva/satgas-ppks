import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import NavBar from '../../components/NavBar'; // Import NavBar

export default function SatgasDashboard() {
  const router = useRouter();

  const menuItems = [
    { title: 'Total Laporan', icon: 'file-alt', path: '/screens/satgas/LaporanList' },
    { title: 'Pending', icon: 'clock', path: '/screens/satgas/PendingList' },
    { title: 'Accepted', icon: 'check-circle', path: '/screens/satgas/AcceptedList' },
    { title: 'Rejected', icon: 'times-circle', path: '/screens/satgas/RejectedList' },
    { title: 'Janji Temu', icon: 'calendar-alt', path: '/screens/satgas/JanjiTemuList' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard Satgas</Text>
      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(item.path)}>
            <FontAwesome5 name={item.icon} size={32} color="#000" />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <NavBar /> {/* Tambahkan Navigation Bar */}
    </View>
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
    color: '#000',
  },
});
