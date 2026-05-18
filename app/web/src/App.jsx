import React, { useState, useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';

import { NotificationProvider } from "./store/NotificationContext";
import { LanguageProvider, useLanguage } from "./store/LanguageContext";
import { CartProvider } from "./store/CartContext";
import { AuthProvider } from "./store/AuthContext";
import router from "./routes/router";

import "./App.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/common/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Cache for loaded locales to avoid re-importing
const localeCache = {};

const LocalizedApp = () => {
  const { language } = useLanguage();
  const [antdLocale, setAntdLocale] = useState(null);
  
  useEffect(() => {
    // Dynamically import locale to reduce initial JS payload
    const loadLocale = async () => {
      if (localeCache[language]) {
        setAntdLocale(localeCache[language]);
      } else {
        const localeModule = language === 'vi'
          ? await import('antd/es/locale/vi_VN')
          : await import('antd/es/locale/en_US');
        localeCache[language] = localeModule.default;
        setAntdLocale(localeModule.default);
      }
      // Lazy load dayjs locale only when needed
      if (language === 'vi') {
        await import('dayjs/locale/vi');
      }
      dayjs.locale(language);
    };
    loadLocale();
  }, [language]);

  const theme = useMemo(() => ({ 
    cssVar: true, 
    hashed: false,
    token: {
      fontFamily: "'Be Vietnam Pro', sans-serif",
    }
  }), []);

  return (
    <ConfigProvider 
      locale={antdLocale}
      theme={theme}
    >
      <ErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <LocalizedApp />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
