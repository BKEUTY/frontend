import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

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

const LocalizedApp = () => {
  const { language } = useLanguage();
  
  const locale = language === 'vi' ? viVN : enUS;
  
  React.useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  return (
    <ConfigProvider 
      locale={locale}
      theme={{ 
        cssVar: true, 
        hashed: false,
        token: {
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }
      }}
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
