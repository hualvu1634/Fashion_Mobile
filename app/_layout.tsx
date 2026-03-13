import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router"; // Thêm useRouter, useSegments
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Image } from "expo-image";

// Import Store và Constants
import { useAuthStore } from "../store/useAuthStore"; 
import { initializeFavorites } from "../store/useFavoritesStore";
import { BRAND_IMAGES, BANNER_IMAGES, CATEGORY_IMAGES } from "../constants/images";
import ErrorBoundary from "./error-boundary";

export const unstable_settings = {
 
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome.font,
  });

  // Lấy state từ Auth Store
  const { isAuthenticated, loadUserFromStorage } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  // State để biết khi nào app đã sẵn sàng (load xong font + check xong user)
  const [isReady, setIsReady] = useState(false);

  // 1. Xử lý lỗi Font
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // 2. Load Resources (Font, Image) & Kiểm tra User
  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        try {
          // Preload ảnh
          const imagesToPreload = [
            BRAND_IMAGES.logo,
            BANNER_IMAGES.summerCollection,
            ...Object.values(CATEGORY_IMAGES).slice(0, 4)
          ];
          await Image.prefetch(imagesToPreload);
          
          // QUAN TRỌNG: Load thông tin user từ bộ nhớ máy
          await loadUserFromStorage();
          
          // Init favorites
          initializeFavorites();
        } catch (e) {
          console.warn(e);
        } finally {
          setIsReady(true); // Đánh dấu đã xong
          await SplashScreen.hideAsync();
        }
      }
    }
    prepare();
  }, [fontsLoaded]);


  useEffect(() => {
    if (!isReady) return; 
    const inAuthGroup = segments[0] === 'auth'; 

    if (!isAuthenticated && !inAuthGroup) {
  
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {

      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isReady]);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerShadowVisible: false,
      }}
    >
      {/* Màn hình chính (Tabs) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Các màn hình Auth */}
      <Stack.Screen 
        name="auth/login" 
        options={{ 
          title: "Đăng nhập", 
          headerShown: false // Ẩn header để login đẹp hơn
        }} 
      />
      <Stack.Screen 
        name="auth/signup" 
        options={{ 
          title: "Đăng ký", 
          headerShown: false 
        }} 
      />

      {/* Các màn hình khác */}
      <Stack.Screen name="product/[id]" options={{ title: "Chi tiết sản phẩm" }} />
      <Stack.Screen name="product/category/[id]" options={{ title: "Danh mục" }} />
      <Stack.Screen name="checkout" options={{ title: "Thanh toán" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}