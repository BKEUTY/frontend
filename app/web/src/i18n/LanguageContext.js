import React, { createContext, useState, useContext } from 'react';
import { en, vi } from './resources';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('vi'); // Default to Vietnamese

    const t = (key) => {
        const dict = language === 'vi' ? vi : en;
        return dict[key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
