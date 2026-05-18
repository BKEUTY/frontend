import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Account.css';
import MyOrders from './MyOrders';
import AppointmentList from './AppointmentList';
import ShippingAddress from './ShippingAddress';
import OrderDetail from './OrderDetail';
import { useNotification } from '@/store/NotificationContext';
import { useLanguage } from '@/store/LanguageContext';
import { useAuth } from '@/store/AuthContext';
import { CButton, CInput, SEO } from '@/components/common';
import NotFound from '@/pages/NotFound';
import userApi from '@/features/account/services/userService';
import account_image from "@/assets/images/icons/icon_account.svg";
import { 
    UserOutlined, 
    ShoppingOutlined, 
    CalendarOutlined, 
    WalletOutlined, 
    EnvironmentOutlined, 
    LogoutOutlined,
    CameraOutlined,
    RollbackOutlined,
    InfoCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { Popover, Modal } from 'antd';
import ReturnRequests from './ReturnRequests';
import MyWallet from './MyWallet';

export default function Account() {
    const notify = useNotification();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user, logout } = useAuth();

    const handleUpdate = () => {
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
                    await logout();
                    navigate('/');
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    const isActive = (path) => {
        if (path === '/account' && (location.pathname === '/account' || location.pathname === '/account/' || location.pathname === '/account/info')) return true;
        if (path === '/account/orders' && location.pathname.includes('/orders')) return true;
        if (path === '/account/appointments' && location.pathname.includes('/appointments')) return true;
        if (path === '/account/address' && location.pathname.includes('/address')) return true;
        if (path === '/account/returns' && location.pathname.includes('/returns')) return true;
        if (path === '/account/wallet' && location.pathname.includes('/wallet')) return true;
        return false;
    };

    const MEMBERSHIP_NAMES = {
        0: t('membership_level_0'),
        1: t('membership_level_1'),
        2: t('membership_level_2'),
        3: t('membership_level_3'),
        4: t('membership_level_4')
    };

    return (
        <div className="account-wrapper">
            <div className="account-sidebar">
                <div className="sidebar-profile">
                    <div className="profile-avatar-wrap">
                        <img src={account_image} alt="Avatar" className="profile-avatar" />
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">{user?.lastname ? `${user.lastname} ${user.firstname}` : (user?.name || t('account'))}</span>
                        <div className="membership-badge-row">
                            <span className={`membership-badge membership-level-${user?.membershipLevel ?? 0}`}>
                                {MEMBERSHIP_NAMES[user?.membershipLevel ?? 0]}
                            </span>
                            <Popover 
                                content={(
                                    <div className="membership-info-popover">
                                        <h4 style={{ margin: '0 0 8px 0', color: '#A10550', fontWeight: 700 }}>{t('membership_rules_title')}</h4>
                                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', lineHeight: '1.5' }}>{t('membership_rules_desc')}</p>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px' }}>
                                            <li style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>• {t('membership_threshold_member')}</li>
                                            <li style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>• {t('membership_threshold_silver')}</li>
                                            <li style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>• {t('membership_threshold_gold')}</li>
                                            <li style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>• {t('membership_threshold_platinum')}</li>
                                            <li style={{ padding: '6px 0' }}>• {t('membership_threshold_diamond')}</li>
                                        </ul>
                                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px', fontStyle: 'italic', lineHeight: '1.4' }}>
                                            {t('membership_benefits_note')}
                                        </p>
                                    </div>
                                )} 
                                title={null} 
                                trigger="click"
                                placement="rightTop"
                            >
                                <InfoCircleOutlined className="membership-info-icon" />
                            </Popover>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/account" className={`nav-item ${isActive('/account') ? 'active' : ''}`}>
                        <UserOutlined className="nav-icon" />
                        <span>{t('account')}</span>
                    </Link>
                    <Link to="/account/orders" className={`nav-item ${isActive('/account/orders') ? 'active' : ''}`}>
                        <ShoppingOutlined className="nav-icon" />
                        <span>{t('my_orders')}</span>
                    </Link>
                    <Link to="/account/appointments" className={`nav-item ${isActive('/account/appointments') ? 'active' : ''}`}>
                        <CalendarOutlined className="nav-icon" />
                        <span>{t('my_appointments')}</span>
                    </Link>
                    <Link to="/account/address" className={`nav-item ${isActive('/account/address') ? 'active' : ''}`}>
                        <EnvironmentOutlined className="nav-icon" />
                        <span>{t('shipping_address')}</span>
                    </Link>
                    <Link to="/account/returns" className={`nav-item ${isActive('/account/returns') ? 'active' : ''}`}>
                        <RollbackOutlined className="nav-icon" />
                        <span>{t('return_requests') || t('my_returns')}</span>
                    </Link>
                    <Link to="/account/wallet" className={`nav-item ${isActive('/account/wallet') ? 'active' : ''}`}>
                        <WalletOutlined className="nav-icon" />
                        <span>{t('my_wallet')}</span>
                    </Link>
                </nav>
                <div className="sidebar-bottom">
                    <div className="nav-item nav-logout" onClick={handleLogout}>
                        <LogoutOutlined className="nav-icon" />
                        <span>{t('logout')}</span>
                    </div>
                </div>
            </div>

            <div className="account-main-content">
                <Routes>
                    <Route path="/" element={<AccountInfo onUpdate={handleUpdate} />} />
                    <Route path="/info" element={<AccountInfo onUpdate={handleUpdate} />} />
                    <Route path="/orders" element={<MyOrders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/appointments" element={<AppointmentList />} />
                    <Route path="/address" element={<ShippingAddress />} />
                    <Route path="/returns" element={<ReturnRequests />} />
                    <Route path="/wallet" element={<MyWallet />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

const AccountInfo = ({ onUpdate }) => {
    const { t } = useLanguage();
    const notify = useNotification();

    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState(account_image);

    const fetchProfile = async () => {
        try {
            const res = await userApi.getProfile();
            if (res.data) {
                const data = res.data;
                setUserData({
                    id: data.userId,
                    firstname: data.firstname || '',
                    lastname: data.lastname || '',
                    email: data.email || '',
                    phone: data.phoneNumber || '',
                    dob: data.dob || '',
                    gender: data.gender || 'Nam',
                    totalSpending: data.totalSpending || 0,
                    membershipLevel: data.membershipLevel || 0
                });
            }
        } catch (err) {
            console.error('Fetch profile error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (!isEditing) return;
        if (e.target.files && e.target.files[0]) {
            setAvatar(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchProfile(); // Reset to fresh data from server
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            await userApi.updateProfile({
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                phoneNumber: userData.phone,
                dob: userData.dob,
                gender: userData.gender
            });
            
            await fetchProfile();
            setIsEditing(false);
            notify(t('update_info_success'), 'success');
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Update profile error:', err);
        }
    };

    if (isLoading) return <div className="account-loading">Loading profile...</div>;
    if (!userData) return <div className="account-error">Could not load profile.</div>;

    return (
        <div className="account-info-container">
            <SEO title={t('account_info') || t('account')} />
            <div className="page-header">
                <h1 className="page-title">{t('account')}</h1>
                <p className="page-subtitle">{t('welcome')} <strong>{userData.lastname} {userData.firstname}</strong></p>
            </div>

            <MembershipProgress spending={userData.totalSpending} level={userData.membershipLevel} />

            <div className="info-grid-layout">
                <div className="info-form-section">
                    <div className="form-grid">
                        <CInput
                            label={t('first_name')}
                            name="firstname"
                            value={userData.firstname}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <CInput
                            label={t('last_name')}
                            name="lastname"
                            value={userData.lastname}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <CInput
                            label={t('user_id')}
                            value={userData.id}
                            disabled={true}
                            className="input-locked"
                        />
                        <div className="form-group">
                            <label className="form-label">{t('gender')}</label>
                            <select
                                className="form-select"
                                name="gender"
                                value={userData.gender}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            >
                                <option value="Nam">{t('male')}</option>
                                <option value="Nu">{t('female')}</option>
                                <option value="Khac">{t('other')}</option>
                            </select>
                        </div>
                        <CInput
                            label={t('dob')}
                            type="date"
                            name="dob"
                            value={userData.dob}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <CInput
                            label={t('step_email')}
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <CInput
                            label={t('phone')}
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-actions">
                        {!isEditing ? (
                            <CButton type="primary" onClick={() => setIsEditing(true)} className="btn-edit-mode">
                                {t('update')}
                            </CButton>
                        ) : (
                            <div className="editing-actions">
                                <CButton type="secondary" onClick={handleCancel} className="btn-cancel">
                                    {t('back')}
                                </CButton>
                                <CButton type="primary" onClick={handleSave} className="btn-save">
                                    {t('confirm')}
                                </CButton>
                            </div>
                        )}
                    </div>
                </div>

                <div className="avatar-upload-section">
                    <div className={`avatar-preview-box ${isEditing ? 'is-editing' : ''}`}>
                        <img src={avatar} alt="Avatar" className="avatar-image" />
                        <label className="avatar-upload-overlay">
                            <CameraOutlined className="camera-icon" />
                            <input 
                                type="file" 
                                className="hidden-file-input" 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                disabled={!isEditing}
                            />
                        </label>
                    </div>
                    <span className="avatar-hint">{t('update_avatar')}</span>
                </div>
            </div>
        </div>
    );
};

const MembershipProgress = ({ spending, level }) => {
    const { t } = useLanguage();
    
    const thresholds = [0, 2000000, 5000000, 15000000, 30000000];
    const levels = [
        t('membership_level_0'), 
        t('membership_level_1'), 
        t('membership_level_2'), 
        t('membership_level_3'), 
        t('membership_level_4')
    ];

    const isMaxLevel = level >= 4;
    const nextLevelIndex = level < 4 ? level + 1 : 4;
    const currentThreshold = thresholds[level];
    const nextThreshold = isMaxLevel ? thresholds[level] : thresholds[level + 1];
    
    // Calculate progress within the CURRENT segment (0 to 100)
    const segmentProgress = isMaxLevel ? 100 : Math.min(100, Math.max(0, ((spending - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
    
    // Calculate TOTAL progress across the entire bar (0 to 100)
    // Each segment represents 25% of the total width (100% / 4 segments)
    const totalProgress = isMaxLevel ? 100 : (level * 25) + (segmentProgress * 0.25);

    const formatCurrency = (val) => {
        const formatted = new Intl.NumberFormat('vi-VN').format(val);
        return <>{formatted} <span className="currency">đ</span></>;
    };

    const needed = isMaxLevel ? 0 : (nextThreshold - spending);

    return (
        <div className="membership-progress-card">
            <div className="progress-header">
                <div className="current-spending">
                    <span className="label">{t('total_spending') || 'Tổng chi tiêu tích lũy'}:</span>
                    <span className="value">{formatCurrency(spending)}</span>
                </div>
                {!isMaxLevel && (
                    <div className="next-goal">
                        <span>{t('need_more_spending') || 'Cần thêm'} <strong>{formatCurrency(needed)}</strong> {t('to_reach') || 'để lên hạng'} <strong>{levels[nextLevelIndex]}</strong></span>
                    </div>
                )}
            </div>
            
            <div className="membership-progress-container">
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${totalProgress}%` }}>
                        <div className="progress-glow"></div>
                    </div>
                </div>
                <div className="threshold-markers">
                    {thresholds.map((val, idx) => (
                        <div 
                            key={idx} 
                            className={`marker ${idx <= level ? 'active' : ''} ${idx === nextLevelIndex ? 'next' : ''}`}
                            style={{ left: `${(idx / 4) * 100}%` }}
                        >
                            <div className="marker-dot"></div>
                            <span className="marker-label">{levels[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
