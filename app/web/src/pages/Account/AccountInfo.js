import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CButton, CInput } from '../../Component/Common';
import './Account.css';
import default_avatar from '../../Assets/Images/Icons/icon_account.svg';

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
        setTimeout(() => {
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
                    <div className="membership-badge-group">
                        <span className="premium-badge">{userData.membership_level}</span>
                    </div>
                    <div className="spending-info">
                        <div className="spending-labels">
                            <span className="spending-current">{new Intl.NumberFormat('vi-VN').format(userData.total_spent)}đ</span>
                            <span className="spending-target">{new Intl.NumberFormat('vi-VN').format(userData.target_spent)}đ</span>
                        </div>
                        <div className="points-progress-bar vip-progress">
                            <div
                                className="progress-fill vip-fill"
                                style={{ width: `${(userData.total_spent / userData.target_spent) * 100}%` }}
                            ></div>
                        </div>
                        <span className="next-level-text">
                            {t('next_level_condition')
                                .replace('{amount}', new Intl.NumberFormat('vi-VN').format(userData.target_spent - userData.total_spent) + 'đ')
                                .replace('{level}', userData.next_level)}
                        </span>
                    </div>
                </div>
            </div>
            <p className="greeting-text">{t('welcome')} <span className="highlight-username">{userData.name}</span>,</p>

            <div className="info-form-layout">
                <div className="form-fields">
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
                    <div className="form-group" style={{ marginBottom: 24 }}>
                        <label className="c-input-label">{t('gender')}</label>
                        <select
                            className="c-input-field"
                            name="gender"
                            value={userData.gender}
                            onChange={handleInputChange}
                            style={{ width: '100%', height: 46, padding: '0 12px' }}
                        >
                            <option value="Nam">{t('male')}</option>
                            <option value="Nu">{t('female')}</option>
                            <option value="Khac">{t('other')}</option>
                        </select>
                    </div>
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
                    <CInput
                        label={t('dob')}
                        type="date"
                        name="date_of_birth"
                        value={userData.date_of_birth}
                        onChange={handleInputChange}
                    />
                    <CInput
                        className="full-width"
                        label={t('address')}
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                    />
                    <div className="form-group full-width" style={{ marginBottom: 20 }}>
                        <span style={{ color: '#64748b' }}>{t('join_date')}: {new Date(userData.join_date).toLocaleDateString("vi-VN")}</span>
                    </div>

                    <CButton type="primary" onClick={handleSave} style={{ width: '100%', maxWidth: 200 }}>
                        {t('update')}
                    </CButton>
                </div>

                <div className="avatar-section">
                    <div className="avatar-preview">
                        <img src={avatar} alt="Avatar" className={avatar === default_avatar ? "default-icon" : "user-photo"} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <CButton type="outline">{t('update_avatar')}</CButton>
                        <input 
                            type="file" 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AccountInfo;
