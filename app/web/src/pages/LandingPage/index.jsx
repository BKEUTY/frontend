import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/store/LanguageContext';
import { useAuth } from '@/store/AuthContext';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { SEO } from '@/components/common';
import './LandingPage.css';
import banner1 from '@/assets/images/banners/banner_home_1.jpg';
import banner2 from '@/assets/images/banners/banner_home_2.jpg';

const images = [banner1, banner2];

const LandingPage = () => {
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="landing-page">
            <SEO title={t('welcome_landing')} description={t('promo_subtitle')} />
            <div className="landing-hero">
                <div
                    className="slider-wrapper"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="hero-slide"
                            style={{ backgroundImage: `url(${img})` }}
                        ></div>
                    ))}
                </div>

                <div className="glass-overlay">
                    <h1 className="glass-title">
                        {t('welcome_landing')}
                        <span className="brand-name">BKEUTY</span>
                    </h1>

                    {isAuthenticated ? (
                        <Link to="/product" className="btn-glass-primary">
                            {t('view_all')}
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn-glass-primary">
                                {t('login')}
                            </Link>
                            <div className="auth-links">
                                {t('no_account')}{' '}
                                <Link to="/register" className="register-link">
                                    {t('register')}
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="slider-controls">
                    <button className="slider-arrow left" onClick={prevImage}>
                        <LeftOutlined />
                    </button>
                    <button className="slider-arrow right" onClick={nextImage}>
                        <RightOutlined />
                    </button>
                </div>

                <div className="slider-dots">
                    {images.map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${currentImageIndex === idx ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
