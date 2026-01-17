// Header.js
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Header.css";
import logo_image from "../../Assets/Images/logo.svg";
import home_image from "../../Assets/Images/Icons/ic_baseline-home.svg";
import header_product_image from "../../Assets/Images/Products/ix_product.svg";
import service_image from "../../Assets/Images/Icons/ri_service-fill.svg";
import promotion_image from "../../Assets/Images/Icons/mdi_voucher.svg";
import retail_system_image from "../../Assets/Images/Icons/solar_shop-bold.svg";
import cart_image from "../../Assets/Images/Icons/flowbite_cart-outline.svg";
import account_image from "../../Assets/Images/Icons/mdi_account.svg";

export default function Header() {
  const { t, toggleLanguage, language } = useLanguage();

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? "active-link" : "";
  };

  return (
    <header className="header">
      <div className="logo">
        <img
          className="brand_image"
          loading="lazy"
          decoding="async"
          src={logo_image}
          alt="icon"
        />
      </div>
      <ul className="nav_list">
        <li className="nav_item">
          <NavLink to="/home" className={getNavLinkClass}>
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
          <NavLink to="/product" className={getNavLinkClass}>
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
          <NavLink to="/service" className={getNavLinkClass}>
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
          <NavLink to="/promotion" className={getNavLinkClass}>
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
          <NavLink to="/retail-system" className={getNavLinkClass}>
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
          <img
            className="icon_nav_item2"
            loading="lazy"
            decoding="async"
            src={cart_image}
            alt="icon"
          />
          <Link className="nav_item2_text" to="/cart">
            <h4>{t('cart')}</h4>
          </Link>
        </li>

        <li className="nav_item2">
          <img
            className="icon_nav_item2"
            loading="lazy"
            decoding="async"
            src={account_image}
            alt="icon"
          />
          <Link className="nav_item2_text" to="/account">
            <h4>{t('account')}</h4>
          </Link>
        </li>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <button className="nav_lang_toggle" onClick={toggleLanguage}>
            {language === 'vi' ? 'EN' : 'VI'}
          </button>
        </li>
      </ul>
    </header>
  );
}
