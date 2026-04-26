import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/store/LanguageContext';
import { useAuth } from '@/store/AuthContext';
import './Chatbot.css';
import { CloseOutlined, SendOutlined, MessageOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { ProductCard } from '@/components/common';
import { useChatHistory, useSendMessage } from '../hooks/useChatbot';

const Chatbot = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user?.id) {
            setSessionId(`user_${user.id}`);
        } else {
            let storedSessionId = localStorage.getItem('bkeuty_chat_session');
            if (!storedSessionId || storedSessionId.startsWith('user_')) {
                storedSessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('bkeuty_chat_session', storedSessionId);
            }
            setSessionId(storedSessionId);
        }
    }, [user]);

    const { data: historyData, isLoading: isHistoryLoading } = useChatHistory(sessionId, isOpen);
    const sendMessageMutation = useSendMessage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [historyData, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || sendMessageMutation.isPending) return;

        const messageContent = inputValue;
        setInputValue('');

        try {
            await sendMessageMutation.mutateAsync({
                sessionId: sessionId,
                message: messageContent,
                language: language
            });
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const messages = historyData ? historyData.map((msg, index) => ({
        id: msg.id || `${msg.sender}_${index}_${msg.timestamp}`,
        type: 'text',
        sender: msg.sender === 'user' ? 'user' : 'bot',
        content: msg.content,
        recommendedProduct: msg.recommendedProduct && msg.recommendedProduct.length > 0 ? msg.recommendedProduct[0] : null
    })) : [];

    const displayMessages = [
        {
            id: 'greeting',
            type: 'text',
            sender: 'bot',
            content: t('chatbot_greeting')
        },
        ...messages
    ];

    if (!isOpen) return null;

    return (
        <div className="chatbot-overlay">
            <div className="chatbot-header">
                <div className="chatbot-header-left">
                    <h3 className="chatbot-title">{t('chatbot_title')}</h3>
                    <span className="chatbot-status">
                        <span className="status-dot"></span>
                        {t('chatbot_online')}
                    </span>
                </div>
                <CloseOutlined className="chatbot-close" onClick={onClose} />
            </div>

            <div className="chatbot-body">
                {isHistoryLoading && messages.length === 0 ? (
                    <div className="message bot">
                        <div className="bot-avatar-group">
                            <div className="bot-avatar">
                                <RobotOutlined style={{ fontSize: '20px', color: 'var(--color_main_title)' }} />
                            </div>
                            <span className="bot-name">{t('chatbot_expert')}</span>
                        </div>
                        <div className="message-content">
                            <div className="message-text typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    displayMessages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            {msg.sender === 'bot' && (
                                <div className="bot-avatar-group">
                                    <div className="bot-avatar">
                                        <RobotOutlined style={{ fontSize: '20px', color: 'var(--color_main_title)' }} />
                                    </div>
                                    <span className="bot-name">{t('chatbot_expert')}</span>
                                </div>
                            )}

                            <div className="message-content">
                                <div className="message-text">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>

                                {msg.recommendedProduct && (
                                    <div className="chat-product-wrapper">
                                        <ProductCard 
                                            product={msg.recommendedProduct} 
                                            t={t} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {sendMessageMutation.isPending && (
                    <div className="message bot">
                        <div className="bot-avatar-group">
                            <div className="bot-avatar">
                                <RobotOutlined style={{ fontSize: '20px', color: 'var(--color_main_title)' }} />
                            </div>
                            <span className="bot-name">{t('chatbot_expert')}</span>
                        </div>
                        <div className="message-content">
                            <div className="message-text typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-footer">
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={t('chatbot_input_placeholder')}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={sendMessageMutation.isPending}
                    />
                    <button 
                        className="chat-send-btn" 
                        onClick={handleSend} 
                        disabled={!inputValue.trim() || sendMessageMutation.isPending}
                    >
                        <SendOutlined />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
