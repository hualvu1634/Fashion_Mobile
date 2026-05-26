import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { products } from '../mocks/products';
import { Product } from '../types';


// Kiểu dữ liệu cho tin nhắn
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  suggestedProducts?: Product[];
}

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Chào bạn! Mình là trợ lý AI. Mình có thể giúp bạn tìm quần áo, giày dép hoặc tư vấn theo mức giá.',
      isUser: false,
    },
  ]);

  // Logic "AI" đơn giản: Phân tích từ khóa để lọc sản phẩm
  const analyzeAndRecommend = (query: string): { text: string; items: Product[] } => {
    const lowerQuery = query.toLowerCase();
    let filtered = [...products];
    let responseText = '';

    // Lọc theo danh mục hoặc từ khóa
    const isJeans = lowerQuery.includes('jean') || lowerQuery.includes('quần');
    const isShirt = lowerQuery.includes('áo') || lowerQuery.includes('shirt') || lowerQuery.includes('tee');
    const isShoe = lowerQuery.includes('giày') || lowerQuery.includes('shoe');
    
    if (isJeans) filtered = filtered.filter(p => p.category === 'jeans');
    else if (isShirt) filtered = filtered.filter(p => p.category === 't-shirts' || p.category === 'sweaters');
    else if (isShoe) filtered = filtered.filter(p => p.category === 'shoes');

    // Lọc theo giá (ví dụ: "rẻ", "dưới 50")
    if (lowerQuery.includes('rẻ') || lowerQuery.includes('cheap')) {
      filtered = filtered.sort((a, b) => a.price - b.price);
      responseText = 'Đây là những sản phẩm có mức giá tốt nhất hiện tại:';
    } else if (lowerQuery.match(/dưới \d+/)) {
      const match = lowerQuery.match(/dưới (\d+)/);
      const maxPrice = match ? parseInt(match[1]) : 999;
      filtered = filtered.filter(p => p.price < maxPrice);
      responseText = `Mình tìm thấy vài món dưới $${maxPrice} cho bạn đây:`;
    } else {
      responseText = 'Mình đã tìm thấy một số sản phẩm phù hợp với bạn:';
    }

    // Giới hạn kết quả trả về
    const finalItems = filtered.slice(0, 4);

    if (finalItems.length === 0) {
      return {
        text: 'Xin lỗi, mình không tìm thấy sản phẩm nào khớp với yêu cầu của bạn. Bạn thử tìm từ khóa khác xem sao?',
        items: [],
      };
    }

    return { text: responseText, items: finalItems };
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Giả lập độ trễ của AI khi suy nghĩ
    setTimeout(() => {
      const recommendation = analyzeAndRecommend(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: recommendation.text,
        isUser: false,
        suggestedProducts: recommendation.items,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  const renderProduct = (product: Product) => (
    <TouchableOpacity 
      key={product.id} 
      style={styles.productCard}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <Image source={product.imageUrl} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Khung Chat */}
        <KeyboardAvoidingView 
          style={styles.chatContainer} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
                  {item.text}
                </Text>
                
                {/* Hiển thị sản phẩm gợi ý nếu có */}
                {item.suggestedProducts && item.suggestedProducts.length > 0 && (
                  <View style={styles.productsContainer}>
                    {item.suggestedProducts.map(renderProduct)}
                  </View>
                )}
              </View>
            )}
          />

          {/* Ô nhập tin nhắn */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder=""
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Feather name="send" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  chatContainer: { flex: 1 },
  messageList: { padding: 16, paddingBottom: 20 },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gray[100],
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: Colors.white },
  aiText: { color: Colors.text },
  productsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productCard: {
    width: 120,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: { width: '100%', height: 100, borderRadius: 6, marginBottom: 8 },
  productInfo: { flex: 1 },
  productName: { fontSize: 12, fontWeight: '600', color: Colors.text },
  productPrice: { fontSize: 12, color: Colors.primary, marginTop: 4, fontWeight: '700' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: Colors.gray[300] },
});