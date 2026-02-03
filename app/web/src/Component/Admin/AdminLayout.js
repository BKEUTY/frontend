import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    TeamOutlined,
    HeartOutlined,
    ShoppingOutlined,
    FileTextOutlined,
    CalendarOutlined,
    BarChartOutlined,
    LogoutOutlined,
    GlobalOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import './Admin.css';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { t, language, changeLanguage } = useLanguage();

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setCollapsed(mobile);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        if (isMobile) {
            setCollapsed(true);
        }
    }, [location.pathname, isMobile]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: t('home_page', 'Trang chủ'),
            onClick: () => {
                navigate('/');
                window.location.reload();
            },
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: t('logout', 'Đăng xuất'),
            onClick: handleLogout,
            danger: true,
        },
    ];

    const items = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: t('dashboard', 'Tổng quan'),
        },
        {
            key: '/admin/orders',
            icon: <FileTextOutlined />,
            label: t('orders', 'Đơn hàng'),
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: t('products', 'Sản phẩm'),
        },
        {
            key: '/admin/services',
            icon: <HeartOutlined />,
            label: t('services', 'Dịch vụ'),
        },
        {
            key: '/admin/appointments',
            icon: <CalendarOutlined />,
            label: t('appointments', 'Lịch hẹn'),
        },
        {
            key: '/admin/staff',
            icon: <TeamOutlined />,
            label: t('staff', 'Nhân viên'),
        },
        {
            key: '/admin/reports',
            icon: <BarChartOutlined />,
            label: t('reports', 'Báo cáo'),
        },
    ];

    return (
        <Layout className="admin-layout-container">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
                className="admin-sider"
                theme="light"
                breakpoint="md"
                collapsedWidth={isMobile ? 0 : 80}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: isMobile ? 1050 : 1000,
                }}
            >
                <div className={`admin-logo-container ${collapsed ? 'collapsed' : ''}`}>
                    {collapsed && !isMobile ? (
                        <img
                            src={require('../../Assets/Images/logo.svg').default}
                            alt="B"
                            className="admin-logo-collapsed"
                        />
                    ) : (
                        <img
                            src={require('../../Assets/Images/logo.svg').default}
                            alt="BKEUTY"
                            className="admin-logo-img"
                        />
                    )}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={items}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>

            {isMobile && !collapsed && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setCollapsed(true)}
                />
            )}

            <Layout className={`site-layout ${collapsed ? 'site-layout-collapsed' : 'site-layout-expanded'}`}>
                <Header className="admin-header">
                    <div className="admin-header-left">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="trigger-btn"
                        />
                    </div>

                    <div className="admin-header-right">
                        <Button
                            type="text"
                            icon={<GlobalOutlined />}
                            onClick={() => changeLanguage(language === 'vi' ? 'en' : 'vi')}
                            className="lang-btn"
                        >
                            {language === 'vi' ? 'VI' : 'EN'}
                        </Button>

                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                            overlayClassName="admin-user-dropdown"
                        >
                            <div className="admin-user-profile">
                                <Avatar
                                    size={28}
                                    style={{
                                        backgroundColor: '#c2185b',
                                        verticalAlign: 'middle',
                                        fontSize: '14px'
                                    }}
                                >
                                    {user?.name?.[0]?.toUpperCase() || 'A'}
                                </Avatar>
                                <span className="admin-username">{user?.name || 'Admin'}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
