import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './LandingPage.css';
import banner_img from '../Assets/Images/Banners/bkeuty_banner.png';

const LandingPage = () => {
    const { t } = useLanguage();

    return (
        <div className="landing-page">
            <div className="landing-hero" style={{
                backgroundImage: `url(${banner_img})`,
                backgroundColor: '#2c2c2c'
            }}>
                <div className="landing-content">
                    <h1 className="landing-title">{t('welcome_landing')} <span className="brand-name">BKEUTY</span></h1>
                    <Link to="/login" className="landing-btn-login">{t('login')}</Link>
                    <p className="landing-register-text">
                        {t('no_account')} <Link to="/register">{t('register')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
