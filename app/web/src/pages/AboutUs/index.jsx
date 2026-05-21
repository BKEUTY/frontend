import React from 'react';
import { useLanguage } from '@/store/LanguageContext';
import { SEO } from '@/components/common';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import './AboutUs.css';

import imgTeam1 from '@/assets/teams/_TTD2384.jpg';
import imgTeam2 from '@/assets/teams/_TTD2392.jpg';

import logo_image from '@/assets/images/logo.svg';

const AboutUs = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('about_brand')} className="about-page">
            <SEO title={t('about_brand')} />
            <div className="about-brand-logo-banner" style={{ display: 'flex', justifyContent: 'center', padding: '80px 0', marginBottom: '40px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '16px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                <img src={logo_image} alt="BKEUTY Logo" style={{ maxWidth: '300px', height: 'auto', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
            </div>
            <div className="about-section">
                <h3>{t('about_us_story_title')}</h3>
                <p>{t('about_us_story_p1')}</p>
                <p>{t('about_us_story_p2')}</p>
            </div>

            <div className="about-section">
                <h3>{t('about_us_mission_title')}</h3>
                <p>{t('about_us_mission')}</p>
                <p>{t('about_us_vision')}</p>
            </div>

            <div className="about-team-images" style={{ display: 'flex', gap: '24px', margin: '32px 0', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    <img src={imgTeam1} alt="Phạm Thanh Phong" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} />
                    <h4 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#1f2937' }}>Phạm Thanh Phong</h4>
                    <p style={{ margin: '0 0 4px', color: '#6b7280', fontWeight: 500 }}>{t('team_role_cofounder')}</p>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>{t('team_yob')}</p>
                </div>
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    <img src={imgTeam2} alt="Nguyễn Bá Việt Quang" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} />
                    <h4 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#1f2937' }}>Nguyễn Bá Việt Quang</h4>
                    <p style={{ margin: '0 0 4px', color: '#6b7280', fontWeight: 500 }}>{t('team_role_cofounder')}</p>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>{t('team_yob')}</p>
                </div>
            </div>

            <div className="about-section">
                <h3>{t('about_us_values_title')}</h3>
                <ul className="about-values-list">
                    <li>{t('about_us_value_trust')}</li>
                    <li>{t('about_us_value_dedication')}</li>
                    <li>{t('about_us_value_trend')}</li>
                </ul>
            </div>
        </StaticPageLayout>
    );
};
export default AboutUs;
