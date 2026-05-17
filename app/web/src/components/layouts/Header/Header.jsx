import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/store/LanguageContext";
import { useCart } from "@/store/CartContext";
import { useAuth } from "@/store/AuthContext";
import { Layout, Menu, Drawer, Badge, Button, Dropdown, Avatar, Row, Col, Space } from 'antd';
import {
  MenuOutlined,
  GlobalOutlined,
  ShoppingOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  GiftOutlined,
  ShopOutlined,
  HeartOutlined,
  LogoutOutlined,
  DownOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Modal } from 'antd';
import logo_image from "@/assets/images/logo.svg";
import "./Header.css";

const { Header: AntHeader } = Layout;

export default function Header() {
  const { t, changeLanguage, language } = useLanguage();
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
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

  const handleLogout = () => {
    Modal.confirm({
      title: t('confirm_logout_title') || t('logout'),
      icon: <ExclamationCircleOutlined />,
      content: t('confirm_logout_message') || 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: t('yes'),
      okType: 'danger',
      cancelText: t('no'),
      onOk: async () => {
        try {
          if (logout) await logout();
          navigate('/');
          setMobileMenuOpen(false);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const userMenuItems = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: t('account'),
      onClick: () => navigate('/account')
    },
    {
      key: 'orders',
      icon: <HistoryOutlined />,
      label: t('my_orders') || 'Lịch sử giao dịch',
      onClick: () => navigate('/account/orders')
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('logout'),
      onClick: handleLogout,
      danger: true
    }
  ];

  return (
    <AntHeader className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section" onClick={() => navigate('/home')}>
          <img src={logo_image} alt="BKEUTY" className="header-logo" width="168" height="40" />
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
              <ShoppingOutlined className="action-icon" />
              <span className="action-label">{t('cart')}</span>
            </div>
          </Badge>

          <div className="desktop-actions">
            {isAuthenticated ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="header-user-dropdown-menu"
              >
                <div className="user-profile-trigger">
                  <Avatar 
                    size={32} 
                    className="user-avatar-custom"
                    style={{ backgroundColor: 'var(--color_main_title_light, #fde3cf)' }}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <span className="user-name-text">{user?.name || t('account')}</span>
                  <DownOutlined className="chevron-icon" />
                </div>
              </Dropdown>
            ) : (
              <div className="action-btn-custom" onClick={() => navigate('/login')}>
                <UserOutlined className="action-icon" />
                <span className="action-label">{t('not_logged_in')}</span>
              </div>
            )}

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
          <div className="drawer-logo-wrapper" onClick={() => { navigate('/home'); setMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>
            <img src={logo_image} alt="BKEUTY" className="drawer-logo" width="168" height="40" />
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
            onClick={() => { navigate(isAuthenticated ? '/account' : '/login'); setMobileMenuOpen(false); }}
          >
            {isAuthenticated ? (user?.name || t('account')) : t('login')}
          </Button>

          <Button
            block
            icon={<GlobalOutlined />}
            onClick={toggleLanguage}
          >
            {language === 'vi' ? 'Tiếng Việt' : 'English'}
          </Button>

          {isAuthenticated && (
            <Button
              block
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="drawer-logout-btn"
            >
              {t('logout') || 'Đăng xuất'}
            </Button>
          )}
        </div>
      </Drawer>
    </AntHeader>
  );
}
