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
    RollbackOutlined
} from '@ant-design/icons';
import ReturnRequests from './ReturnRequests';

export default function Account() {
    const notify = useNotification();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user, logout } = useAuth();

    const handleUpdate = () => {
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const isActive = (path) => {
        if (path === '/account' && (location.pathname === '/account' || location.pathname === '/account/' || location.pathname === '/account/info')) return true;
        if (path === '/account/orders' && location.pathname.includes('/orders')) return true;
        if (path === '/account/appointments' && location.pathname.includes('/appointments')) return true;
        if (path === '/account/address' && location.pathname.includes('/address')) return true;
        if (path === '/account/returns' && location.pathname.includes('/returns')) return true;
        return false;
    };

    return (
        <div className="account-wrapper">
            <div className="account-sidebar">
                <div className="sidebar-profile">
                    <div className="profile-avatar-wrap">
                        <img src={account_image} alt="Avatar" className="profile-avatar" />
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">{user?.name || t('account')}</span>
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
                    <div className="nav-item disabled">
                        <WalletOutlined className="nav-icon" />
                        <span>{t('my_wallet')}</span>
                    </div>
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
            const res = await userApi.getProfile({ skipGlobalErrorHandler: true });
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
                });
            }
        } catch (err) {
            notify(t('fetch_profile_error'), 'error');
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
            }, { 
                customErrorMsg: t('update_info_error') || t('api_error_general') 
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
                <p className="page-subtitle">{t('welcome')} <strong>{userData.firstname} {userData.lastname}</strong></p>
            </div>

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
