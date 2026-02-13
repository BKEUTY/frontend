import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import './LandingPage.css';
import banner1 from '../../Assets/Images/Banners/banner_home_1.png';
import banner2 from '../../Assets/Images/Banners/banner_home_2.png';

const images = [banner1, banner2];

const LandingPage = () => {
    const { t } = useLanguage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="landing-page">
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
                    <h1 className="glass-title">{t('welcome_landing')} <span className="brand-name">BKEUTY</span></h1>
                    <Link to="/login" className="btn-glass-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>{t('login')}</Link>
                    <p className="glass-subtitle" style={{ marginTop: '20px' }}>
                        {t('no_account')} <Link to="/register" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'underline' }}>{t('register')}</Link>
                    </p>
                </div>

                <div className="slider-controls">
                    <button className="slider-arrow left" onClick={prevImage}>&#10094;</button>
                    <button className="slider-arrow right" onClick={nextImage}>&#10095;</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

