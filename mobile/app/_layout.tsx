import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="screens/HomeScreen" // Rute ke HomeScreen
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="screens/ReportsScreen" // Rute ke ReportsScreen
        options={{ title: 'Reports' }}
      />
      <Tabs.Screen
        name="screens/ProfileScreen" // Rute ke ProfileScreen
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}