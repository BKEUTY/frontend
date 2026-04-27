import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../Context/AuthContext';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import chatbotApi from '../../api/chatbotApi';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const SESSION_KEY = 'bkeuty_chat_session';

const Chatbot = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        const initSession = async () => {
            if (user?.id) {
                setSessionId(`user_${user.id}`);
            } else {
                try {
                    let id = await AsyncStorage.getItem(SESSION_KEY);
                    if (!id || id.startsWith('user_')) {
                        id = `sess_mob_${Math.random().toString(36).substr(2, 9)}`;
                        await AsyncStorage.setItem(SESSION_KEY, id);
                    }
                    setSessionId(id);
                } catch (error) {
                    console.error("AsyncStorage error", error);
                }
            }
        };
        initSession();
    }, [user]);

    const fetchHistory = async (id) => {
        if (!id) return;
        setIsLoading(true);

        try {
            const response = await chatbotApi.getHistory(id);
            if (response.data) {
                const historyMessages = response.data.map(msg => ({
                    id: msg.id || Math.random().toString(),
                    sender: msg.sender === 'user' ? 'user' : 'bot',
                    content: msg.content,
                    recommendedProduct: msg.recommendedProduct?.[0] || null
                }));
                setMessages(historyMessages);
            }
        } catch (error) {
            console.error("Fetch history error", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && sessionId) {
            fetchHistory(sessionId);
        }
    }, [isOpen, sessionId]);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const currentMsg = inputValue;
        const userMsg = {
            id: Date.now().toString(),
            sender: 'user',
            content: currentMsg
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await chatbotApi.sendMessage({
                sessionId,
                message: currentMsg,
                language: language
            });

            if (response.data) {
                const botMsg = {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    content: response.data.response,
                    recommendedProduct: response.data.recommendedProduct?.[0] || null
                };
                setMessages(prev => [...prev, botMsg]);
            }
        } catch (error) {
            console.error("Send message error", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleProductPress = (product) => {
        setIsOpen(false);
        navigation.navigate('ProductDetail', { productId: product.productId || product.id });
    };

    const renderMessage = ({ item }) => {
        const isBot = item.sender === 'bot';

        return (
            <View style={[
                styles.messageContainer,
                isBot ? styles.botMessageContainer : styles.userMessageContainer
            ]}>
                {isBot && (
                    <View style={styles.botAvatarGroup}>
                        <View style={styles.botAvatar}>
                            <Ionicons name="robot-outline" size={18} color={COLORS.primary} />
                        </View>
                    </View>
                )}
                <View style={styles.messageContent}>
                    <View style={[
                        styles.messageBubble,
                        isBot ? styles.botBubble : styles.userBubble
                    ]}>
                        <Markdown style={{ 
                            body: { 
                                color: isBot ? '#1e293b' : 'white', 
                                fontSize: 14, 
                                lineHeight: 20 
                            } 
                        }}>
                            {item.content}
                        </Markdown>
                    </View>
                    
                    {item.recommendedProduct && (
                        <TouchableOpacity 
                            style={styles.productCard}
                            onPress={() => handleProductPress(item.recommendedProduct)}
                            activeOpacity={0.9}
                        >
                            <Image 
                                source={{ uri: item.recommendedProduct.imageUrl || item.recommendedProduct.image || 'https://placehold.co/150x150' }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={1}>
                                    {item.recommendedProduct.variantName || item.recommendedProduct.name}
                                </Text>
                                <Text style={styles.productPrice}>
                                    {(item.recommendedProduct.discountPrice || item.recommendedProduct.promotionPrice || 0).toLocaleString()} ₫
                                </Text>
                                <View style={styles.viewBadge}>
                                    <Text style={styles.viewBadgeText}>{t('view_now')}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderMessages = [
        {
            id: 'greeting',
            sender: 'bot',
            content: t('chatbot_greeting')
        },
        ...messages
    ];

    return (
        <>
            {!isOpen && (
                <TouchableOpacity
                    style={[styles.chatTrigger, SHADOWS.medium]}
                    onPress={() => setIsOpen(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
                </TouchableOpacity>
            )}

            <Modal
                visible={isOpen}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setIsOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>{t('chatbot_title')}</Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>{t('chatbot_online')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            onPress={() => setIsOpen(false)} 
                            style={styles.closeBtn}
                        >
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
                        ) : (
                            <FlatList
                                ref={flatListRef}
                                data={renderMessages}
                                keyExtractor={item => item.id}
                                renderItem={renderMessage}
                                contentContainerStyle={styles.listContent}
                                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                            />
                        )}
                        {isTyping && (
                            <View style={styles.typingIndicator}>
                                <View style={styles.botAvatarGroup}>
                                    <View style={styles.botAvatar}>
                                        <Ionicons name="robot-outline" size={18} color={COLORS.primary} />
                                    </View>
                                </View>
                                <View style={styles.typingBubble}>
                                    <ActivityIndicator size="small" color={COLORS.primary} />
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('chatbot_input_placeholder')}
                                value={inputValue}
                                onChangeText={setInputValue}
                                placeholderTextColor="#94a3b8"
                            />
                            <TouchableOpacity
                                style={[styles.sendBtn, !inputValue.trim() && { opacity: 0.5 }]}
                                onPress={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                            >
                                <Ionicons name="send" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfd',
    },
    chatTrigger: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.primary,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ade80',
        marginRight: 6,
    },
    statusText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    botMessageContainer: {
        alignSelf: 'flex-start',
    },
    botAvatarGroup: {
        alignItems: 'center',
        width: 32,
        marginHorizontal: 8,
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...SHADOWS.light,
    },
    messageContent: {
        maxWidth: width * 0.75,
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
    },
    botBubble: {
        backgroundColor: '#f1f5f9',
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    productCard: {
        marginTop: 8,
        width: 220,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...SHADOWS.medium,
    },
    productImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#f8fafc',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.primary,
        marginTop: 4,
    },
    viewBadge: {
        marginTop: 8,
        backgroundColor: '#fdf2f8',
        paddingVertical: 4,
        borderRadius: 10,
        alignItems: 'center',
    },
    viewBadgeText: {
        fontSize: 10,
        color: COLORS.primary,
        fontWeight: '700',
    },
    typingIndicator: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    typingBubble: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 34 : 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 46,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    input: {
        flex: 1,
        color: '#1e293b',
        fontSize: 15,
        fontWeight: '500',
    },
    sendBtn: {
        padding: 8,
    },
});

export default Chatbot;
