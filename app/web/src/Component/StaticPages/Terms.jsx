import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import StaticPageLayout from './StaticPageLayout';

export const Terms = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('terms')} className="terms-page">
            <div className="terms-section">
                <h3>1. {t('terms_1_title')}</h3>
                <p>{t('terms_1_content')}</p>
            </div>

            <div className="terms-section">
                <h3>2. {t('terms_2_title')}</h3>
                <p>{t('terms_2_content')}</p>
            </div>

            <div className="terms-section">
                <h3>3. {t('terms_3_title')}</h3>
                <p>{t('terms_3_content')}</p>
            </div>
        </StaticPageLayout>
    );
};
