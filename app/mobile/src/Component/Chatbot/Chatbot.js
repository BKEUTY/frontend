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
    Dimensions
} from 'react-native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Chatbot = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    type: 'text',
                    sender: 'bot',
                    content: t('chatbot_greeting') || 'Chào bạn, mình có thể giúp gì cho bạn?'
                }
            ]);
        }
    }, [isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            type: 'text',
            sender: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue;
        setInputValue('');

        setTimeout(() => {
            const lowInput = currentInput.toLowerCase();
            const hasProduct = lowInput.includes('da khô') || lowInput.includes('dưỡng ẩm') || lowInput.includes('dry skin') || lowInput.includes('moisturizer');

            const textResponse = hasProduct
                ? (t('chatbot_response_product') || 'Tuyệt vời! Dưới đây là 1 vài gợi ý kem dưỡng ẩm phù hợp cho da khô mà BKEUTY đề xuất cho bạn:')
                : (t('chatbot_response_consult') || 'Cảm ơn bạn đã nhắn tin. Nhân viên tư vấn sẽ sớm liên hệ lại với bạn!');

            const botMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, {
                id: botMsgId,
                type: 'text',
                sender: 'bot',
                content: ''
            }]);

            let i = 0;
            const interval = setInterval(() => {
                i++;
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId
                        ? { ...msg, content: textResponse.slice(0, i) }
                        : msg
                ));
                flatListRef.current?.scrollToEnd({ animated: true });

                if (i >= textResponse.length) {
                    clearInterval(interval);
                    if (hasProduct) {
                        setTimeout(() => {
                            setMessages(prev => [...prev, {
                                id: (Date.now() + 2).toString(),
                                type: 'product',
                                sender: 'bot',
                                content: {
                                    name: 'BKEUTY Hydra-Deep Moisturizing Cream',
                                    price: '450.000 ₫',
                                    image: null
                                }
                            }]);
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }, 400);
                    }
                }
            }, 25); // 25ms typing effect
        }, 500);
    };

    const renderMessage = ({ item }) => {
        const isBot = item.sender === 'bot';

        if (item.type === 'product') {
            return (
                <View style={[styles.messageContainer, styles.botMessageContainer]}>
                    <View style={styles.botAvatar}>
                        <Ionicons name="robot-outline" size={20} color={COLORS.mainTitle} />
                    </View>
                    <View style={styles.productCard}>
                        <View style={styles.productImagePlaceholder} />
                        <Text style={styles.productName} numberOfLines={2}>{item.content.name}</Text>
                        <Text style={styles.productPrice}>{item.content.price}</Text>
                        <TouchableOpacity style={styles.viewButton}>
                            <Text style={styles.viewButtonText}>{t('view_now') || 'Xem ngay'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={[
                styles.messageContainer,
                isBot ? styles.botMessageContainer : styles.userMessageContainer
            ]}>
                {isBot && (
                    <View style={styles.botAvatar}>
                        <Ionicons name="robot-outline" size={20} color={COLORS.mainTitle} />
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isBot ? styles.botBubble : styles.userBubble
                ]}>
                    {isBot ? (
                        <Markdown style={{ body: { color: '#333', fontSize: 15, lineHeight: 20 } }}>
                            {item.content}
                        </Markdown>
                    ) : (
                        <Text style={[
                            styles.messageText,
                            styles.userText
                        ]}>{item.content}</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <>
            {!isOpen && (
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => setIsOpen(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chatbubbles-outline" size={24} color="#fff" style={styles.chatIcon} />
                    <Text style={styles.chatBtnText}>{t('chat') || 'Trò Chuyện'}</Text>
                </TouchableOpacity>
            )}

            <Modal
                visible={isOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <View style={styles.chatWindow}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>{t('chatbot_title') || 'Trợ lý ảo BKEUTY'}</Text>
                            <TouchableOpacity onPress={() => setIsOpen(false)} hitSlop={10}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={item => item.id}
                            renderItem={renderMessage}
                            contentContainerStyle={styles.messagesList}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        />

                        <View style={styles.footer}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('chatbot_input_placeholder') || 'Nhập tin nhắn...'}
                                    value={inputValue}
                                    onChangeText={setInputValue}
                                    onSubmitEditing={handleSend}
                                />
                                <TouchableOpacity
                                    style={[styles.sendButton, !inputValue.trim() && styles.sendButtonDisabled]}
                                    onPress={handleSend}
                                    disabled={!inputValue.trim()}
                                >
                                    <Ionicons name="send" size={20} color={COLORS.mainTitle} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    chatButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        backgroundColor: COLORS.mainTitle,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 9999,
    },
    chatIcon: {
        fontSize: 20,
        color: 'white',
        marginRight: 8,
    },
    chatBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    chatWindow: {
        height: '85%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: COLORS.mainTitle,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    messagesList: {
        padding: 15,
        paddingBottom: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        maxWidth: '85%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    botMessageContainer: {
        alignSelf: 'flex-start',
    },
    botAvatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
    },
    botBubble: {
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: COLORS.mainTitle,
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    botText: {
        color: '#333',
    },
    userText: {
        color: 'white',
    },
    productCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        width: 200,
        marginLeft: 45,
        marginTop: -10,
    },
    productImagePlaceholder: {
        width: '100%',
        height: 120,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 8,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 15,
        color: COLORS.mainTitle,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    viewButton: {
        backgroundColor: COLORS.mainTitle,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
    },
    viewButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    footer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f2f6',
        borderRadius: 25,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 50,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    sendButton: {
        padding: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

export default Chatbot;
