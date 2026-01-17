import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { NotificationProvider } from "./Context/NotificationContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import Home from "./Home/Home";
import Product from "./Product/Product";
// import Service from "./Service/Service";
// import Promotion from "./Promotion/Promotion";
// import RetailSystem from "./RettailSystem/RetailSystem";
import Cart from "./Cart/Cart";
import Account from "./Component/Account/Account";
import Checkout from "./Checkout/Checkout";

import Header from "./Component/Header/Header";
import Footer from "./Component/Footer/Footer";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./Component/Auth/Login";
import Register from "./Component/Auth/Register";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  // Determine if we should show Header/Footer
  // Landing Page: No Header, Yes Footer (per request "chỉ có ảnh và footer")
  // Auth Pages: No Header, No Footer (typically)
  const isLanding = path === "/";
  const isAuth = path === "/login" || path === "/register";

  const showHeader = !isLanding && !isAuth;
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

          <Route path="/product" element={<Product />} />
          {/* <Route path="/service" element={<Service />} /> */}
          {/* <Route path="/promotion" element={<Promotion />} /> */}
          {/* <Route path="/retail-system" element={<RetailSystem />} /> */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/account/*" element={<Account />} />

          <Route path="/checkout" element={<Checkout />} />
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
        <Router>
          <Layout />
        </Router>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
