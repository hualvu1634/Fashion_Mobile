//import 'expo-router/entry';
import 'expo-router/entry';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { initializeFavorites } from './store/useFavoritesStore';
import { Image } from 'expo-image';
import { BRAND_IMAGES, BANNER_IMAGES, CATEGORY_IMAGES } from './constants/images';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings in development
LogBox.ignoreLogs([
  'Overwriting fontFamily style attribute preprocessor',
  'Constants.platform.ios.model has been deprecated',
]);

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Error loading fonts:', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      // Preload important images
      const imagesToPreload = [
        BRAND_IMAGES.logo,
        BANNER_IMAGES.summerCollection,
        ...Object.values(CATEGORY_IMAGES).slice(0, 4)
      ];
      
      // Preload images in background
      Image.prefetch(imagesToPreload);
      
      // Initialize app data
      initializeFavorites();
      
      // Hide splash screen once everything is ready
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Return null since Expo Router handles the rendering
  return null;
}