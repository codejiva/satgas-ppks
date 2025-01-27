// app/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    axios.post('http://localhost:5000/api/auth/login', {
      username,
      password,
    })
    .then(async response => {
      // Simpan token ke AsyncStorage
      const { token } = response.data;
      await AsyncStorage.setItem('userToken', token);
  
      // Navigasi ke halaman utama
      navigator.navigate('Home');
    })
    .catch(error => {
      Alert.alert('Login Failed', error.response?.data || 'Error logging in');
    });
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => router.push('/screens/auth/RegisterScreen')} />
    </View>
  );
};

export default LoginScreen;
