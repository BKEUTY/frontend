import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { NotificationProvider } from "./Context/NotificationContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import Header from "./Component/Header/Header";
import Footer from "./Component/Footer/Footer";
import CartDrawer from "./Cart/CartDrawer";
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/AuthContext";
import AdminRoute from "./Component/Auth/AdminRoute";
import AdminLayout from "./Component/Admin/AdminLayout";

import { authRoutes, errorRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";
import { adminRoutes } from "./routes/adminRoutes";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const isAuth = path === "/login" || path === "/register" || path === "/forgot-password";
  const isAdmin = path.startsWith("/admin");

  const showHeader = !isAuth && !isAdmin;
  const showFooter = !isAuth && !isAdmin;

  return (
    <div className="App">
      {showHeader && <Header />}
      <main className={isAdmin ? "" : "main_content"}>
        <Routes>
          {authRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} index={route.index} />
          ))}

          {userRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            {adminRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} index={route.index} />
            ))}
          </Route>

          {errorRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
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
        <CartProvider>
          <Router>
            <AuthProvider>
              <Layout />
            </AuthProvider>
          </Router>
        </CartProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
