import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://10.0.2.2:5000/api/auth/login', {
            username,
            password,
        });

        if (!response.data.token) {
            throw new Error('Token tidak ditemukan, periksa kembali kredensial Anda.');
        }

        await AsyncStorage.setItem('userToken', response.data.token);
        router.replace('/screens/home'); 
    } catch (error: unknown) {
        console.error('Login Error:', error);

        if (axios.isAxiosError(error)) {
            Alert.alert('Login Gagal', error.response?.data?.message || 'Terjadi kesalahan.');
        } else if (error instanceof Error) {
            Alert.alert('Login Gagal', error.message);
        } else {
            Alert.alert('Login Gagal', 'Terjadi kesalahan yang tidak diketahui.');
        }
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => router.push('/screens/auth/register')} />
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
});
