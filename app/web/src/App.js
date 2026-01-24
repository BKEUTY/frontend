import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import { AboutUs, Contact, FAQ, RetailSystem, BeautyCorner, Terms } from "./Component/StaticPages/FooterPages";

import { CartProvider } from "./Context/CartContext";
import CartDrawer from "./Cart/CartDrawer";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  // Determine if we should show Header/Footer
  // Auth Pages: No Header, No Footer (typically)
  const isAuth = path === "/login" || path === "/register" || path === "/forgot-password";

  const showHeader = !isAuth;
  const showFooter = !isAuth; // Landing has Footer

  return (
    <div className="App">
      {showHeader && <Header />}
      <main className="main_content">
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

          {/* Static Footer Pages */}
          <Route path="/about-brand" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/retail-system" element={<RetailSystem />} />
          <Route path="/beauty-corner" element={<BeautyCorner />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <CartProvider>
          <Router>
            <Layout />
            <CartDrawer />
          </Router>
        </CartProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
