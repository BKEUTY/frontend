import React, { createContext, useState, useContext, useEffect } from 'react';
import locales from '@/assets/locales';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('language');
        return (savedLang && locales[savedLang]) ? savedLang : 'vi';
    });

    const t = (key, fallback) => {
        const dict = locales[language] || locales['vi'];
        return dict[key] || fallback || key;
    };

    const changeLanguage = (lang) => {
        if (locales[lang]) {
            setLanguage(lang);
            localStorage.setItem('language', lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
