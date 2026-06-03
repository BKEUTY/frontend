import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Empty, Modal } from 'antd';
import { 
    PlusOutlined, 
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined 
} from '@ant-design/icons';
import { useLanguage } from '@/store/LanguageContext';
import { useNotification } from '@/store/NotificationContext';
import { CButton, SEO, Pagination, AnimatedPage } from '@/components/common';
import { getOptimizedImageUrl } from '@/services/axiosClient';
import orderApi from '@/features/orders/services/orderService';
import './ReturnRequests.css';

const ReturnRequests = () => {
    const { t } = useLanguage();
    const notify = useNotification();
    const navigate = useNavigate();
    
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchRefunds = async (currentPage = 1) => {
        setLoading(true);
        try {
            const response = await orderApi.getMyRefunds({ page: currentPage, size: pageSize });
            setReturns(response.data?.content ?? []);
            setTotalItems(response.data?.totalElements ?? 0);
            setTotalPages(response.data?.totalPages ?? 0);
        } catch (err) {
            notify(t('api_error_general'), 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds(1);
    }, []);

    const getStatusInfo = (status) => {
        const upperStatus = status?.toUpperCase();
        switch(upperStatus) {
            case 'PENDING': 
                return { icon: <ClockCircleOutlined />, class: 'status-pending', text: t('refund_status_PENDING') };
            case 'APPROVED': 
                return { icon: <CheckCircleOutlined />, class: 'status-approved', text: t('refund_status_APPROVED') };
            case 'REJECTED': 
                return { icon: <ExclamationCircleOutlined />, class: 'status-rejected', text: t('refund_status_REJECTED') };
            case 'DELIVERED':
            case 'COMPLETED': 
                return { icon: <CheckCircleOutlined />, class: 'status-completed', text: t('refund_status_DELIVERED') };
            case 'REFUNDING':
                return { icon: <ClockCircleOutlined />, class: 'status-refunding', text: t('refund_status_REFUNDING') };
            case 'REFUND_FAILED':
                return { icon: <ExclamationCircleOutlined />, class: 'status-refund_failed', text: t('refund_status_REFUND_FAILED') };
            case 'REFUNDED': 
                return { icon: <CheckCircleOutlined />, class: 'status-refunded', text: t('refund_status_REFUNDED') };
            default: 
                return { icon: <ClockCircleOutlined />, class: 'status-default', text: status };
        }
    };

    const handleCreateRefundRedirect = () => {
        notify(t('select_order_to_refund_hint'), 'info');
        navigate('/account/orders');
    };

    return (
        <AnimatedPage>
            <div className="return-requests-container">
                <SEO title={t('return_requests')} />
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">{t('return_requests')}</h1>
                    <p className="page-subtitle">{t('returns_desc')}</p>
                </div>
                <CButton 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleCreateRefundRedirect}
                    className="btn-create-return"
                >
                    {t('request_return')}
                </CButton>
            </div>

            <div className="returns-list">
                {loading ? (
                    <div className="loading-state"><Spin size="large" /></div>
                ) : returns.length > 0 ? (
                    returns.map((item) => {
                        const sInfo = getStatusInfo(item.status);
                        return (
                            <div key={item.id} className="return-card">
                                <div className="card-top">
                                    <div className="id-section">
                                        <span className="ret-id">#{item.id}</span>
                                        <span className="ord-ref">{t('order_id')}: #{item.orderId}</span>
                                    </div>
                                    <div className={`ret-status ${sInfo.class}`}>
                                        {sInfo.icon} <span>{sInfo.text}</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">{t('date')}:</span>
                                        <span className="value">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '---'}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">{t('return_reason')}:</span>
                                        <span className="value highlight">{item.note ?? '---'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">{t('refund_amount')}:</span>
                                        <span className="value price" style={{ color: '#e11d48', fontWeight: 600 }}>
                                            {(item.total ?? 0).toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <div className="info-items" style={{ marginTop: '12px' }}>
                                        {(item.items ?? []).map((prod, i) => (
                                            <span key={i} className="item-tag">{prod}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <CButton 
                                        type="outline" 
                                        size="small"
                                        onClick={() => setSelectedRefund(item)}
                                    >
                                        {t('view_detail')}
                                    </CButton>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Empty description={t('no_return_requests')} />
                )}
            </div>


            {returns.length > 0 && totalPages > 1 && (
                <div className="returns-pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                    <Pagination
                        page={page}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        onPageChange={(p) => {
                            setPage(p);
                            fetchRefunds(p);
                        }}
                    />
                </div>
            )}


            <Modal
                title={<span className="ret-modal-title" style={{ fontSize: '18px', fontWeight: 800, background: 'linear-gradient(90deg, var(--color_main_title), var(--color_secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('request_refund_title')} #{selectedRefund?.id}</span>}
                open={!!selectedRefund}
                onCancel={() => setSelectedRefund(null)}
                footer={null}
                width={650}
                className="ret-refund-detail-modal-luxury"
                style={{ top: '30px', paddingBottom: '30px' }}
            >
                {selectedRefund && (
                    <div className="ret-refund-modal-body" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Refunded Items Summary */}
                        <div className="ret-refund-items-summary" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                            <label className="ret-field-label" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {t('refund_selected_items')}
                            </label>
                            <div className="ret-refund-summary-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                {(selectedRefund.items ?? []).map((item, index) => (
                                    <div key={index} className="ret-refund-summary-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color_main_title)' }} />
                                        <div className="item-info" style={{ flex: 1 }}>
                                            <div className="item-name" style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{item}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="ret-refund-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('order_id')}</span>
                                <span className="ret-refund-detail-value">
                                    <span 
                                        onClick={() => {
                                            setSelectedRefund(null);
                                            navigate(`/account/orders/${selectedRefund.orderId}`);
                                        }} 
                                        style={{ color: 'var(--color_main_title)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        #{selectedRefund.orderId}
                                    </span>
                                </span>
                            </div>

                            <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('refund_amount')}</span>
                                <span className="ret-refund-detail-value" style={{ color: '#e11d48', fontWeight: 700, fontSize: '15px' }}>
                                    {(selectedRefund.total ?? 0).toLocaleString('vi-VN')}₫
                                </span>
                            </div>

                            <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('date')}</span>
                                <span className="ret-refund-detail-value" style={{ color: '#334155', fontWeight: 600 }}>
                                    {selectedRefund.createdAt ? new Date(selectedRefund.createdAt).toLocaleString('vi-VN') : '---'}
                                </span>
                            </div>

                            <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('status')}</span>
                                <div>
                                    <span className={`od-refund-badge ${selectedRefund.status?.toLowerCase() ?? 'pending'}`} style={{ marginTop: '0px' }}>
                                        {t(`refund_status_${selectedRefund.status}`)}
                                    </span>
                                </div>
                            </div>

                            <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                                <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('phone')}</span>
                                <span className="ret-refund-detail-value" style={{ color: '#334155', fontWeight: 600 }}>{selectedRefund.phoneNumber ?? '---'}</span>
                            </div>

                            <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                                <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('address')}</span>
                                <span className="ret-refund-detail-value" style={{ color: '#334155', fontWeight: 600 }}>
                                    {selectedRefund.fromAddress ? selectedRefund.fromAddress.split('|')[0] : '---'}
                                </span>
                            </div>

                            <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                                <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('return_reason')}</span>
                                <span className="ret-refund-detail-value" style={{ whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9', color: '#334155', minHeight: '40px' }}>
                                    {selectedRefund.note ?? '---'}
                                </span>
                            </div>

                            {selectedRefund.evidenceImageUrls && selectedRefund.evidenceImageUrls.length > 0 && (
                                <div className="ret-refund-detail-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                                    <span className="ret-refund-detail-label" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t('upload_evidence')}</span>
                                    <div className="ret-refund-evidence-gallery" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                                        {selectedRefund.evidenceImageUrls.map((imgUrl, i) => (
                                            <img 
                                                key={i} 
                                                src={getOptimizedImageUrl(imgUrl, 256)} 
                                                alt="evidence" 
                                                className="ret-refund-evidence-thumb" 
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                                                onClick={() => setPreviewImage(imgUrl)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>


            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
                width={600}
                centered
            >
                <img alt="preview" style={{ width: '100%', borderRadius: '12px' }} src={getOptimizedImageUrl(previewImage, 1080)} />
            </Modal>
        </div>
        </AnimatedPage>
    );
};

export default ReturnRequests;
