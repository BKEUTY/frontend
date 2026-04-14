import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/store/LanguageContext';
import { Skeleton, ProductCard, SEO } from '@/components/common';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useProducts } from '@/features/products/hooks/useProducts';
import banner1 from '@/assets/images/banners/banner_home_1.png';
import banner2 from '@/assets/images/banners/banner_home_2.png';
import about_image from "@/assets/images/banners/banner_about_us.svg";
import { usePersonalizedRecommendations } from '@/hooks/useRecommendation';
import './Home.css';

const bannerImages = [banner1, banner2];

const Home = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);

    const { data: recData, isLoading: recLoading } = usePersonalizedRecommendations();

    const topRatedApi = useProducts(5);
    const mostReviewedApi = useProducts(5);
    const premiumApi = useProducts(5);
    const availableApi = useProducts(5);

    useEffect(() => {
        topRatedApi.fetchProducts(1, false, null, 'all', 'rating_desc');
        mostReviewedApi.fetchProducts(1, false, null, 'all', 'reviews_desc');
        premiumApi.fetchProducts(1, false, null, 'all', 'price_desc');
        availableApi.fetchProducts(1, false, null, 'all', 'stock_desc');
    }, []);

    const sectionsConfig = [
        { id: 'rating', hook: topRatedApi, title: t('top_rated') },
        { id: 'reviews', hook: mostReviewedApi, title: t('most_reviewed') },
        { id: 'price', hook: premiumApi, title: t('premium_products') },
        { id: 'stock', hook: availableApi, title: t('top_in_stock') }
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
            <SEO 
                title={t('home')} 
                description={t('brand_tagline')}
            />
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

                <button className="slider-arrow left" onClick={prevBanner}>
                    <LeftOutlined />
                </button>
                <button className="slider-arrow right" onClick={nextBanner}>
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

            {(recLoading || recData?.recommendedProducts?.length > 0) && (
                <section className="home-section ai-personalized-section animate-fade-in">
                    <div className="home-section-content">
                        <div className="home-section-header">
                            <h2 className="home-section-title ai-title">
                                {t('personalized_for_you') || 'Gợi ý cho riêng bạn ✨'}
                            </h2>
                        </div>
                        <div className="home-product-grid">
                            {recLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <ProductCard key={`ai-shimmer-${i}`} isLoading={true} />
                                ))
                            ) : (
                                recData.recommendedProducts.map((item) => (
                                    <ProductCard
                                        key={item.productId}
                                        product={item}
                                        t={t}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}

            {sectionsConfig.map((section, idx) => {
                const { products, isLoading } = section.hook;
                
                return (
                    <section key={section.id} className={`home-section ${idx % 2 !== 0 ? 'bg-light' : ''}`}>
                        <div className="home-section-content">
                            <div className="home-section-header">
                                <h2 className="home-section-title">{section.title}</h2>
                            </div>
                            <div className="home-product-grid">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <ProductCard key={`shimmer-${i}`} isLoading={true} />
                                    ))
                                ) : (
                                    products.map((item) => (
                                        <ProductCard
                                            key={item.productId}
                                            product={item}
                                            t={t}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                );
            })}

            <section className="home-brand-section">
                <div className="brand-content-wrapper">
                    <div className="brand-text-box">
                        <h2>{t('brand_story')}</h2>
                        <p>{t('brand_desc')}</p>
                        <button className="btn-explore-brand" onClick={() => navigate('/about')}>
                            {t('explore_more')}
                        </button>
                    </div>
                    <div className="brand-image-box">
                        <img src={about_image} alt={t('about_us_alt')} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
