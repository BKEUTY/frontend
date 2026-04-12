import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleFilled } from '@ant-design/icons';
import { CButton, SEO } from '@/components/common';
import { useLanguage } from '@/store/LanguageContext';
import NotFound from '@/pages/NotFound';
import './ThankYou.css';

export default function ThankYou() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    if (!orderId) {
        return <NotFound />;
    }

    return (
        <div className="thankyou-wrapper">
            <SEO title={t('thank_you_title')} />
            <div className="thankyou-card">
                <div className="success-icon-wrapper">
                    <CheckCircleFilled className="success-icon" />
                </div>
                
                <h1 className="thankyou-title">{t('thank_you_title')}</h1>
                <p className="thankyou-desc">{t('thank_you_desc')}</p>
                
                <div className="order-reference">
                    <span>{t('order_id')}:</span>
                    <strong>DH{orderId}</strong>
                </div>
                
                <div className="thankyou-actions">
                    <CButton type="primary" onClick={() => navigate('/account/orders')} className="btn-action">
                        {t('view_orders')}
                    </CButton>
                    <CButton type="outline" onClick={() => navigate('/product')} className="btn-action">
                        {t('continue_shopping')}
                    </CButton>
                </div>
            </div>
        </div>
    );
}
