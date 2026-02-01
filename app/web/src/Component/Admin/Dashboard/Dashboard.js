import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tag, Select, Dropdown, Menu, Button } from 'antd';
import { SyncOutlined, CalendarOutlined, DownOutlined, RiseOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/LanguageContext';
import adminApi from '../../../api/adminApi';

const { Option } = Select;

const Dashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats (Mock if API fails)
                const data = await adminApi.getStats();
                setStats(data);

                // Fetch products for "Hot Product" table
                // In real app, order by sales. Here just recent products
                const productRes = await adminApi.getAllProducts(0, 5);
                setRecentOrders(productRes.data.content || []);
            } catch (error) {
                console.error("Dashboard error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Mock Chart Data (Days of week)
    const chartData = [15, 18, 5, 17, 12, 18, 22]; // Heights out of ~30 scaled
    const labels = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];

    // Simple Bar Chart Component using CSS
    const MockBarChart = () => (
        <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px 0' }}>
            <div style={{ position: 'absolute', left: 20, top: 60, bottom: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#999', fontSize: '12px', height: '230px' }}>
                <span>25</span><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
            </div>
            {chartData.map((val, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%' }}>
                    <div style={{
                        height: `${val * 10}px`,
                        width: '12px',
                        background: '#001529', // Dark bar color
                        borderRadius: '2px',
                        transition: 'height 0.5s ease'
                    }}></div>
                    <span style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>{labels[idx]}</span>
                </div>
            ))}
        </div>
    );

    const columns = [
        {
            title: t('admin_product_name', 'Tên sản phẩm'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text.toUpperCase()}</b>
        },
        {
            title: t('price', 'Giá'),
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price ? price.toLocaleString() : 0}đ`
        },
        {
            title: t('status', 'Trạng thái'),
            key: 'status',
            render: () => (
                <Tag color="lime" style={{ color: '#333', fontWeight: 600 }}>{t('retail_status_open', 'Sẵn hàng')}</Tag>
            )
        },
        {
            title: t('revenue', 'Doanh thu'),
            key: 'revenue',
            render: (text, record) => `${(record.price * 10).toLocaleString()}đ` // Mock revenue
        },
    ];

    return (
        <div className="admin-animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 className="dashboard-title">{t('dashboard', 'Tổng quan')}</h2>
                <ButtonWithDropdown label={t('filter_by', 'Lọc theo')} />
            </div>

            <Row gutter={[24, 24]}>
                {/* Left: Revenue Chart */}
                <Col xs={24} lg={16}>
                    <Card className="chart-container-card" bordered={false} style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>{t('revenue', 'Doanh thu')}</h3>
                                <span style={{ color: '#999', fontSize: '13px' }}>{t('unit_million', 'Triệu đồng')}</span>
                            </div>
                            <Tag color="blue">{t('this_week', 'Tuần này')}</Tag>
                        </div>
                        <MockBarChart />
                    </Card>
                </Col>

                {/* Right: Summary Cards */}
                <Col xs={24} lg={8}>
                    {/* Revenue Card */}
                    <div className="admin-stat-card">
                        <div className="admin-stat-meta">
                            <span>{t('revenue_today', 'Doanh thu hôm nay')}</span>
                            <div className="admin-icon-wrapper" style={{ background: 'rgba(255, 159, 67, 0.1)', color: '#ff9f43' }}>
                                <SyncOutlined spin />
                            </div>
                        </div>
                        <div className="admin-stat-value">40,689,000 ₫</div>
                        <div style={{ color: '#2ecc71', fontWeight: 600, fontSize: '13px' }}>
                            <RiseOutlined /> 8.5% <span style={{ color: '#999', fontWeight: 400 }}>{t('vs_last_period', 'So với cùng kỳ')}</span>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="admin-stat-card">
                        <div className="admin-stat-meta">
                            <span>{t('total_orders', 'Số đơn hàng')}</span>
                            <div className="admin-icon-wrapper" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>
                                <ShoppingOutlined style={{ fontSize: '20px' }} />
                            </div>
                        </div>
                        <div className="admin-stat-value">1,250</div>
                        <div style={{ color: '#2ecc71', fontWeight: 600, fontSize: '13px' }}>
                            <RiseOutlined /> 5.2% <span style={{ color: '#999', fontWeight: 400 }}>{t('vs_last_period', 'So với cùng kỳ')}</span>
                        </div>
                    </div>

                    {/* Appointments Card */}
                    <div className="admin-stat-card">
                        <div className="admin-stat-meta">
                            <span>{t('appointments', 'Lịch hẹn')}</span>
                            <div className="admin-icon-wrapper" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' }}>
                                <CalendarOutlined />
                            </div>
                        </div>
                        <div className="admin-stat-value">600</div>
                        <div style={{ color: '#2ecc71', fontWeight: 600, fontSize: '13px' }}>
                            <RiseOutlined /> 12% <span style={{ color: '#999', fontWeight: 400 }}>{t('vs_last_period', 'So với cùng kỳ')}</span>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Bottom: Hot Products */}
            <div className="hot-product-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="admin-section-title">{t('hot_products', 'Sản phẩm bán chạy')}</h3>
                    <Button type="link">{t('view_all', 'Xem tất cả')}</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={recentOrders}
                    pagination={false}
                    rowKey="id"
                    className="custom-table"
                />
            </div>
        </div>
    );
};

const ButtonWithDropdown = ({ label }) => (
    <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', color: '#636e72', fontWeight: 500, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        {label} <DownOutlined style={{ fontSize: '12px', marginLeft: '5px' }} />
    </div>
);

export default Dashboard;
