import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { NotificationProvider } from "./Context/NotificationContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import Header from "./Component/Header/Header";
import Footer from "./Component/Footer/Footer";
import CartDrawer from "./pages/Cart/CartDrawer";
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/AuthContext";
import { authRoutes, errorRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";
import ErrorBoundary from "./Component/ErrorBoundary/ErrorBoundary";
import React, { Suspense } from 'react';
import Skeleton from "./Component/Common/Skeleton";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const isAuth = path === "/login" || path === "/register" || path === "/forgot-password";

  const showHeader = !isAuth;
  const showFooter = !isAuth;

  return (
    <div className="App">
      {showHeader && <Header />}

      <main className={isAuth ? "" : "main_content"}>
        <ErrorBoundary>
          <Suspense fallback={<div style={{ padding: '20px' }}><Skeleton width="100%" height="400px" /></div>}>
            <Routes>
              {authRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} index={route.index} />
              ))}

              {userRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}

              {errorRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {showFooter && <Footer />}
      {showHeader && <CartDrawer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <Router>
          <AuthProvider>
            <CartProvider>
              <Layout />
            </CartProvider>
          </AuthProvider>
        </Router>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
