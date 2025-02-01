import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/screens/auth/login');
        return;
      }

      try {
        const response = await axios.get('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(response.data);
        setNewEmail(response.data.email);
        setNewUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Gagal memuat data pengguna');
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/screens/auth/login');
  };

  const handleUpdateProfile = async () => {
    if (!newEmail && !newPassword && !newUsername) {
      Alert.alert('Error', 'Email, username atau password harus diisi');
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'Anda belum login');
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        'http://10.0.2.2:5000/api/auth/me', // Update the route to match with your backend
        { username: newUsername, email: newEmail, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Profil berhasil diperbarui');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>

      {userDetails ? (
        <>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username baru"
              value={newUsername}
              onChangeText={setNewUsername}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email baru"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password baru"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{userDetails.role}</Text>
          </View>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Perbarui Profil</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#007bff" />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  profileInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  updateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
