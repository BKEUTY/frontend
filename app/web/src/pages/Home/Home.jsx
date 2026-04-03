import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import './Home.css';
import { Skeleton, ProductCard } from '../../Component/Common';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useProducts } from '../../hooks/useProducts';
import banner1 from '../../Assets/Images/Banners/banner_home_1.png';
import banner2 from '../../Assets/Images/Banners/banner_home_2.png';
import about_image from "../../Assets/Images/Banners/banner_about_us.svg";

const bannerImages = [banner1, banner2];

const Home = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);

    const topRatedApi = useProducts(5);
    const mostReviewedApi = useProducts(5);
    const premiumApi = useProducts(5);
    const availableApi = useProducts(5);

    useEffect(() => {
        topRatedApi.fetchProducts(0, false, null, 'all', 'rating_desc');
        mostReviewedApi.fetchProducts(0, false, null, 'all', 'reviews_desc');
        premiumApi.fetchProducts(0, false, null, 'all', 'price_desc');
        availableApi.fetchProducts(0, false, null, 'all', 'stock_desc');
    }, []);

    const sectionsConfig = [
        { id: 'rating', hook: topRatedApi, title: t('top_rated'), tag: t('tag_top_rated') },
        { id: 'reviews', hook: mostReviewedApi, title: t('most_reviewed'), tag: t('tag_hot') },
        { id: 'price', hook: premiumApi, title: t('premium_products'), tag: t('tag_premium') },
        { id: 'stock', hook: availableApi, title: t('top_in_stock'), tag: t('tag_available') }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);

    return (
        <div className="home-container">
            <div className="home-hero-slider animate-fade-in">
                <div
                    className="slider-wrapper"
                    style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                >
                    {bannerImages.map((img, index) => (
                        <div
                            key={index}
                            className="hero-slide"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                </div>

                <div className="glass-overlay">
                    <h1 className="glass-title">{t('mid_autumn_promo')}</h1>
                    <p className="glass-subtitle">{t('promo_subtitle')}</p>
                    <button className="btn-glass-primary" onClick={() => navigate('/product')}>
                        {t('explore')}
                    </button>
                </div>

                <button className="slider-arrow left" onClick={prevBanner} aria-label="Previous banner">
                    <LeftOutlined />
                </button>
                <button className="slider-arrow right" onClick={nextBanner} aria-label="Next banner">
                    <RightOutlined />
                </button>

                <div className="slider-dots">
                    {bannerImages.map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${currentBanner === idx ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(idx)}
                        />
                    ))}
                </div>
            </div>

            {sectionsConfig.map((section, idx) => {
                const { products, isLoading } = section.hook;
                
                return (
                    <section key={section.id} className={`section-full-width ${idx % 2 !== 0 ? 'bg-gray' : ''} animate-slide-up delay-${(idx + 1) * 100}`}>
                        <h2 className="home-section-title">{section.title}</h2>
                        <div className="home-product-grid">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="product-card skeleton-card">
                                        <Skeleton width="100%" height="220px" />
                                        <div className="skeleton-info-wrap">
                                            <Skeleton width="60%" height="20px" style={{ marginBottom: '8px' }} />
                                            <Skeleton width="80%" height="20px" style={{ marginBottom: '8px' }} />
                                            <Skeleton width="40%" height="20px" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                products.map((item) => (
                                    <ProductCard
                                        key={item.id}
                                        product={{ ...item, tag: section.tag }}
                                        t={t}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                );
            })}

            <section className="section4 animate-slide-up delay-500">
                <div className="section4-content">
                    <div className="section4-text">
                        <h2>{t('brand_story')}</h2>
                        <p>{t('brand_desc')}</p>
                        <button className="btn-explore-brand" onClick={() => navigate('/about')}>
                            {t('explore_more')}
                        </button>
                    </div>
                    <div className="section4-image">
                        <img src={about_image} alt={t('about_us_alt')} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
