import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Home.css';
import Skeleton from '../Component/Common/Skeleton';
import ProductCard from '../Component/Common/ProductCard';
import banner1 from '../Assets/Images/Banners/banner_home_1.png';
import banner2 from '../Assets/Images/Banners/banner_home_2.png';

import about_image from "../Assets/Images/Banners/banner_about_us.svg";


import productApi from '../api/productApi';

const bannerImages = [banner1, banner2];

const Home = () => {
    const { t, language } = useLanguage();

    const [bestSellers, setBestSellers] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const fetchHomeData = async () => {
            setIsLoading(true);
            try {
                // Fetch products for Best Sellers and Suggested
                // Since backend doesn't support specific endpoints yet, we fetch the first page
                const response = await productApi.getAll({ page: 0, size: 10 });
                const fetchedProducts = response.data.content || [];

                // Split products for display
                setBestSellers(fetchedProducts.slice(0, 5));
                setSuggestedProducts(fetchedProducts.length > 5 ? fetchedProducts.slice(5, 10) : fetchedProducts);

            } catch (error) {
                console.error("Failed to fetch home data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Auto-slide every 30 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 30000); // 30 seconds

        return () => clearInterval(timer);
    }, []);

    const nextBanner = () => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    };

    const prevBanner = () => {
        setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    };



    return (
        <div className="home-container">
            {/* Sub Header for Categories - As seen in image */}
            {/* Hero Section Slider */}
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

                {/* Fixed Overlay Content */}
                <div className="glass-overlay">
                    <h1 className="glass-title">{t('mid_autumn_promo')}</h1>
                    <p className="glass-subtitle">{t('promo_subtitle')}</p>
                    <button className="btn-glass-primary">{t('explore')}</button>
                </div>

                <button className="slider-arrow left" onClick={prevBanner}>&#10094;</button>
                <button className="slider-arrow right" onClick={nextBanner}>&#10095;</button>

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

            {/* Best Sellers */}
            <section className="section-full-width animate-slide-up delay-100">
                <h2 className="home-section-title">{t('best_sellers')}</h2>
                <div className="best-seller-grid bento-grid">
                    {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="product-card">
                                <Skeleton width="100%" height="220px" />
                                <div style={{ padding: '20px' }}>
                                    <Skeleton width="60%" height="20px" style={{ marginBottom: '10px' }} />
                                    <Skeleton width="80%" height="20px" style={{ marginBottom: '10px' }} />
                                    <Skeleton width="40%" height="20px" />
                                </div>
                            </div>
                        ))
                    ) : (
                        bestSellers.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                t={t}
                                language={language}
                                onClickData={{
                                    category: t('best_sellers'),
                                    from: '/'
                                }}
                            />
                        )))}
                </div>
            </section>

            {/* Suggested For You - Mocking 10 Items */}
            <section className="section-full-width bg-gray animate-slide-up delay-200">
                <h2 className="home-section-title">{t('section_suggested')}</h2>
                <div className="suggested-grid">
                    {/* Displaying exactly 10 items by duplicating mock data if needed or slicing */}
                    {[...suggestedProducts, ...suggestedProducts].slice(0, 10).map((item, index) => (
                        <ProductCard
                            key={`${item.id}-${index}`}
                            product={item}
                            t={t}
                            language={language}
                            onClickData={{
                                category: t('hot_deals'),
                                from: '/'
                            }}
                        />
                    ))}
                </div>
            </section>

            <section className="section4 animate-slide-up delay-300">
                <div className="section4-content">
                    <div className="section4-text">
                        <h2>{t('brand_story')}</h2>
                        <p>{t('brand_desc')}</p>
                        <button className="btn-explore-brand">{t('explore_more')}</button>
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
