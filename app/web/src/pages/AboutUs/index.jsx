import React from 'react';
import { useLanguage } from '@/store/LanguageContext';
import { SEO } from '@/components/common';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import './AboutUs.css';

const AboutUs = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('about_brand')} className="about-page">
            <SEO title={t('about_brand')} />
            <div className="content-image-placeholder">
                {t('about_us_banner')}
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

            <div className="content-image-placeholder">
                {t('about_us_team_img')}
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
