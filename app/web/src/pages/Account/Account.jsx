import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Account.css';
import MyOrders from './MyOrders';
import AppointmentList from './AppointmentList';
import OrderDetail from './OrderDetail';
import { useNotification } from '../../Context/NotificationContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../Context/AuthContext';
import { CButton, CInput } from '../../Component/Common';
import NotFound from '../../Component/ErrorPages/NotFound';
import account_image from "../../Assets/Images/Icons/icon_account.svg";
import { 
    UserOutlined, 
    ShoppingOutlined, 
    CalendarOutlined, 
    WalletOutlined, 
    EnvironmentOutlined, 
    LogoutOutlined,
    CameraOutlined
} from '@ant-design/icons';

export default function Account() {
    const notify = useNotification();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user, logout } = useAuth();

    const handleUpdate = () => {
        notify(t('update_info_success'), 'success');
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
                        <span className="profile-role">{t('member')}</span>
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
                    <div className="nav-item disabled">
                        <WalletOutlined className="nav-icon" />
                        <span>{t('my_wallet')}</span>
                    </div>
                    <div className="nav-item disabled">
                        <EnvironmentOutlined className="nav-icon" />
                        <span>{t('shipping_address')}</span>
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
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

const AccountInfo = ({ onUpdate }) => {
    const { t } = useLanguage();

    const [userData, setUserData] = useState({
        id: 1,
        username: "thanhphong28",
        name: "Phạm Thanh Phong",
        email: "phongdeptrai28@gmail.com",
        phone: "0376929681",
        date_of_birth: "2004-08-28",
        gender: "Nam",
        address: "xã Long Phước, tỉnh Đồng Nai",
        join_date: "2026-10-20",
        membership_level: "Diamond",
        balance: 5000000,
        total_spent: 85000000,
        target_spent: 100000000,
        next_level: "VIP"
    });

    const [avatar, setAvatar] = useState(account_image);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setTimeout(() => {
            if (onUpdate) onUpdate();
        }, 300);
    };

    return (
        <div className="account-info-container">
            <div className="page-header">
                <h1 className="page-title">{t('account')}</h1>
                <p className="page-subtitle">{t('welcome')} <strong>{userData.name}</strong></p>
            </div>

            <div className="membership-card">
                <div className="membership-tier">
                    <span className="tier-label">{t('current_tier')}</span>
                    <span className="tier-badge">{userData.membership_level}</span>
                </div>
                <div className="membership-progress-wrap">
                    <div className="progress-labels">
                        <span className="spent-amount">{new Intl.NumberFormat('vi-VN').format(userData.total_spent)}đ</span>
                        <span className="target-amount">{new Intl.NumberFormat('vi-VN').format(userData.target_spent)}đ</span>
                    </div>
                    <div className="progress-track">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${(userData.total_spent / userData.target_spent) * 100}%` }}
                        ></div>
                    </div>
                    <p className="tier-hint">
                        {t('next_level_condition')
                            .replace('{amount}', new Intl.NumberFormat('vi-VN').format(userData.target_spent - userData.total_spent) + 'đ')
                            .replace('{level}', userData.next_level)}
                    </p>
                </div>
            </div>

            <div className="info-grid-layout">
                <div className="info-form-section">
                    <div className="form-grid">
                        <CInput
                            label={t('name')}
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                        />
                        <CInput
                            label={t('username')}
                            value={userData.username}
                            disabled
                        />
                        <div className="form-group">
                            <label className="form-label">{t('gender')}</label>
                            <select
                                className="form-select"
                                name="gender"
                                value={userData.gender}
                                onChange={handleInputChange}
                            >
                                <option value="Nam">{t('male')}</option>
                                <option value="Nu">{t('female')}</option>
                                <option value="Khac">{t('other')}</option>
                            </select>
                        </div>
                        <CInput
                            label={t('dob')}
                            type="date"
                            name="date_of_birth"
                            value={userData.date_of_birth}
                            onChange={handleInputChange}
                        />
                        <CInput
                            label={t('step_email')}
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                        <CInput
                            label={t('phone')}
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                        />
                        <div className="form-group full-width">
                            <CInput
                                label={t('address')}
                                name="address"
                                value={userData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <span className="join-date">{t('join_date')}: {new Date(userData.join_date).toLocaleDateString("vi-VN")}</span>
                        <CButton type="primary" onClick={handleSave} className="btn-save">
                            {t('update')}
                        </CButton>
                    </div>
                </div>

                <div className="avatar-upload-section">
                    <div className="avatar-preview-box">
                        <img src={avatar} alt="Avatar" className="avatar-image" />
                        <label className="avatar-upload-overlay">
                            <CameraOutlined className="camera-icon" />
                            <input 
                                type="file" 
                                className="hidden-file-input" 
                                onChange={handleFileChange} 
                                accept="image/*" 
                            />
                        </label>
                    </div>
                    <span className="avatar-hint">{t('update_avatar')}</span>
                </div>
            </div>
        </div>
    );
};
