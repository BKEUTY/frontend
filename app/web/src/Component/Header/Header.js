import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { useCart } from "../../Context/CartContext";
import { Layout, Menu, Drawer, Badge, Button, Dropdown, Avatar, Row, Col, Space } from 'antd';
import {
  MenuOutlined,
  GlobalOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  GiftOutlined,
  ShopOutlined,
  HeartOutlined
} from '@ant-design/icons';
import logo_image from "../../Assets/Images/logo.svg";
import "./Header.css";

const { Header: AntHeader } = Layout;

export default function Header() {
  const { t, changeLanguage, language } = useLanguage();
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const menuItems = [
    { key: '/home', icon: <HomeOutlined />, label: t('home') },
    { key: '/product', icon: <AppstoreOutlined />, label: t('product') },
    { key: '/service', icon: <HeartOutlined />, label: t('service') },
    { key: '/promotion', icon: <GiftOutlined />, label: t('promotion') },
    { key: '/retail-system', icon: <ShopOutlined />, label: t('retail_system') },
  ];

  const toggleLanguage = () => {
    changeLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileMenuOpen(false);
  };

  return (
    <AntHeader className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section" onClick={() => navigate('/')}>
          <img src={logo_image} alt="BKEUTY" className="header-logo" />
        </div>

        <div className="desktop-menu">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            items={menuItems}
            className="main-menu"
          />
        </div>

        <div className="header-actions">
          <Badge count={cartCount} showZero={false} size="small" offset={[-10, 5]} className="mobile-cart-badge">
            <div className="action-btn-custom" onClick={() => navigate('/cart')}>
              <ShoppingCartOutlined className="action-icon" />
              <span className="action-label">{t('cart')}</span>
            </div>
          </Badge>

          <div className="desktop-actions">
            <div className="action-btn-custom" onClick={() => navigate('/account')}>
              <UserOutlined className="action-icon" />
              <span className="action-label">{t('not_logged_in')}</span>
            </div>

            <div className="action-btn-custom" onClick={toggleLanguage}>
              <GlobalOutlined className="action-icon" />
              <span className="action-label">{language === 'vi' ? 'VN' : 'EN'}</span>
            </div>
          </div>

          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '24px', color: '#333' }} />}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </div>

      <Drawer
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="mobile-drawer"
        closeIcon={<MenuOutlined style={{ fontSize: '20px' }} />}
        extra={
          <div className="drawer-logo-wrapper">
            <img src={logo_image} alt="BKEUTY" className="drawer-logo" />
          </div>
        }
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ border: 'none' }}
        />

        <div className="mobile-drawer-footer">
          <Button
            block
            icon={<UserOutlined />}
            onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}
          >
            {t('account')}
          </Button>

          <Button
            block
            icon={<GlobalOutlined />}
            onClick={toggleLanguage}
          >
            {language === 'vi' ? 'Tiếng Việt' : 'English'}
          </Button>
        </div>
      </Drawer>
    </AntHeader>
  );
}

