import React, { createContext, useState, useContext } from 'react';
import { enMobile, viMobile } from './resources';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('vi');

    const t = (key) => {
        const dict = language === 'vi' ? viMobile : enMobile;
        return dict[key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
