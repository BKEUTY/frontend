import React from 'react';
import { Row, Col, Table, Tag } from 'antd';
import { useLanguage } from '../../../i18n/LanguageContext';
import {
    DollarOutlined,
    ShoppingOutlined,
    CalendarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const { t } = useLanguage();

    const stats = [
        {
            title: t('admin_dashboard_sales', 'Doanh thu hôm nay'),
            value: '40,689,000 đ',
            icon: <DollarOutlined />,
            trend: 8.5,
            iconClass: 'icon-pink',
            trendType: 'up'
        },
        {
            title: t('admin_dashboard_orders', 'Tổng đơn hàng'),
            value: '1,250',
            icon: <ShoppingOutlined />,
            trend: 5.2,
            iconClass: 'icon-blue',
            trendType: 'up'
        },
        {
            title: t('admin_dashboard_appointments', 'Lịch hẹn'),
            value: '600',
            icon: <CalendarOutlined />,
            trend: 12,
            iconClass: 'icon-green',
            trendType: 'up'
        }
    ];

    const data = [
        { name: t('mon', 'Th 2'), value: 15 },
        { name: t('tue', 'Th 3'), value: 22 },
        { name: t('wed', 'Th 4'), value: 10 },
        { name: t('thu', 'Th 5'), value: 25 },
        { name: t('fri', 'Th 6'), value: 18 },
        { name: t('sat', 'Th 7'), value: 30 },
        { name: t('sun', 'CN'), value: 28 },
    ];

    const columns = [
        {
            title: t('admin_product_name', 'Tên sản phẩm'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
        },
        {
            title: t('admin_product_category', 'Danh mục'),
            dataIndex: 'category',
            key: 'category',
            render: (tag) => (
                <Tag color="magenta" style={{ borderRadius: '8px', border: 'none', background: '#fce7f3', color: '#be185d', fontWeight: 600 }}>
                    {tag.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: t('admin_product_price', 'Giá'),
            dataIndex: 'price',
            key: 'price',
            render: (price) => <span style={{ color: '#1f2937' }}>{price}</span>,
        },
        {
            title: t('admin_product_sold', 'Đã bán'),
            dataIndex: 'sold',
            key: 'sold',
            align: 'right',
            render: (sold) => <span style={{ fontWeight: 700, color: '#ec4899' }}>{sold}</span>,
        },
    ];

    const products = [
        { key: '1', name: 'Anti-Aging Cream', category: 'Skincare', price: '1,200,000 đ', sold: 342 },
        { key: '2', name: 'Matte Lipstick', category: 'Makeup', price: '450,000 đ', sold: 215 },
        { key: '3', name: 'Vitamin C Serum', category: 'Skincare', price: '890,000 đ', sold: 189 },
        { key: '4', name: 'Rose Water Toner', category: 'Toner', price: '320,000 đ', sold: 156 },
    ];

    return (
        <div className="dashboard-content">
            <div className="dashboard-header admin-page-header">
                <h2 className="dashboard-title">{t('dashboard', 'Tổng quan')}</h2>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <div className="beauty-card chart-card">
                        <div className="chart-header">
                            <span className="chart-title">{t('revenue_overview', 'Biểu đồ doanh thu')}</span>
                        </div>
                        <div className="chart-container" style={{ marginLeft: -20 }}>
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c2185b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#c2185b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#c2185b"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <div className="stat-cards-container">
                        {stats.map((stat, index) => (
                            <div key={index} className="beauty-card stat-card">
                                <div className="stat-card-content">
                                    <div className="stat-card-left">
                                        <div className={`card-icon-wrapper ${stat.iconClass}`}>
                                            {stat.icon}
                                        </div>
                                        <div className="card-stat-label">{stat.title}</div>
                                        <div className="card-stat-value">{stat.value}</div>
                                    </div>
                                    <div className={`trend-pill ${stat.trendType === 'up' ? 'trend-up' : 'trend-down'}`}>
                                        {stat.trendType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                        {Math.abs(stat.trend)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>

            <div className="table-card beauty-table">
                <div className="chart-header">
                    <span className="chart-title">{t('admin_top_products', 'Sản phẩm bán chạy')}</span>
                </div>
                <Table
                    columns={columns}
                    dataSource={products}
                    pagination={false}
                    className="admin-modern-table"
                />
            </div>
        </div>
    );
};

export default Dashboard;
