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
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { Feather } from '@expo/vector-icons'; 
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

 // Tìm hàm handleLogin và sửa đoạn router.replace:

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
      <Stack.Screen options={{ title: 'Đăng nhập', headerShadowVisible: false }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
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
              style={styles.loginButton}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text, marginBottom: 8,textAlign:"center" },
  errorContainer: { backgroundColor: Colors.error + '20', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: Colors.error, fontSize: 14 },
  form: { marginBottom: 24 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: Colors.primary, fontSize: 14 },
  loginButton: { marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingVertical: 16 },
  footerText: { color: Colors.gray[600], marginRight: 4 },
  signUpText: { color: Colors.primary, fontWeight: '600' },
});
