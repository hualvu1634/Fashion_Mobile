import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&auto=format&fit=crop";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    (async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('@user_email');
        if (storedEmail) setEmail(storedEmail);
      } catch (e) {
        console.log('Lỗi đọc email lưu trữ:', e);
      }
    })();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const errors = { email: '', password: '' };

    if (!email) {
      errors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (password.length < 4) {
      errors.password = 'Mật khẩu phải có ít nhất 4 ký tự';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const token = await login(email, password);
    if (token) {
      try {
        router.replace('/(tabs)'); 
      } catch (e) {
        console.error('Lỗi login:', e);
      }
    }
  };

  const handleSignUp = () => router.push('/auth/signup');

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '', 
          headerTransparent: true, 
          headerShadowVisible: false,
        }} 
      />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground source={{ uri: BACKGROUND_IMAGE }} style={styles.backgroundImage}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Đăng nhập</Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              <Input
                label="Email"
                labelStyle={{ color: 'white' }}
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Feather name="mail" size={20} color={Colors.gray[500]} />}
                error={formErrors.email}
              />

              <Input
                label="Mật khẩu"
                labelStyle={{ color: 'white' }}
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                isPassword
                leftIcon={<Feather name="lock" size={20} color={Colors.gray[500]} />}
                error={formErrors.password}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <Button
                title="Đăng nhập"
                onPress={handleLogin}
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                style={styles.customButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 32, marginTop: 40 },
  title: { fontSize: 32, fontWeight: '800', color: 'white', marginBottom: 8, textAlign: "center" },
  errorContainer: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: Colors.error, fontSize: 14 },
  form: { marginBottom: 16 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: 'red', fontSize: 14, fontWeight: '600' },
  customButton: { 
    marginBottom: 16, 
    backgroundColor: 'red', 
    borderWidth: 0,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8, paddingVertical: 16 },
  footerText: { color: 'white', marginRight: 4, fontWeight: '500' },
  signUpText: { color: 'red', fontWeight: '800' },
});