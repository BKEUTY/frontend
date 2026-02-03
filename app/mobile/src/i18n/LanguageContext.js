import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import locales from './locales';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('vi');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLang = await AsyncStorage.getItem('language');
            if (savedLang && locales[savedLang]) {
                setLanguage(savedLang);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const t = (key, fallback) => {
        const dict = locales[language] || locales['vi'];
        return dict[key] || fallback || key;
    };

    const changeLanguage = async (lang) => {
        if (locales[lang]) {
            setLanguage(lang);
            try {
                await AsyncStorage.setItem('language', lang);
            } catch (error) {
                console.error('Error saving language:', error);
            }
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
