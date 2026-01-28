import { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Header.css";
import logo_image from "../../Assets/Images/logo.svg";
import home_image from "../../Assets/Images/Icons/icon_home.svg";
import header_product_image from "../../Assets/Images/Products/icon_product.svg";
import service_image from "../../Assets/Images/Icons/icon_service.svg";
import promotion_image from "../../Assets/Images/Icons/icon_voucher.svg";
import retail_system_image from "../../Assets/Images/Icons/icon_shop.svg";
import cart_image from "../../Assets/Images/Icons/icon_cart.svg";
import account_image from "../../Assets/Images/Icons/icon_account.svg";
import { GlobalOutlined } from '@ant-design/icons';

import { useCart } from "../../Context/CartContext";

export default function Header() {
  const { t, changeLanguage, language } = useLanguage();
  const { cartItems } = useCart();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? "active-link" : "";
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);



  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <header className="header">
      <div className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className="logo">
        <img
          className="brand_image"
          loading="lazy"
          decoding="async"
          src={logo_image}
          alt="icon"
        />
      </div>
      <ul className={`nav_list ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <li className="nav_item">
          <NavLink to="/home" className={getNavLinkClass} onClick={closeMobileMenu}>
            <img
              className="icon_nav_item"
              loading="lazy"
              decoding="async"
              src={home_image}
              alt="icon"
            />
            {t('home')}
          </NavLink>
        </li>

        <li className="nav_item">
          <NavLink to="/product" className={getNavLinkClass} onClick={closeMobileMenu}>
            <img
              className="icon_nav_item header_product_image"
              loading="lazy"
              decoding="async"
              src={header_product_image}
              alt="product"
            />
            {t('product')}
          </NavLink>
        </li>

        <li className="nav_item">
          <NavLink to="/service" className={getNavLinkClass} onClick={closeMobileMenu}>
            <img
              className="icon_nav_item"
              loading="lazy"
              decoding="async"
              src={service_image}
              alt="icon"
            />
            {t('service')}
          </NavLink>
        </li>

        <li className="nav_item">
          <NavLink to="/promotion" className={getNavLinkClass} onClick={closeMobileMenu}>
            <img
              className="icon_nav_item"
              loading="lazy"
              decoding="async"
              src={promotion_image}
              alt="icon"
            />
            {t('promotion')}
          </NavLink>
        </li>

        <li className="nav_item">
          <NavLink to="/retail-system" className={getNavLinkClass} onClick={closeMobileMenu}>
            <img
              className="icon_nav_item"
              loading="lazy"
              decoding="async"
              src={retail_system_image}
              alt="icon"
            />
            {t('retail_system')}
          </NavLink>
        </li>
      </ul>
      <ul className="nav_list2">
        <li className="nav_item2">
          <NavLink className={({ isActive }) => isLanding ? "nav_item2_link" : (isActive ? "nav_item2_link active-link-right" : "nav_item2_link")} to="/cart">
            <div style={{ position: 'relative' }}>
              <img
                className="icon_nav_item2"
                loading="lazy"
                decoding="async"
                src={cart_image}
                alt="icon"
              />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span className="nav_item2_text">{t('cart')}</span>
          </NavLink>
        </li>

        <li className="nav_item2">
          <NavLink className={({ isActive }) => isLanding ? "nav_item2_link" : (isActive ? "nav_item2_link active-link-right" : "nav_item2_link")} to="/account">
            <img
              className="icon_nav_item2"
              loading="lazy"
              decoding="async"
              src={account_image}
              alt="icon"
            />
            <span className="nav_item2_text">{isLanding ? t('not_logged_in') : t('account')}</span>
          </NavLink>
        </li>
        <li className="nav_item2">
          <button className="nav_lang_toggle" onClick={() => changeLanguage(language === 'vi' ? 'en' : 'vi')}>
            <GlobalOutlined />
            <span>{language === 'vi' ? 'VI' : 'EN'}</span>
          </button>
        </li>
      </ul>
    </header>
  );
}
