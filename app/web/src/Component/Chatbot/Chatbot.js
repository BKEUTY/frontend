import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './Chatbot.css';
import { CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons';
import productPlaceholder from '../../Assets/Images/Products/product_placeholder.svg';

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
        setInputValue('');


        setTimeout(() => {
            let botResponses = [];


            if (inputValue.toLowerCase().includes('da khô') || inputValue.toLowerCase().includes('dưỡng ẩm') || inputValue.toLowerCase().includes('dry skin') || inputValue.toLowerCase().includes('moisturizer')) {
                botResponses.push({
                    id: Date.now() + 1,
                    type: 'text',
                    sender: 'bot',
                    content: t('chatbot_response_product')
                });
                botResponses.push({
                    id: Date.now() + 2,
                    type: 'product',
                    sender: 'bot',
                    content: {
                        name: t('chatbot_demo_product_name'),
                        price: '450.000 ₫',
                        image: productPlaceholder
                    }
                });
            } else {
                botResponses.push({
                    id: Date.now() + 1,
                    type: 'text',
                    sender: 'bot',
                    content: t('chatbot_response_consult')
                });
            }

            setMessages(prev => [...prev, ...botResponses]);
        }, 1000);
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
                                <RobotOutlined style={{ fontSize: '20px', color: '#c2185b' }} />
                            </div>
                        )}

                        <div className="message-content">
                            {msg.type === 'text' && (
                                <div className="message-text">
                                    {msg.content}
                                </div>
                            )}

                            {msg.type === 'product' && (
                                <div className="chat-product-card">
                                    <div className="chat-product-image">
                                        <img src={msg.content.image} alt={msg.content.name} />
                                    </div>
                                    <div className="chat-product-info">
                                        <h4>{msg.content.name}</h4>
                                        <span className="chat-product-price">{msg.content.price}</span>
                                        <button className="chat-product-btn">{t('view_now')}</button>
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
