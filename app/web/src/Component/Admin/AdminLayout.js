
import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
    TeamOutlined,
    HeartOutlined,
    DropboxOutlined,
    FileTextOutlined,
    CalendarOutlined,
    BarChartOutlined,
    LogoutOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import './Admin.css';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { t, language, changeLanguage } = useLanguage();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="home" icon={<AppstoreOutlined />} onClick={() => navigate('/')}>
                {t('home_page', 'Trang chủ')}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} danger>
                {t('logout', 'Đăng xuất')}
            </Menu.Item>
        </Menu>
    );

    const items = [
        {
            key: '/admin/dashboard',
            icon: <AppstoreOutlined />,
            label: t('dashboard', 'Tổng quan'),
        },
        {
            key: '/admin/orders',
            icon: <FileTextOutlined />,
            label: t('orders', 'Đơn hàng'),
        },
        {
            key: '/admin/products',
            icon: <DropboxOutlined />,
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

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }} className="admin-layout-container">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
                className="admin-sider"
                theme="light"
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    if (broken) setCollapsed(true);
                }}
            >
                <div className="admin-logo-container">
                    {collapsed ? (
                        <div className="admin-logo-text" style={{ fontSize: '20px' }}>B</div>
                    ) : (
                        <h1 className="admin-logo-text">BKEUTY</h1>
                    )}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={items}
                    onClick={handleMenuClick}
                    style={{ borderRight: 'none' }}
                />

                <div className="admin-logout-area">
                    <button className="logout-btn" onClick={handleLogout} title={t('logout')}>
                        <LogoutOutlined />
                        {!collapsed && <span style={{ marginLeft: '10px' }}>{t('logout', 'Đăng xuất')}</span>}
                    </button>
                </div>
            </Sider>

            <Layout style={{ background: 'transparent' }}>
                <Header className="admin-header">
                    <div className="admin-header-left">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 40, height: 40 }}
                        />
                    </div>

                    <div className="admin-header-right">
                        {/* Language Switch */}
                        <Button
                            type="text"
                            icon={<GlobalOutlined />}
                            onClick={() => changeLanguage(language === 'vi' ? 'en' : 'vi')}
                            style={{ fontWeight: 500 }}
                        >
                            {language === 'vi' ? 'VI' : 'EN'}
                        </Button>

                        {/* User Profile */}
                        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                            <div className="admin-user-profile">
                                <Avatar style={{ backgroundColor: 'var(--color_main_title)', verticalAlign: 'middle' }}>
                                    {user?.name?.[0]?.toUpperCase() || 'A'}
                                </Avatar>
                                <span className="admin-username">{user?.name || 'Admin'}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content
                    style={{
                        margin: '24px',
                        minHeight: 280,
                        background: 'transparent',
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
