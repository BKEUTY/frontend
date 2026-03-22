import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Account.css';
import AccountInfo from './AccountInfo';
import MyOrders from './MyOrders';
import AppointmentList from './AppointmentList';
import OrderDetail from './OrderDetail';
import { useNotification } from '../../Context/NotificationContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../Context/AuthContext';
import account_image from "../../Assets/Images/Icons/icon_account.svg";
import NotFound from '../../Component/ErrorPages/NotFound';

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
            console.error("Logout failed:", error);
        }
    };

    const isActive = (path) => {
        if (path === '/account' && (location.pathname === '/account' || location.pathname === '/account/' || location.pathname === '/account/info')) return true;
        if (path === '/account/orders' && location.pathname.includes('/orders')) return true;
        if (path === '/account/appointments' && location.pathname.includes('/appointments')) return true;
        return false;
    };

    return (
        <div className="account-container">
            <div className="account-sidebar">
                <div className="user-summary">
                    <div className="user-avatar-container">
                        <img src={account_image} alt="Avatar" className="user-avatar-img" />
                    </div>
                    <span className="summary-name">{user?.name || t('account')}</span>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/account" className={`sidebar-item ${isActive('/account') ? 'active' : ''}`}>
                            {t('account')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/account/orders" className={`sidebar-item ${isActive('/account/orders') ? 'active' : ''}`}>
                            {t('my_orders')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/account/appointments" className={`sidebar-item ${isActive('/account/appointments') ? 'active' : ''}`}>
                            {t('my_appointments')}
                        </Link>
                    </li>
                    <li><span className="sidebar-item">{t('my_wallet')}</span></li>
                    <li><span className="sidebar-item">{t('shipping_address')}</span></li>
                </ul>
                <div className="sidebar-footer">
                    <div 
                        className="sidebar-item logout-item" 
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        {t('logout')}
                    </div>
                </div>
            </div>

            <div className="account-content">
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
