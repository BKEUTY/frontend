import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './Account.css';
import AccountInfo from './AccountInfo';
import MyOrders from './MyOrders';
import { useNotification } from '../../Context/NotificationContext';
import account_image from "../../Assets/Images/mdi_account.svg";

export default function Account() {
    const notify = useNotification();
    const location = useLocation();

    const handleUpdate = () => {
        notify("Cập nhật thông tin thành công!");
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
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        border: '2px solid var(--color_main_title)', padding: '5px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '10px'
                    }}>
                        <img src={account_image} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    </div>
                    <span className="summary-name">Thanh Phong</span>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/account" className={`sidebar-item ${isActive('/account') ? 'active' : ''}`}>
                            Thông tin tài khoản
                        </Link>
                    </li>
                    <li>
                        <Link to="/account/orders" className={`sidebar-item ${isActive('/account/orders') ? 'active' : ''}`}>
                            Đơn hàng của tôi
                        </Link>
                    </li>
                    <li><span className="sidebar-item">Lịch hẹn của tôi</span></li>
                    <li><span className="sidebar-item">Ví của tôi</span></li>
                    <li><span className="sidebar-item">Địa chỉ nhận hàng</span></li>
                    <li style={{ borderTop: '1px solid #eee', marginTop: '10px' }}>
                        <Link to="/" className="sidebar-item">Đăng xuất</Link>
                    </li>
                </ul>
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
