import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { EnvironmentOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import StaticPageLayout from './StaticPageLayout';
import contact_map from "../../Assets/Images/contact_google_map.png";
import './Contact.css';

export const Contact = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('contact')} className="contact-page">
            <p className="contact-intro">{t('contact_intro')}</p>

            <div className="map-wrapper">
                <img src={contact_map} alt="Google Map Store Location" className="contact-map-img" />
            </div>

            <div className="contact-info-grid">
                <div className="contact-info-card">
                    <h3>{t('contact_channels_title')}</h3>
                    <ul>
                        <li><PhoneOutlined /> {t('contact_hotline')}</li>
                        <li><EnvironmentOutlined /> {t('contact_email')}</li>
                        <li><UserOutlined /> {t('contact_zalo')}</li>
                    </ul>
                </div>

                <div className="contact-info-card">
                    <h3>{t('contact_office_title')}</h3>
                    <p className="office-address">
                        <EnvironmentOutlined /> {t('contact_office_address')}
                    </p>
                    <p className="office-desc">{t('contact_office_desc')}</p>
                </div>
            </div>
        </StaticPageLayout>
    );
};
