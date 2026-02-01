import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { NotificationProvider } from "./Context/NotificationContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import Home from "./Home/Home";
import Product from "./Product/Product";
import ProductDetail from "./Product/ProductDetail";
import Service from "./Component/Service/Service";

import Promotion from "./Promotion/Promotion";
import Cart from "./Cart/Cart";
import Account from "./Component/Account/Account";
import Checkout from "./Checkout/Checkout";

import Header from "./Component/Header/Header";
import Footer from "./Component/Footer/Footer";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./Component/Auth/Login";
import Register from "./Component/Auth/Register";
import ForgotPassword from "./Component/Auth/ForgotPassword";
import { AboutUs, Contact, FAQ, RetailSystem, Terms } from "./Component/StaticPages/FooterPages";
import NotFound from "./Component/ErrorPages/NotFound";
import ServerError from "./Component/ErrorPages/ServerError";

import { CartProvider } from "./Context/CartContext";
import CartDrawer from "./Cart/CartDrawer";
import { AuthProvider } from "./Context/AuthContext";
import AdminRoute from "./Component/Auth/AdminRoute";
import AdminLayout from "./Component/Admin/AdminLayout";
import Dashboard from "./Component/Admin/Dashboard/Dashboard";
import ProductList from "./Component/Admin/Products/ProductList";
import ProductCreate from "./Component/Admin/Products/ProductCreate";
import Placeholder from "./Component/Admin/Placeholder";

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/service" element={<Service />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account/*" element={<Account />} />

          <Route path="/checkout" element={<Checkout />} />


          <Route path="/about-brand" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/retail-system" element={<RetailSystem />} />

          <Route path="/terms" element={<Terms />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="users" element={<Placeholder title="Users" />} />
            <Route path="orders" element={<Placeholder title="Orders" />} />
          </Route>

          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
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
