import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/store/LanguageContext';
import './Chatbot.css';
import { CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { CButton } from '@/components/common';

const PLACEHOLDER_IMAGE = 'https://placehold.co/150x150?text=BKEUTY';

const Chatbot = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    type: 'text',
                    sender: 'bot',
                    content: t('chatbot_greeting')
                }
            ]);
        }
    }, [t, messages.length]);
    
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
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
                ? t('chatbot_response_product')
                : t('chatbot_response_consult');

            const botMsgId = Date.now() + 1;
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
                scrollToBottom();

                if (i >= textResponse.length) {
                    clearInterval(interval);
                    if (hasProduct) {
                        setTimeout(() => {
                            setMessages(prev => [...prev, {
                                id: Date.now() + 2,
                                type: 'product',
                                sender: 'bot',
                                content: {
                                    name: t('chatbot_demo_product_name'),
                                    price: '450.000 đ',
                                    image: PLACEHOLDER_IMAGE
                                }
                            }]);
                            scrollToBottom();
                        }, 400);
                    }
                }
            }, 20);
        }, 500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-overlay">
            <div className="chatbot-header">
                <h3 className="chatbot-title">{t('chatbot_title')}</h3>
                <CloseOutlined className="chatbot-close" onClick={onClose} />
            </div>

            <div className="chatbot-body">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.sender === 'bot' && (
                            <div className="bot-avatar">
                                <RobotOutlined style={{ fontSize: '20px', color: 'var(--color_main_title)' }} />
                            </div>
                        )}

                        <div className="message-content">
                            {msg.type === 'text' && (
                                <div className="message-text">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            )}

                            {msg.type === 'product' && (
                                <div className="chat-product-card">
                                    <div className="chat-product-image">
                                        <img src={msg.content.image} alt={msg.content.name} onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }} />
                                    </div>
                                    <div className="chat-product-info">
                                        <h4>{msg.content.name}</h4>
                                        <span className="chat-product-price">{msg.content.price}</span>
                                        <CButton type="primary" size="small" block className="chat-product-btn">
                                            {t('view_now')}
                                        </CButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
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
                    />
                    <button className="chat-send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
                        <SendOutlined />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
