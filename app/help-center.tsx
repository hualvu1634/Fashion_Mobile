import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router'; // Thêm Stack để ẩn header mặc định
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../constants/colors';
import { Feather } from '@expo/vector-icons'; 
export default function HelpCenterScreen() {
  const router = useRouter();

  const faqs = [
    {
      question: 'Làm thế nào để theo dõi đơn hàng của tôi?',
      answer: 'Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" trên trang cá nhân.',
    },
    {
      question: 'Chính sách đổi trả của EPU Fashion là gì?',
      answer: 'Chúng tôi chấp nhận đổi trả trong vòng 30 ngày nếu sản phẩm còn nguyên vẹn.',
    },
    {
      question: 'Làm thế nào để liên hệ với hỗ trợ khách hàng?',
      answer: 'Bạn có thể liên hệ qua email hoặc số điện thoại bên dưới.',
    },
  ];

  return (
    <>
      {/* Ẩn header mặc định để đảm bảo không có tiêu đề nào từ Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Trung tâm trợ giúp</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Liên hệ hỗ trợ</Text>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:support@epufashion.com')}
          >
            <Feather name="mail" size={20} color={Colors.gray[700]} />
            <Text style={styles.contactText}>support@epufashion.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Linking.openURL('tel:+1234567890')}
          >
            <Feather name="phone" size={20} color={Colors.gray[700]} />
            <Text style={styles.contactText}>+1 234 567 890</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 16,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  contactText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
});