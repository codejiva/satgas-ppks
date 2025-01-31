import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function NavBar() {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      {/* Home */}
      <TouchableOpacity onPress={() => router.push('/screens/home')} style={styles.navItem}>
        <FontAwesome5 name="home" size={20} color="black" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => router.push('/screens/profile')} style={styles.navItem}>
        <FontAwesome5 name="user" size={20} color="black" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>

      {/* Tombol Plus untuk membuat laporan */}
      <TouchableOpacity onPress={() => router.push('/screens/pelapor/CreateReport')} style={styles.addReportButton}>
        <FontAwesome5 name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'relative',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    marginTop: 4,
    color: 'black',
  },
  addReportButton: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
