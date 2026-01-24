import React, { createContext, useState, useContext } from 'react';
import { en, vi } from './resources';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('vi');

    const t = (key) => {
        const dict = language === 'vi' ? vi : en;
        return dict[key] || key;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
