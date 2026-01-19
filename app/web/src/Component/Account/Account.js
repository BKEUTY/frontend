import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './Account.css';
import AccountInfo from './AccountInfo';
import MyOrders from './MyOrders';
import { useNotification } from '../../Context/NotificationContext';
import { useLanguage } from '../../i18n/LanguageContext';
import account_image from "../../Assets/Images/Icons/icon_account.svg";

export default function Account() {
    const notify = useNotification();
    const location = useLocation();
    const { t } = useLanguage();

    const handleUpdate = () => {
        notify(t('update_info_success'));
    };

    const isActive = (path) => {
        // Simple active check
        if (path === '/account' && (location.pathname === '/account' || location.pathname === '/account/')) return true;
        if (path === '/account/orders' && location.pathname.includes('/orders')) return true;
        return false;
    };

    return (
        <div className="account-container">

            <div className="account-sidebar">
                <div className="user-summary">
                    <div className="user-avatar-container">
                        <img src={account_image} alt="Avatar" className="user-avatar-img" />
                    </div>
                    <span className="summary-name">Thanh Phong</span>
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
                    <li><span className="sidebar-item">{t('my_appointments')}</span></li>
                    <li><span className="sidebar-item">{t('my_wallet')}</span></li>
                    <li><span className="sidebar-item">{t('shipping_address')}</span></li>
                </ul>
                <div className="sidebar-footer">
                    <Link to="/" className="sidebar-item logout-item">{t('logout')}</Link>
                </div>
            </div>

            <div className="account-content">
                <Routes>
                    <Route path="/" element={<AccountInfo onUpdate={handleUpdate} />} />
                    <Route path="/orders" element={<MyOrders />} />
                </Routes>
            </div>
        </div>
    );
}
