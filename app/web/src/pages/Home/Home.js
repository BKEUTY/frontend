import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import './Home.css';
import { Skeleton, ProductCard } from '../../Component/Common';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import banner1 from '../../Assets/Images/Banners/banner_home_1.png';
import banner2 from '../../Assets/Images/Banners/banner_home_2.png';
import about_image from "../../Assets/Images/Banners/banner_about_us.svg";
import productApi from '../../api/productApi';

const bannerImages = [banner1, banner2];

const Home = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);

    const fetchHomeData = async () => {
        try {
            const response = await productApi.getAll({ page: 0, size: 10 });
            const rawContent = response.data.content;

            return rawContent.map(p => ({
                ...p
            }));
        } catch (error) {
            return [];
        }
    };

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['homeProducts'],
        queryFn: fetchHomeData,
        staleTime: 5 * 60 * 1000,
    });

    const bestSellers = products.slice(0, 5);
    const suggestedProducts = products.slice(5, 10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 30000);
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
                        >
                        </div>
                    ))}
                </div>

                <div className="glass-overlay">
                    <h1 className="glass-title">{t('mid_autumn_promo')}</h1>
                    <p className="glass-subtitle">{t('promo_subtitle')}</p>
                    <button className="btn-glass-primary" onClick={() => navigate('/product')}>{t('explore')}</button>
                </div>

                <button className="slider-arrow left" onClick={prevBanner}><LeftOutlined /></button>
                <button className="slider-arrow right" onClick={nextBanner}><RightOutlined /></button>

                <div className="slider-dots">
                    {bannerImages.map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${currentBanner === idx ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(idx)}
                        ></span>
                    ))}
                </div>
            </div>

            <section className="section-full-width animate-slide-up delay-100">
                <h2 className="home-section-title">{t('best_sellers')}</h2>
                <div className="best-seller-grid bento-grid">
                    {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="product-card" style={{ border: '1px solid #eee', borderRadius: 12 }}>
                                <Skeleton width="100%" height="220px" />
                                <div className="skeleton-info-wrap">
                                    <Skeleton width="60%" height="20px" className="skeleton-line-2" />
                                    <Skeleton width="80%" height="20px" className="skeleton-line-2" />
                                    <Skeleton width="40%" height="20px" />
                                </div>
                            </div>
                        ))
                    ) : (
                        bestSellers.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={{ ...item, tag: t('best_sellers') }}
                                t={t}
                            />
                        )))}
                </div>
            </section>

            <section className="section-full-width bg-gray animate-slide-up delay-200">
                <h2 className="home-section-title">{t('section_suggested')}</h2>
                <div className="suggested-grid">
                    {suggestedProducts.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={{ ...item, tag: t('hot_deals') }}
                            t={t}
                        />
                    ))}
                </div>
            </section>

            <section className="section4 animate-slide-up delay-300">
                <div className="section4-content">
                    <div className="section4-text">
                        <h2>{t('brand_story')}</h2>
                        <p>{t('brand_desc')}</p>
                        <button className="btn-explore-brand" onClick={() => navigate('/about')}>{t('explore_more')}</button>
                    </div>

                    <div className="section4-image">
                        <img src={about_image} alt="About Us" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
