import React, { useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './Account.css';

const AccountInfo = ({ onUpdate }) => {
    const { t } = useLanguage();
    // Using refs or state to handle form data. For simplicity, just unmanaged inputs 
    // or mocks as requested visuals are main focus.

    // Hardcoded initial values based on image
    const [avatar, setAvatar] = useState(null);

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
                // Actually in Account.js onUpdate just notifies a hardcoded string. 
                // We can pass nothing and let Account.js notify, or assume onUpdate handles it.
                // But typically onUpdate is just a callback. 
                // Let's pass the message or just call it.
                // Account.js implementation: const handleUpdate = () => { notify("Cập nhật thông tin thành công!"); };
                // So calling it is enough. But wait, user requested translation.
                // Account.js has hardcoded "Cập nhật thông tin thành công!" in handleUpdate.
                // We should probably update Account.js to use translation too, but for now let's fix AccountInfo display.
                onUpdate();
            }
        }, 500);
    };

    return (
        <div>
            <div className="info-header">
                <h2>{t('account')}</h2>
                <span className="premium-badge">PREMIUM</span>
            </div>
            <p className="greeting-text">{t('welcome')} Thanh Phong,</p>

            <div className="info-form-layout">
                <div className="form-fields">
                    <div className="form-group">
                        <label>{t('name')}</label>
                        <input type="text" className="form-input" defaultValue="Thanh Phong" />
                    </div>
                    <div className="form-group">
                        <label>{t('gender')}</label>
                        <select className="form-select" defaultValue="Nam">
                            <option value="Nam">{t('male')}</option>
                            <option value="Nu">{t('female')}</option>
                            <option value="Khac">{t('other')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-input" defaultValue="phongdeptrai28@gmail.com" />
                    </div>
                    <div className="form-group">
                        <label>{t('phone')}</label>
                        <input type="tel" className="form-input" defaultValue="0376929681" />
                    </div>
                    <div className="form-group">
                        <label>{t('dob')}</label>
                        <input type="date" className="form-input" defaultValue="2004-08-28" />
                    </div>
                    <div className="form-group">
                        <label>{t('address')}</label>
                        <input type="text" className="form-input" defaultValue="xã Long Phước, tỉnh Đồng Nai" />
                    </div>
                    <div className="form-group full-width">
                        <label>{t('join_date')}: 20/10/2026</label>
                    </div>

                    <button className="button update-info-btn" onClick={handleSave}>{t('update')}</button>
                </div>

                <div className="avatar-section">
                    <div className="avatar-preview">
                        {avatar ? <img src={avatar} alt="Avatar" /> : <div className="avatar-placeholder"></div>}
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
