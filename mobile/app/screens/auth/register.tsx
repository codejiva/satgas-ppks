import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('pelapor'); // Default role
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post('http://10.0.2.2:5000/api/auth/register', {
        username,
        password,
        role,
      });
      Alert.alert('Registrasi Berhasil', 'Silakan login');
      router.replace('/screens/auth/login');
    } catch (error: any) { // Gunakan "any" untuk menghindari error TypeScript
      Alert.alert('Registrasi Gagal', error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <Text style={styles.label}>Pilih Peran:</Text>
      <View style={styles.roleContainer}>
        <Button title="Pelapor" onPress={() => setRole('pelapor')} />
        <Button title="Satgas" onPress={() => setRole('satgas')} />
      </View>
      <Button title="Register" onPress={handleRegister} />
      <Button title="Kembali ke Login" onPress={() => router.push('/screens/auth/login')} />
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
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
});
