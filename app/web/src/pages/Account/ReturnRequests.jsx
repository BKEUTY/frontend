import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Spin, Modal, Select, Upload, Input, Empty } from 'antd';
import { 
    RollbackOutlined, 
    PlusOutlined, 
    InboxOutlined, 
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined 
} from '@ant-design/icons';
import { useLanguage } from '@/store/LanguageContext';
import { useNotification } from '@/store/NotificationContext';
import { CButton, SEO } from '@/components/common';
import './ReturnRequests.css';

const { Dragger } = Upload;
const { TextArea } = Input;

const ReturnRequests = () => {
    const { t } = useLanguage();
    const notify = useNotification();
    const location = useLocation();
    
    // Mock data for initial UI
    const [returns, setReturns] = useState([
        {
            id: "RET12345",
            orderId: "ORD9982",
            date: "2024-03-15",
            status: "PENDING",
            reason: "Damaged during delivery",
            items: ["Serum Vitamin C BKEUTY"]
        },
        {
            id: "RET12346",
            orderId: "ORD9910",
            date: "2024-03-10",
            status: "APPROVED",
            reason: "Wrong product sent",
            items: ["Kem dưỡng ẩm đêm"]
        }
    ]);

    const [loading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        orderId: null,
        reason: null,
        description: "",
        images: []
    });

    // Handle pre-filled state from OrderDetail
    useEffect(() => {
        if (location.state?.orderId) {
            setRequestData(prev => ({
                ...prev,
                orderId: location.state.orderId,
                description: location.state.item ? `${t('return_for') || "Trả hàng cho"}: ${location.state.item.productVariantName}` : ""
            }));
            setIsModalOpen(true);
        }
    }, [location.state, t]);

    const getStatusInfo = (status) => {
        switch(status) {
            case 'PENDING': return { icon: <ClockCircleOutlined />, class: 'status-pending', text: t('pending') };
            case 'APPROVED': return { icon: <CheckCircleOutlined />, class: 'status-approved', text: t('approved') };
            case 'REJECTED': return { icon: <ExclamationCircleOutlined />, class: 'status-rejected', text: t('rejected') };
            default: return { icon: <ClockCircleOutlined />, class: 'status-default', text: status };
        }
    };

    const handleCreateRequest = () => {
        if (!requestData.orderId || !requestData.reason) {
            notify(t('fill_all_fields') || "Vui lòng điền đủ thông tin", "error");
            return;
        }
        notify(t('request_submitted') || "Yêu cầu đã được gửi. Đang chờ phê duyệt.", "success");
        setIsModalOpen(false);
    };

    return (
        <div className="return-requests-container">
            <SEO title={t('return_requests')} />
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">{t('return_requests')}</h1>
                    <p className="page-subtitle">{t('returns_desc') || "Quản lý các yêu cầu đổi trả và hoàn tiền của bạn"}</p>
                </div>
                <CButton 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
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
                                        <span className="ord-ref">{t('order_id')}: {item.orderId}</span>
                                    </div>
                                    <div className={`ret-status ${sInfo.class}`}>
                                        {sInfo.icon} <span>{sInfo.text}</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">{t('date')}:</span>
                                        <span className="value">{item.date}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">{t('return_reason')}:</span>
                                        <span className="value highlight">{item.reason}</span>
                                    </div>
                                    <div className="info-items">
                                        {item.items.map((prod, i) => (
                                            <span key={i} className="item-tag">{prod}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <CButton type="outline" size="small">{t('view_detail')}</CButton>
                                    {item.status === 'PENDING' && (
                                        <CButton type="danger" size="small" ghost>{t('cancel_request') || "Hủy yêu cầu"}</CButton>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Empty description={t('no_return_requests') || "Bạn chưa có yêu cầu hoàn trả nào."} />
                )}
            </div>

            <Modal
                title={t('request_return')}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleCreateRequest}
                width={700}
                className="return-modal-luxury"
                okText={t('confirm')}
                cancelText={t('back')}
            >
                <div className="return-form">
                    <div className="form-item">
                        <label>{t('select_order') || "Chọn đơn hàng"}</label>
                        <Select 
                            placeholder={t('order_placeholder') || "Chọn đơn hàng cần trả"}
                            style={{ width: '100%' }}
                            onChange={(val) => setRequestData(p => ({ ...p, orderId: val }))}
                            options={[
                                { value: 'ORD9982', label: 'Order #ORD9982 - 1.250.000đ' },
                                { value: 'ORD9915', label: 'Order #ORD9915 - 450.000đ' },
                            ]}
                        />
                    </div>

                    <div className="form-item">
                        <label>{t('return_reason')}</label>
                        <Select 
                            placeholder={t('reason_placeholder') || "Lý do hoàn trả"}
                            style={{ width: '100%' }}
                            onChange={(val) => setRequestData(p => ({ ...p, reason: val }))}
                            options={[
                                { value: 'DAMAGED', label: t('reason_damaged') || "Sản phẩm bị hư hỏng/móp méo" },
                                { value: 'WRONG', label: t('reason_wrong') || "Giao sai sản phẩm" },
                                { value: 'QUALITY', label: t('reason_quality') || "Chất lượng không như mô tả" },
                                { value: 'OTHERS', label: t('reason_others') || "Lý do khác" },
                            ]}
                        />
                    </div>

                    <div className="form-item">
                        <label>{t('return_description')}</label>
                        <TextArea 
                            rows={4} 
                            placeholder={t('desc_placeholder') || "Mô tả chi tiết tình trạng sản phẩm..."}
                            value={requestData.description}
                            onChange={(e) => setRequestData(p => ({ ...p, description: e.target.value }))}
                        />
                    </div>

                    <div className="form-item">
                        <label>{t('upload_evidence')}</label>
                        <Dragger 
                            multiple 
                            listType="picture"
                            beforeUpload={() => false}
                        >
                            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                            <p className="ant-upload-text">{t('drag_upload_hint') || "Click hoặc kéo thả ảnh vào đây để tải lên"}</p>
                            <p className="ant-upload-hint">{t('upload_limit_hint') || "Tối đa 5 ảnh. Hỗ trợ JPG, PNG."}</p>
                        </Dragger>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReturnRequests;
