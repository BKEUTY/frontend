import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from "antd"; 

import { NotificationProvider } from "./store/NotificationContext";
import { LanguageProvider } from "./store/LanguageContext";
import { CartProvider } from "./store/CartContext";
import { AuthProvider } from "./store/AuthContext";
import router from "./routes/router";

import "./App.css";

function App() {
  return (
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
  );
}

export default App;
