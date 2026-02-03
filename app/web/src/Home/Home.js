import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Home.css';
import Skeleton from '../Component/Common/Skeleton';
import ProductCard from '../Component/Common/ProductCard';
import banner1 from '../Assets/Images/Banners/banner_home_1.png';
import banner2 from '../Assets/Images/Banners/banner_home_2.png';

import about_image from "../Assets/Images/Banners/banner_about_us.svg";



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


                const mockProducts = [
                    { id: 1, name: 'Kem Dưỡng Ẩm BKEUTY Hydra-Deep', price: 450000, brand: 'BKEUTY', image: null, rating: 4.9, sold: 1000, tag: 'HOT' },
                    { id: 2, name: 'Son Môi Lì Mịn Môi Matte Lipstick', price: 320000, brand: 'MAC', image: null, rating: 4.7, sold: 500, discount: '10%' },
                    { id: 3, name: 'Nước Hoa Hồng Dịu Nhẹ Toner', price: 150000, brand: 'Laroche Posay', image: null, rating: 4.5, sold: 200 },
                    { id: 4, name: 'Serum Vitamin C Sáng Da Clinical', price: 550000, brand: 'Obagi', image: null, rating: 4.8, sold: 300, tag: 'NEW' },
                    { id: 5, name: 'Kem Chống Nắng Phổ Rộng Perfect UV', price: 420000, brand: 'Anessa', image: null, rating: 4.6, sold: 850 },
                    { id: 6, name: 'Mặt Nạ Giấy Cấp Ẩm Tea Tree', price: 25000, brand: 'Innisfree', image: null, rating: 4.9, sold: 5000 },
                    { id: 7, name: 'Tẩy Trang Cho Da Nhạy Cảm Sensibio', price: 180000, brand: 'Bioderma', image: null, rating: 4.7, sold: 1200 },
                    { id: 8, name: 'Xịt Khoáng Cấp Nước Mineral 89', price: 280000, brand: 'Vichy', image: null, rating: 4.5, sold: 600 },
                    { id: 9, name: 'Sữa Rửa Mặt Tạo Bọt Foaming Cleanser', price: 120000, brand: 'Cerave', image: null, rating: 4.6, sold: 900 },
                    { id: 10, name: 'Dầu Dưỡng Tóc Mềm Mượt Treatment', price: 350000, brand: 'Moroccanoil', image: null, rating: 4.8, sold: 400 }
                ];

                const fetchedProducts = mockProducts;


                setBestSellers(fetchedProducts.slice(0, 5));
                setSuggestedProducts(fetchedProducts.slice(5, 10));

            } catch (error) {
                console.error("Failed to fetch home data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 30000);

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

            <section className="section-full-width bg-gray animate-slide-up delay-200">
                <h2 className="home-section-title">{t('section_suggested')}</h2>
                <div className="suggested-grid">

                    {suggestedProducts.map((item, index) => (
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
