import React from 'react';
import { Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import {
    ControlOutlined,
    ShoppingOutlined,
    FileTextOutlined,
    HeartOutlined,
    ScheduleOutlined,
    UsergroupAddOutlined,
    PieChartOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import './AdminHome.css';

const AdminHome = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const apps = [
        {
            key: 'dashboard',
            title: t('dashboard'),
            desc: t('admin_home_dashboard_desc'),
            icon: <ControlOutlined />,
            color: '#c2185b'
        },
        {
            key: 'orders',
            title: t('orders'),
            desc: t('admin_home_orders_desc'),
            icon: <FileTextOutlined />,
            color: '#1e88e5'
        },
        {
            key: 'products',
            title: t('products'),
            desc: t('admin_home_products_desc'),
            icon: <ShoppingOutlined />,
            color: '#43a047'
        },
        {
            key: 'services',
            title: t('services'),
            desc: t('admin_home_services_desc'),
            icon: <HeartOutlined />,
            color: '#f4511e'
        },
        {
            key: 'appointments',
            title: t('appointments'),
            desc: t('admin_home_appointments_desc'),
            icon: <ScheduleOutlined />,
            color: '#8e24aa'
        },
        {
            key: 'staff',
            title: t('staff'),
            desc: t('admin_home_staff_desc'),
            icon: <UsergroupAddOutlined />,
            color: '#3949ab'
        },
        {
            key: 'reports',
            title: t('reports'),
            desc: t('admin_home_reports_desc'),
            icon: <PieChartOutlined />,
            color: '#00897b'
        }
    ];

    return (
        <div className="admin-home-grid">
            <div className="admin-home-header">
                <h1>{t('admin_home_welcome')}</h1>
                <p>{t('admin_home_subtitle')}</p>
            </div>

            <Row gutter={[32, 32]}>
                {apps.map((app) => (
                    <Col xs={24} sm={12} md={8} xl={6} key={app.key}>
                        <div className="app-card" onClick={() => navigate(`/admin/${app.key}`)}>
                            <div className="app-icon-wrapper" style={{ backgroundColor: `${app.color}15`, color: app.color }}>
                                {app.icon}
                            </div>
                            <div className="app-info">
                                <h3>{app.title}</h3>
                                <p>{app.desc}</p>
                            </div>
                            <div className="app-arrow">
                                <ArrowRightOutlined />
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminHome;
