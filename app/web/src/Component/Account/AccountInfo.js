import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './Account.css';
import default_avatar from '../../Assets/Images/Icons/icon_account.svg';

const AccountInfo = ({ onUpdate }) => {
    const { t } = useLanguage();


    // Mock User Data based on DB Schema
    // USERS: id, username, join_date, email, password, date_of_birth, phone
    // CUSTOMERS: membership_level, vip_expire, balance
    const [userData, setUserData] = useState({
        id: 1,
        username: "thanhphong28",
        name: "Phạm Thanh Phong", // Added 'name' field for display, though DB might use username or separate profile table
        email: "phongdeptrai28@gmail.com",
        phone: "0376929681",
        date_of_birth: "2004-08-28",
        gender: "Nam", // Note: Gender not in provided DB schema, but good for UI. Keeping it.
        address: "xã Long Phước, tỉnh Đồng Nai", // Address often in separate table, but keeping for UI
        join_date: "2026-10-20",
        membership_level: "Diamond", // ENUM
        balance: 5000000
    });

    const [avatar, setAvatar] = useState(default_avatar);

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
        // Mimic API call
        setTimeout(() => {
            // Assuming onUpdate is the notification function or triggers it
            if (onUpdate) {
                onUpdate();
            }
        }, 500);
    };

    return (
        <div>
            <div className="info-header">
                <h2>{t('account')}</h2>
                <div className="membership-container">
                    <span className="premium-badge">{userData.membership_level}</span>
                    <div className="points-progress-bar">
                        <div className="progress-fill" style={{ width: '70%' }}></div>
                    </div>
                    <span className="points-text">1,250 {t('pts')}</span>
                </div>
            </div>
            <p className="greeting-text">{t('welcome')} <span className="highlight-username">{userData.name}</span>,</p>

            <div className="info-form-layout">
                <div className="form-fields">
                    <div className="form-group">
                        <label>{t('name')}</label>
                        <input
                            type="text"
                            className="form-input"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('username')}</label>
                        <input
                            type="text"
                            className="form-input"
                            value={userData.username}
                            readOnly
                            disabled
                            style={{ backgroundColor: '#f5f5f5' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('gender')}</label>
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
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-input"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('phone')}</label>
                        <input
                            type="tel"
                            className="form-input"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('dob')}</label>
                        <input
                            type="date"
                            className="form-input"
                            name="date_of_birth"
                            value={userData.date_of_birth}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>{t('address')}</label>
                        <input
                            type="text"
                            className="form-input"
                            name="address"
                            value={userData.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>{t('join_date')}: {new Date(userData.join_date).toLocaleDateString("vi-VN")}</label>
                    </div>

                    <button className="button update-info-btn" onClick={handleSave}>{t('update')}</button>
                </div>

                <div className="avatar-section">
                    <div className="avatar-preview">
                        <img src={avatar} alt="Avatar" className={avatar === default_avatar ? "default-icon" : "user-photo"} />
                    </div>
                    <label className="button upload-avatar-btn">
                        {t('update_avatar')}
                        <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>
            </div>
        </div>
    );
};
export default AccountInfo;
