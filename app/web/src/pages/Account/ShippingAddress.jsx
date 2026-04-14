import React, { useState } from 'react';
import { Modal, Select, Empty, Spin, Tooltip } from 'antd';
import { 
    PlusOutlined, 
    EnvironmentOutlined, 
    DeleteOutlined, 
    ExclamationCircleOutlined 
} from '@ant-design/icons';
import { useLanguage } from '@/store/LanguageContext';
import { useNotification } from '@/store/NotificationContext';
import { useUserProfile, useAddAddress, useDeleteAddress } from '@/features/account/hooks/useUser';
import { useProvinces, useDistricts, useWards } from '@/features/account/hooks/useAddress';
import { CButton, CInput, SEO } from '@/components/common';
import './ShippingAddress.css';

const { confirm } = Modal;

const ShippingAddress = () => {
    const { t } = useLanguage();
    const notify = useNotification();
    const { data: profile, isLoading } = useUserProfile();
    const addAddressMutation = useAddAddress();
    const deleteAddressMutation = useDeleteAddress();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAddr, setNewAddr] = useState({ 
        street: "", 
        province: null, 
        district: null, 
        ward: null 
    });

    const { data: provinces } = useProvinces();
    const { data: districts } = useDistricts(newAddr.province?.id);
    const { data: wards } = useWards(newAddr.district?.id);

    const handleDelete = (addr) => {
        confirm({
            title: t('confirm_delete_title'),
            icon: <ExclamationCircleOutlined />,
            content: t('confirm_delete_message'),
            okText: t('delete'),
            okType: 'danger',
            cancelText: t('cancel'),
            onOk: async () => {
                const payload = {
                    address: addr.address,
                    ward: {
                        wardCode: Number(addr.ward.wardCode),
                        wardName: addr.ward.wardName
                    },
                    district: {
                        districtID: Number(addr.district.districtID),
                        districtName: addr.district.districtName
                    },
                    province: {
                        provinceID: Number(addr.province.provinceID),
                        provinceName: addr.province.provinceName
                    }
                };

                deleteAddressMutation.mutate({ 
                    data: payload, 
                    config: { customErrorMsg: t('delete_failed') || t('api_error_general') } 
                }, {
                    onSuccess: () => {
                        notify(t('delete_success'), "success");
                    }
                });
            },
        });
    };

    const handleAddAddress = () => {
        if (!newAddr.street || !newAddr.ward || !newAddr.district || !newAddr.province) {
            notify(t('fill_delivery_info'), "error");
            return;
        }

        addAddressMutation.mutate({ 
            data: {
                address: newAddr.street,
                province: { provinceID: newAddr.province.id, provinceName: newAddr.province.name },
                district: { districtID: newAddr.district.id, districtName: newAddr.district.name },
                ward: { wardCode: newAddr.ward.id, wardName: newAddr.ward.name }
            },
            config: { customErrorMsg: t('add_address_failed') || t('api_error_general') }
        }, { 
            onSuccess: () => {
                setIsAddModalOpen(false);
                setNewAddr({ street: "", province: null, district: null, ward: null });
                notify(t('success'), "success");
            }
        });
    };

    if (isLoading) return <div className="address-loading-wrap"><Spin size="large" /></div>;

    return (
        <div className="shipping-address-container">
            <SEO title={t('shipping_address')} />
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">{t('shipping_address')}</h1>
                    <p className="page-subtitle">{t('manage_addresses_desc') || "Quản lý danh sách địa chỉ nhận hàng của bạn"}</p>
                </div>
                <CButton 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-add-address"
                >
                    {t('add_new_address')}
                </CButton>
            </div>

            <div className="address-list-grid">
                {profile?.addresses && profile.addresses.length > 0 ? (
                    profile.addresses.map((addr, idx) => (
                        <div key={idx} className="address-card">
                            <div className="card-icon">
                                <EnvironmentOutlined />
                            </div>
                            <div className="card-content">
                                <div className="addr-street">{addr.address}</div>
                                <div className="addr-location">
                                    {addr.ward.wardName}, {addr.district.districtName}, {addr.province.provinceName}
                                </div>
                                {idx === 0 && <span className="default-badge">{t('default') || "Mặc định"}</span>}
                            </div>
                            <div className="card-actions">
                                <Tooltip title={t('delete')}>
                                    <button 
                                        className="btn-action delete" 
                                        onClick={() => handleDelete(addr)}
                                        disabled={deleteAddressMutation.isPending}
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-address">
                        <Empty 
                            description={t('no_address_hint') || "Bạn chưa có địa chỉ nhận hàng nào."} 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                )}
            </div>

            <Modal
                title={t('add_new_address')}
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                width={650}
                className="address-modal-luxury"
                footer={
                    <div className="modal-footer-custom">
                        <CButton 
                            className="btn-modal-back" 
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            {t('back')}
                        </CButton>
                        <CButton 
                            type="primary" 
                            className="btn-modal-confirm" 
                            onClick={handleAddAddress}
                            loading={addAddressMutation.isPending}
                        >
                            {t('confirm')}
                        </CButton>
                    </div>
                }
            >
                <div className="add-address-form">
                    <div className="address-form-field">
                        <CInput 
                            label={t('address')} 
                            placeholder={t('address_placeholder')} 
                            value={newAddr.street}
                            onChange={(e) => setNewAddr(p => ({ ...p, street: e.target.value }))}
                        />
                    </div>
                    
                    <div className="address-select-grid">
                        <div className="select-item">
                            <label className="select-label">{t('province')}</label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder={t('select_province')}
                                value={newAddr.province?.id}
                                options={provinces?.map(p => ({ 
                                    value: p.ProvinceID, 
                                    label: p.ProvinceName
                                }))}
                                onChange={(id, opt) => setNewAddr({ 
                                    street: newAddr.street, 
                                    province: { id, name: opt.label }, 
                                    district: null, 
                                    ward: null 
                                })}
                                showSearch
                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                className="beauty-select"
                            />
                        </div>
                        
                        <div className="select-item">
                            <label className="select-label">{t('district')}</label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder={t('select_district')}
                                disabled={!newAddr.province}
                                value={newAddr.district?.id}
                                options={districts?.map(d => ({ 
                                    value: d.DistrictID, 
                                    label: d.DistrictName 
                                }))}
                                onChange={(id, opt) => setNewAddr(p => ({ 
                                    ...p, 
                                    district: { id, name: opt.label }, 
                                    ward: null 
                                }))}
                                showSearch
                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                className="beauty-select"
                            />
                        </div>
                        
                        <div className="select-item">
                            <label className="select-label">{t('ward')}</label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder={t('select_ward')}
                                disabled={!newAddr.district}
                                value={newAddr.ward?.id}
                                options={wards?.map(w => ({ 
                                    value: w.WardCode, 
                                    label: w.WardName 
                                }))}
                                onChange={(id, opt) => setNewAddr(p => ({ 
                                    ...p, 
                                    ward: { id, name: opt.label } 
                                }))}
                                showSearch
                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                className="beauty-select"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ShippingAddress;
