import React from 'react';
import { useLanguage } from '@/store/LanguageContext';
import { ClockCircleOutlined, EnvironmentOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { SEO } from '@/components/common';
import contact_map from "@/assets/images/contact_google_map.png";
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('contact')} className="contact-page">
            <SEO title={t('contact')} />
            <p className="contact-intro">{t('contact_intro')}</p>

            <div className="map-wrapper">
                <img src={contact_map} alt="Google Map Store Location" className="contact-map-img" />
            </div>

            <div className="contact-info-grid">
                <div className="contact-info-card">
                    <h3>{t('contact_channels_title')}</h3>
                    <ul>
                        <li><PhoneOutlined /> <span>{t('contact_hotline')}</span></li>
                        <li><MailOutlined /> <span>{t('contact_email')}</span></li>
                        <li><MessageOutlined /> <span>{t('contact_zalo')}</span></li>
                    </ul>
                </div>

                <div className="contact-info-card">
                    <h3>{t('contact_office_title')}</h3>
                    <ul>
                        <li>
                            <EnvironmentOutlined />
                            <span>{t('contact_office_address')}</span>
                        </li>
                        <li>
                            <ClockCircleOutlined />
                            <span>{t('contact_office_desc')}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </StaticPageLayout>
    );
};
export default Contact;
