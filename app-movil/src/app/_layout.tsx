import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import SideMenu from '@/components/SideMenu';
import { MenuProvider } from '@/context/MenuContext';
import { RegistroProvider } from "@/context/RegistroContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RegistroProvider>
        <MenuProvider>
          <AnimatedSplashOverlay />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="registro" />
            <Stack.Screen name="registro-datos" />
            <Stack.Screen name="terminos" />
            <Stack.Screen name="(tabs)" />
          </Stack>

          <SideMenu />
        </MenuProvider>
      </RegistroProvider>
    </ThemeProvider>
  );
}