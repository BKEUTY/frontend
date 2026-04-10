import React from 'react';
import { useLanguage } from '@/store/LanguageContext';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { SEO } from '@/components/common';
import './FAQ.css';

const FAQ = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('faq')} className="faq-page">
            <SEO title={t('faq')} />
            <div className="faq-container">
                <div className="faq-section">
                    <h3>{t('faq_1_title')}</h3>
                    <div className="faq-item">
                        <h4>{t('faq_1_q1')}</h4>
                        <p>{t('faq_1_a1')}</p>
                    </div>
                    <div className="faq-item">
                        <h4>{t('faq_1_q2')}</h4>
                        <p>{t('faq_1_a2')}</p>
                    </div>
                </div>

                <div className="faq-section">
                    <h3>{t('faq_2_title')}</h3>
                    <div className="faq-item">
                        <h4>{t('faq_2_q1')}</h4>
                        <p>{t('faq_2_a1')}</p>
                    </div>
                    <div className="faq-item">
                        <h4>{t('faq_2_q2')}</h4>
                        <p>{t('faq_2_a2')}</p>
                    </div>
                </div>

                <div className="faq-section">
                    <h3>{t('faq_3_title')}</h3>
                    <div className="faq-item">
                        <h4>{t('faq_3_q1')}</h4>
                        <p>{t('faq_3_a1')}</p>
                    </div>
                </div>
            </div>
        </StaticPageLayout>
    );
};
export default FAQ;
