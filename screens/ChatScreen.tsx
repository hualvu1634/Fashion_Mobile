import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { productService } from '../services/productService';

// ====================================================
// CẤU HÌNH API KEY CỨNG Ở ĐÂY (HARDCODED GEMINI API KEY)
// Bạn có thể dán trực tiếp API Key của bạn vào chuỗi dưới đây.
// Nếu để trống, màn hình Chat sẽ tự động kích hoạt Chế độ Dùng thử (Mock AI)
// để bạn có thể test đầy đủ các luồng thêm sản phẩm/đặt hàng mà không cần API Key!
// ====================================================
const HARDCODED_GEMINI_API_KEY = 'AIzaSyD-Mhe5L-dB4Fe_DKS8V2RiJ1v8fCePIKA'; 

// Tải từ biến môi trường mặc định nếu có
let ENV_GEMINI_KEY = '';
try {
  const env = require('@env');
  ENV_GEMINI_KEY = env.GEMINI_API_KEY || '';
} catch (e) {
  console.log('Could not load GEMINI_API_KEY from @env module', e);
}

// Warm Color Palette Theme
const WARM_THEME = {
  bg: '#FFFDF8',
  secondaryBg: '#FCF4EF',
  primary: '#B45309',
  primaryDark: '#92400E',
  primaryLight: '#FEF3C7',
  textDark: '#1F2937',
  textMuted: '#6B7280',
  border: '#FBEFDF',
  white: '#FFFFFF',
};

// Interface definitions
interface MessageCommand {
  type: 'add_to_cart';
  productId: string;
  quantity: number;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  command?: MessageCommand;
  isMockBadge?: boolean; // Hiển thị badge chế độ thử nghiệm
}

interface InteractiveProductCardProps {
  productId: string;
  initialQuantity: number;
  productsList: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onOrderNow: (product: Product, quantity: number) => void;
}

// ----------------------------------------------------
// Smart Mock AI Response Generator (Chế độ chạy thử không Key)
// ----------------------------------------------------
const getMockAiResponse = (
  userQuery: string,
  products: Product[]
): { text: string; command?: MessageCommand } => {
  const query = userQuery.toLowerCase();
  let matchedProduct: Product | undefined = undefined;
  let requestedQuantity = 1;

  // Lấy số lượng nếu được nhắc tới (ví dụ: "mua 2 cái", "đặt 3 chiếc")
  const qtyMatch =
    query.match(/(\d+)\s*(cái|chiếc|đôi|kg|hộp|sản phẩm|cái áo|cái quần|cái nón|mũ|túi)/) ||
    query.match(/(mua|đặt)\s*(\d+)/);
  if (qtyMatch) {
    const num = parseInt(qtyMatch[1] || qtyMatch[2]);
    if (!isNaN(num) && num > 0) {
      requestedQuantity = num;
    }
  }

  // Khớp chính xác hoặc khớp một phần tên sản phẩm
  for (const product of products) {
    const prodName = product.name.toLowerCase();
    const prodBrand = product.brand.toLowerCase();
    if (query.includes(prodName) || query.includes(prodBrand + ' ' + prodName)) {
      matchedProduct = product;
      break;
    }
  }

  // Khớp danh mục nếu không tìm thấy tên chính xác
  if (!matchedProduct) {
    if (query.includes('áo thun') || query.includes('tee') || query.includes('tshirt') || query.includes('t-shirt')) {
      matchedProduct = products.find((p) => p.category === 't-shirts');
    } else if (query.includes('áo len') || query.includes('sweater') || query.includes('pullover') || query.includes('cardigan')) {
      matchedProduct = products.find((p) => p.category === 'sweaters');
    } else if (query.includes('quần') || query.includes('jean') || query.includes('denim')) {
      matchedProduct = products.find((p) => p.category === 'jeans');
    } else if (query.includes('giày') || query.includes('shoe') || query.includes('sneaker') || query.includes('runner')) {
      matchedProduct = products.find((p) => p.category === 'shoes');
    } else if (query.includes('nón') || query.includes('mũ') || query.includes('hat') || query.includes('cap')) {
      matchedProduct = products.find((p) => p.category === 'hats');
    } else if (query.includes('túi') || query.includes('bag') || query.includes('tote') || query.includes('clutch')) {
      matchedProduct = products.find((p) => p.category === 'accessories');
    } else if (query.includes('áo khoác') || query.includes('coat') || query.includes('parka') || query.includes('trench')) {
      matchedProduct = products.find((p) => p.category === 'outerwear');
    } else if (query.includes('váy') || query.includes('đầm') || query.includes('dress') || query.includes('gown')) {
      matchedProduct = products.find((p) => p.category === 'dresses');
    }
  }

  if (matchedProduct) {
    return {
      text: `Tôi đã tìm thấy sản phẩm **${matchedProduct.name}** thuộc hãng **${matchedProduct.brand}** phù hợp với yêu cầu của bạn. Tôi hiển thị thẻ đặt mua trực tiếp cho sản phẩm này ngay bên dưới. Bạn có muốn thêm vào giỏ hàng hoặc nhấn Đặt ngay để tiến hành thanh toán không?`,
      command: {
        type: 'add_to_cart',
        productId: matchedProduct.id,
        quantity: requestedQuantity,
      },
    };
  }

  // Phản hồi chào hỏi/hướng dẫn mặc định
  return {
    text: `Chào bạn! Hiện tại Hydro Fashion đang có các dòng sản phẩm:
- Áo thun (Oversized Tee, Cotton Crewneck, Graphic Tee)
- Quần Jeans (Slim Jeans, Distressed Denim, Straight Leg)
- Giày Sneakers (Distance Runners, Urban Sneakers)
- Áo khoác (Wool Coat, Navy Overcoat, Heritage Trench)
- Váy đầm (Floral Midi, Wrap Dress, Evening Gown)
- Phụ kiện thời trang (Mũ Signature Cap, Túi xách Canvas Tote, Da Leather Sling)

Bạn có muốn tìm hiểu hay đặt hàng sản phẩm nào không? (Ví dụ bạn có thể gõ: "Tôi muốn đặt mua 2 chiếc Slim Jeans")`,
  };
};

// ----------------------------------------------------
// Interactive Product Card Component
// ----------------------------------------------------
const InteractiveProductCard: React.FC<InteractiveProductCardProps> = ({
  productId,
  initialQuantity,
  productsList,
  onAddToCart,
  onOrderNow,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const product = productsList.find((p) => p.id === productId);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  if (!product) {
    return (
      <View style={styles.cardErrorContainer}>
        <Feather name="alert-circle" size={16} color={Colors.error} />
        <Text style={styles.cardErrorText}>Sản phẩm này không còn tồn tại</Text>
      </View>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };

  // Mock stock quantity
  const mockStock = Math.max(3, (product.reviewCount % 12) + 2);

  return (
    <View style={styles.productCard}>
      {/* Product Image & Meta */}
      <View style={styles.productCardHeader}>
        <Image source={product.imageUrl as any} style={styles.productCardImage} />
        <View style={styles.productCardMeta}>
          <Text style={styles.productCardBrand}>{product.brand}</Text>
          <Text style={styles.productCardName} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.productCardPrice}>
            ${product.price.toFixed(2)}
          </Text>
          <Text style={styles.productCardStock}>
            Chỉ còn {mockStock} sản phẩm trong kho
          </Text>
        </View>
      </View>

      {/* Quantity Selector */}
      <View style={styles.quantitySelectorContainer}>
        <Text style={styles.quantityLabel}>Số lượng:</Text>
        <View style={styles.quantityController}>
          <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
            <Feather name="minus" size={16} color={WARM_THEME.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
            <Feather name="plus" size={16} color={WARM_THEME.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.productCardActions}>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => onAddToCart(product, quantity)}
        >
          <Feather name="shopping-cart" size={14} color={WARM_THEME.primary} />
          <Text style={styles.btnTextSecondary}>Thêm vào giỏ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => onOrderNow(product, quantity)}
        >
          <Feather name="zap" size={14} color={WARM_THEME.white} />
          <Text style={styles.btnTextPrimary}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ----------------------------------------------------
// Main Chat Screen Component
// ----------------------------------------------------
export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  // App States
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Chào bạn! Mình là Trợ lý AI của cửa hàng. Bạn cần mình tư vấn hay tìm mua trang phục nào hôm nay?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Model ID cố định là gemini-2.5-flash theo yêu cầu
  const selectedModel = 'gemini-2.5-flash';

  // Xác định API key hiện hành
  const activeKey = HARDCODED_GEMINI_API_KEY || ENV_GEMINI_KEY || '';

  // Load products list
  useEffect(() => {
    const initApp = async () => {
      try {
        const productsData = await productService.getProducts();
        setProductsList(productsData);
      } catch (err) {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
      }
    };
    initApp();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, quantity: number) => {
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || '#000000';
    useCartStore.getState().addToCart(product, quantity, defaultSize, defaultColor);
    triggerToast(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
  };

  // Order now handler
  const handleOrderNow = (product: Product, quantity: number) => {
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || '#000000';
    useCartStore.getState().addToCart(product, quantity, defaultSize, defaultColor);
    router.push('/checkout');
  };

  // Send message and call Gemini (or Mock fallback)
  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // ====================================================
    // CHẾ ĐỘ DÙNG THỬ (MOCKUP AI) NẾU CHƯA CÓ API KEY
    // ====================================================
    if (!activeKey) {
      setTimeout(() => {
        const mockResult = getMockAiResponse(textToSend, productsList);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: mockResult.text,
          isUser: false,
          timestamp: new Date(),
          command: mockResult.command,
          isMockBadge: true, // Đánh dấu tin nhắn demo
        };
        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
      }, 700);
      return;
    }

    // ====================================================
    // GỌI API GEMINI THẬT NẾU ĐÃ CÓ KEY
    // ====================================================
    try {
      // Build system prompt based on loaded products
      const formattedProducts = productsList
        .map(
          (p) =>
            `- ID: "${p.id}", Tên: "${p.name}", Brand: "${p.brand}", Giá: $${p.price.toFixed(2)}, Danh mục: "${p.category}", Kích thước: [${p.sizes.join(', ')}], Màu sắc: [${p.colors.join(', ')}]`
        )
        .join('\n');

      const systemInstruction = `
Bạn là trợ lý AI mua sắm và tư vấn thời trang thông minh, vui vẻ và thân thiện của cửa hàng thời trang cao cấp Hydro Fashion.
Nhiệm vụ của bạn là:
1. Chào hỏi người dùng, tư vấn lựa chọn sản phẩm phù hợp với nhu cầu, sở thích, màu sắc, kích thước và ngân sách của họ.
2. Bạn CHỈ được tư vấn các sản phẩm có sẵn trong danh sách sản phẩm của cửa hàng dưới đây:
${formattedProducts}

3. Khi người dùng nói rằng họ muốn mua, muốn đặt hàng, thêm vào giỏ hàng hoặc thể hiện mong muốn đặt mua một sản phẩm cụ thể:
   - Hãy tìm sản phẩm đó trong danh sách trên dựa vào Tên hoặc Mô tả sản phẩm.
   - Nếu tìm thấy sản phẩm, bạn BẮT BUỘC phải đính kèm khối lệnh JSON ở cuối tin nhắn của bạn. Định dạng khối lệnh JSON này bắt buộc phải là:
     {"type": "add_to_cart", "productId": "ID_SAN_PHAM", "quantity": SO_LUONG}
     Ví dụ: {"type": "add_to_cart", "productId": "1", "quantity": 1}
     (Lưu ý: Không tạo ra ID sản phẩm không tồn tại trong danh sách. Nếu người dùng không chỉ định số lượng cụ thể, hãy mặc định là 1).
   - Đồng thời phản hồi kèm theo câu thoại ngắn gọn và tự nhiên thông báo rằng bạn đã tìm thấy sản phẩm và hiển thị thẻ đặt hàng trực tiếp cho họ.
4. Phản hồi hoàn toàn bằng tiếng Việt lịch sự, trẻ trung, tự nhiên và chuyên nghiệp. Không sử dụng các từ ngữ thô tục hay không phù hợp.
`;

      // Format conversation history for Gemini (alternating user and model)
      const currentHistory = [...messages, userMsg];
      const contents = currentHistory.map((m) => ({
        role: m.isUser ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      // Call Gemini REST API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${activeKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
      }

      const responseJson = await response.json();
      const rawAiText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse JSON Command out of the response
      const jsonRegex = /\{[\s\S]*?"type"\s*:\s*"add_to_cart"[\s\S]*?\}/g;
      const match = rawAiText.match(jsonRegex);

      let cleanedText = rawAiText;
      let command: MessageCommand | undefined = undefined;

      if (match) {
        for (const jsonStr of match) {
          try {
            const cleanJson = jsonStr.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.type === 'add_to_cart' && parsed.productId) {
              command = {
                type: 'add_to_cart',
                productId: String(parsed.productId),
                quantity: typeof parsed.quantity === 'number' ? parsed.quantity : 1,
              };
              cleanedText = cleanedText.replace(jsonStr, '');
            }
          } catch (e) {
            console.log('Không thể phân tích cú pháp JSON lệnh:', e);
          }
        }
      }

      // Cleanup remaining empty code blocks
      cleanedText = cleanedText
        .replace(/```json\s*```/g, '')
        .replace(/```\s*```/g, '')
        .trim();

      if (!cleanedText && command) {
        cleanedText = 'Dưới đây là thẻ đặt hàng sản phẩm bạn yêu cầu:';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: cleanedText || 'Tôi có thể hỗ trợ gì thêm cho bạn?',
        isUser: false,
        timestamp: new Date(),
        command,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Đã xảy ra lỗi khi kết nối với Gemini. Vui lòng kiểm tra lại kết nối mạng hoặc API Key của bạn. Chi tiết: ${err?.message || ''}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={WARM_THEME.bg} />

        {/* Custom Premium Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Feather name="arrow-left" size={24} color={WARM_THEME.primary} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <View style={styles.headerLogoCircle}>
              <Ionicons name="sparkles" size={16} color={WARM_THEME.white} />
            </View>
            <View style={styles.headerTitleSubGroup}>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>
                {activeKey ? `Gemini ${selectedModel}` : 'Chế độ chạy thử (Mock AI)'}
              </Text>
            </View>
          </View>

          {/* Thay thế nút Settings bằng view đệm để căn giữa tiêu đề */}
          <View style={{ width: 40 }} />
        </View>

        {/* Chat Area */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[styles.bubbleContainer, item.isUser ? styles.userContainer : styles.aiContainer]}>
                {/* Avatar representation for AI */}
                {!item.isUser && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="chatbubble-ellipses" size={16} color={WARM_THEME.primary} />
                  </View>
                )}

                <View style={styles.bubbleAndCardContainer}>
                  {/* Text bubble */}
                  {item.text.trim().length > 0 && (
                    <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
                      <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
                        {item.text}
                      </Text>
                      {item.isMockBadge && (
                        <View style={styles.mockBadge}>
                          <Text style={styles.mockBadgeText}>Chế độ dùng thử</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Interactive Command Card */}
                  {item.command && item.command.type === 'add_to_cart' && (
                    <InteractiveProductCard
                      productId={item.command.productId}
                      initialQuantity={item.command.quantity}
                      productsList={productsList}
                      onAddToCart={handleAddToCart}
                      onOrderNow={handleOrderNow}
                    />
                  )}
                </View>
              </View>
            )}
            ListFooterComponent={
              loading ? (
                <View style={styles.loadingBubbleContainer}>
                  <View style={styles.aiAvatar}>
                    <Ionicons name="chatbubble-ellipses" size={16} color={WARM_THEME.primary} />
                  </View>
                  <View style={styles.loadingBubble}>
                    <ActivityIndicator size="small" color={WARM_THEME.primary} />
                  </View>
                </View>
              ) : null
            }
          />

          {/* Floating Toast Notification */}
          {toastMessage && (
            <View style={styles.toast}>
              <Ionicons name="checkmark-circle" size={20} color={WARM_THEME.white} />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Hỏi về sản phẩm hoặc gõ 'Mua Oversized Tee'..."
              placeholderTextColor={WARM_THEME.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!loading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || loading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <Feather name="send" size={18} color={WARM_THEME.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

// ----------------------------------------------------
// Styles
// ----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WARM_THEME.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WARM_THEME.border,
    backgroundColor: WARM_THEME.bg,
    elevation: 2,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: WARM_THEME.secondaryBg,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  headerLogoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WARM_THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitleSubGroup: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WARM_THEME.textDark,
  },
  headerSubtitle: {
    fontSize: 10,
    color: WARM_THEME.textMuted,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  bubbleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WARM_THEME.secondaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
    borderWidth: 1,
    borderColor: WARM_THEME.border,
  },
  bubbleAndCardContainer: {
    maxWidth: '82%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: WARM_THEME.primary,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
    elevation: 1,
    shadowColor: WARM_THEME.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  aiBubble: {
    backgroundColor: WARM_THEME.secondaryBg,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: WARM_THEME.border,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: WARM_THEME.white,
  },
  aiText: {
    color: WARM_THEME.textDark,
  },
  mockBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(180, 83, 9, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mockBadgeText: {
    fontSize: 9,
    color: WARM_THEME.primary,
    fontWeight: '700',
  },
  loadingBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: WARM_THEME.secondaryBg,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: WARM_THEME.border,
  },

  // Interactive Card Styles
  productCard: {
    marginTop: 10,
    backgroundColor: WARM_THEME.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WARM_THEME.border,
    padding: 12,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  cardErrorContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFEEEE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD2D2',
  },
  cardErrorText: {
    color: Colors.error,
    marginLeft: 8,
    fontSize: 14,
  },
  productCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productCardImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: WARM_THEME.secondaryBg,
  },
  productCardMeta: {
    flex: 1,
    marginLeft: 12,
  },
  productCardBrand: {
    fontSize: 11,
    color: WARM_THEME.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  productCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: WARM_THEME.textDark,
    marginVertical: 2,
  },
  productCardPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: WARM_THEME.primary,
  },
  productCardStock: {
    fontSize: 10,
    color: '#059669',
    marginTop: 2,
    fontWeight: '500',
  },
  quantitySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: WARM_THEME.border,
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 13,
    color: WARM_THEME.textDark,
  },
  quantityController: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WARM_THEME.secondaryBg,
    borderRadius: 8,
    padding: 3,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WARM_THEME.white,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: WARM_THEME.textDark,
    marginHorizontal: 12,
  },
  productCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  btnPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WARM_THEME.primary,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  btnTextPrimary: {
    color: WARM_THEME.white,
    fontSize: 13,
    fontWeight: '700',
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WARM_THEME.primaryLight,
    borderWidth: 1,
    borderColor: WARM_THEME.border,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  btnTextSecondary: {
    color: WARM_THEME.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: WARM_THEME.border,
    backgroundColor: WARM_THEME.bg,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  input: {
    flex: 1,
    backgroundColor: WARM_THEME.secondaryBg,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minHeight: 44,
    fontSize: 15,
    color: WARM_THEME.textDark,
    borderWidth: 1,
    borderColor: WARM_THEME.border,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WARM_THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: WARM_THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sendButtonDisabled: {
    backgroundColor: WARM_THEME.textMuted,
    opacity: 0.5,
  },

  // Toast Styles
  toast: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(180, 83, 9, 0.95)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  toastText: {
    color: WARM_THEME.white,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
