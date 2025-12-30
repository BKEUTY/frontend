import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./Context/NotificationContext";
// import Home from "./Home/Home";
import Product from "./Product/Product";
// import Service from "./Service/Service";
// import Promotion from "./Promotion/Promotion";
// import RetailSystem from "./RettailSystem/RetailSystem";
import Cart from "./Cart/Cart";
import Account from "./Component/Account/Account";
import Checkout from "./Checkout/Checkout";

import Header from "./Component/Header/Header";
import Footer from "./Component/Footer/Footer";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Header />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/product" element={<Product />} />
          {/* <Route path="/service" element={<Service />} /> */}
          {/* <Route path="/promotion" element={<Promotion />} /> */}
          {/* <Route path="/retail-system" element={<RetailSystem />} /> */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/account/*" element={<Account />} />

          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </Router>
    </NotificationProvider>
  );
}

export default App;
