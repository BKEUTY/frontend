import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SearchOutlined } from '@ant-design/icons';
import { PageWrapper } from '../../Component/Common';
import { Table, Tag, Button, Typography, Tooltip, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../../Component/Common/List.css';
import './AppointmentList.css';

const { Text } = Typography;

const AppointmentList = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]);

    const allAppointments = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        serviceKey: i % 3 === 0 ? 'hair_cut_styling' : i % 3 === 1 ? 'deep_skin_care' : 'nourishing_shampoo',
        branch: i % 2 === 0 ? 'Da Nang Branch' : 'Ho Chi Minh City',
        schedule: `10/10/2023 - ${10 + (i % 8)}:00`,
        price: (i + 1) * 500000 + 100000,
        staff: `NV0${(i % 5) + 1}`,
        statusKey: i % 4 === 0 ? 'completed_status' : 'upcoming_status'
    }));

    const filteredAppointments = allAppointments.filter(item =>
        t(item.serviceKey).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
            render: (id) => <span className="admin-table-id">#{id}</span>,
        },
        {
            title: t('service_col'),
            key: 'service',
            width: 250,
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ color: '#0f172a' }}>{t(record.serviceKey)}</Text>
                    <Text type="secondary" style={{ fontSize: '13px', color: record.statusKey === 'completed_status' ? '#10b981' : '#f59e0b' }}>
                        {t(record.statusKey)}
                    </Text>
                </div>
            ),
        },
        {
            title: t('branch_col'),
            dataIndex: 'branch',
            key: 'branch',
            width: 180,
            render: (text) => <Text>{text}</Text>,
        },
        {
            title: t('time_col'),
            dataIndex: 'schedule',
            key: 'schedule',
            width: 150,
            render: (schedule) => {
                const parts = schedule.split(' - ');
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ color: 'var(--color_main_title)' }}>{parts[1]}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{parts[0]}</Text>
                    </div>
                );
            },
        },
        {
            title: t('staff_col'),
            dataIndex: 'staff',
            key: 'staff',
            width: 120,
            render: (staff) => (
                <Tag color="blue" style={{ borderRadius: '12px', margin: 0 }}>
                    {staff}
                </Tag>
            ),
        },
        {
            title: t('price'),
            dataIndex: 'price',
            key: 'price',
            width: 130,
            render: (price) => <Text strong style={{ color: '#111827' }}>{price.toLocaleString()}đ</Text>,
        },
        {
            title: t('actions_col'),
            key: 'actions',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: () => (
                <Space size="small">
                    <Tooltip title={t('edit_tooltip') || 'Edit'}>
                        <Button type="text" className="admin-action-btn edit-btn" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title={t('cancel_tooltip') || 'Cancel'}>
                        <Button type="text" className="admin-action-btn delete-btn" icon={<DeleteOutlined />} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <PageWrapper
            title={t('appointment_list')}
            subtitle={t('manage_appointments_desc')}
            noCard
            extra={
                <div className="search-box">
                    <input
                        type="text"
                        placeholder={t('search_appointment_placeholder')}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                        className="search-input"
                    />
                    <SearchOutlined className="btn-search-icon" />
                </div>
            }
        >
            <div className="admin-list-container" style={{ padding: '0', backgroundColor: 'transparent' }}>
                <div className="admin-table-wrapper" style={{ boxShadow: 'none' }}>
                    <Table
                        columns={columns}
                        dataSource={filteredAppointments}
                        rowKey="id"
                        className="beauty-table"
                        loading={isLoading}
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            current: currentPage + 1,
                            pageSize: itemsPerPage,
                            total: filteredAppointments.length,
                            onChange: (page) => setCurrentPage(page - 1),
                            showSizeChanger: false,
                            className: 'admin-custom-pagination',
                            style: { margin: '20px 0 0 0', padding: '16px 24px', borderTop: '1px solid #f1f5f9' }
                        }}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default AppointmentList;
