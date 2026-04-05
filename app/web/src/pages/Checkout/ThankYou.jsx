import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleFilled } from '@ant-design/icons';
import { CButton } from '../../Component/Common';
import { useLanguage } from '../../i18n/LanguageContext';
import NotFound from '../../Component/ErrorPages/NotFound';
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
                    <CButton type="outline" onClick={() => navigate('/')} className="btn-action">
                        {t('back_to_home')}
                    </CButton>
                </div>
            </div>
        </div>
    );
}
