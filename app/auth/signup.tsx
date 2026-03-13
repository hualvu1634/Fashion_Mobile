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
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
    const errors = { name: '', email: '', password: '', confirmPassword: '' };

    if (!name) {
      errors.name = 'Tên là bắt buộc';
      isValid = false;
    }
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
    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

 // Tìm hàm handleSignup và sửa:

const handleSignup = async () => {
  if (!validateForm()) return;

  const token = await signup(name, email, password);
  if (token) {
    try {
      
      router.replace('/(tabs)');
      
    } catch (e) {
      console.error('Lỗi signup:', e);
    }
  }
};

  const handleLogin = () => router.push('/auth/login');

  return (
    <>
      <Stack.Screen options={{ title: 'Tạo tài khoản', headerShadowVisible: false }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Input label="Họ và tên" placeholder="Nhập họ và tên của bạn" value={name} onChangeText={setName} leftIcon={<Feather name="user" size={20} color={Colors.gray[500]} />} error={formErrors.name} />
            <Input label="Email" placeholder="Nhập email của bạn" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" leftIcon={<Feather name="mail" size={20} color={Colors.gray[500]} />} error={formErrors.email} />
            <Input label="Mật khẩu" placeholder="Tạo mật khẩu" value={password} onChangeText={setPassword} secureTextEntry isPassword leftIcon={<Feather name="lock" size={20} color={Colors.gray[500]} />} error={formErrors.password} />
            <Input label="Xác nhận mật khẩu" placeholder="Xác nhận mật khẩu của bạn" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry isPassword leftIcon={<Feather name="lock" size={20} color={Colors.gray[500]} />} error={formErrors.confirmPassword} />
            <Button title="Tạo tài khoản" onPress={handleSignup} fullWidth loading={isLoading} style={styles.signupButton} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản?</Text>
            <TouchableOpacity onPress={handleLogin}><Text style={styles.loginText}>Đăng nhập</Text></TouchableOpacity>
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
  title: { fontSize: 28, fontWeight: '700', color: Colors.text, marginBottom: 8 ,textAlign:"center"},

  errorContainer: { backgroundColor: Colors.error + '20', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: Colors.error, fontSize: 14 },
  form: { marginBottom: 24 },
  signupButton: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingVertical: 16 },
  footerText: { color: Colors.gray[600], marginRight: 4 },
  loginText: { color: Colors.primary, fontWeight: '600' },
});
