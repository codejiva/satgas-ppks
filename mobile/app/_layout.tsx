import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Beranda" }} />
      <Stack.Screen name="report/create" options={{ title: "Buat Laporan" }} />
      <Stack.Screen name="report/list" options={{ title: "Daftar Laporan" }} />
    </Stack>
  );
}
