import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from "antd"; 

import { NotificationProvider } from "./store/NotificationContext";
import { LanguageProvider } from "./store/LanguageContext";
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

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={{ cssVar: true, hashed: false }}>
          <LanguageProvider>
            <NotificationProvider>
              <AuthProvider>
                <CartProvider>
                  <RouterProvider router={router} />
                </CartProvider>
              </AuthProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}


export default App;
