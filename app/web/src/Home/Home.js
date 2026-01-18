import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Home.css';
import banner1 from '../Assets/Images/Banners/banner_home_1.png';
import banner2 from '../Assets/Images/Banners/banner_home_2.png';
import product_img from "../Assets/Images/Products/product_placeholder.svg";
import about_image from "../Assets/Images/Banners/banner_about_us.svg";
import starIcon from "../Assets/Images/Icons/icon_star.svg";

const bannerImages = [banner1, banner2];

// Mock data to match image

const bestSellers = [
    { id: 1, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img },
    { id: 2, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img },
    { id: 3, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img },
    { id: 4, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img },
    { id: 5, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img }
];

const suggestedProducts = [
    { id: 1, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán', image: product_img },
    { id: 2, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán', image: product_img },
    { id: 3, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán', image: product_img },
    { id: 4, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán', image: product_img },
    { id: 5, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán', image: product_img }
];

const Home = () => {
    const { t } = useLanguage();
    const [currentBanner, setCurrentBanner] = useState(0);

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
            <div className="home-hero-slider">
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
            <section className="section-full-width">
                <h2 className="home-section-title">{t('best_sellers')}</h2>
                <div className="best-seller-grid">
                    {bestSellers.map((item) => (
                        <div key={item.id} className="product-card">
                            <div className="card-badges" style={{ top: '10px', left: '10px' }}>
                                <span className="badge-red">HOT</span>
                            </div>
                            <div className="card-image-wrapper">
                                <img src={item.image} alt={item.name} />
                                <button className="carousel-arrow arrow-left-card">❮</button>
                                <button className="carousel-arrow arrow-right-card">❯</button>
                            </div>
                            <div className="card-info">
                                <p className="card-brand">Obagi</p>
                                <h3 className="card-name">{item.name}</h3>
                                <div className="card-meta">
                                    <span className="star-icon" style={{ maskImage: `url(${starIcon})`, WebkitMaskImage: `url(${starIcon})` }}></span>
                                    <span className="rating">{item.rating}</span>
                                    <span className="sold">({item.sold})</span>
                                </div>
                                <div className="card-price">{item.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Suggested For You - Mocking 10 Items */}
            <section className="section-full-width bg-gray">
                <h2 className="home-section-title">{t('section_suggested')}</h2>
                <div className="suggested-grid">
                    {/* Displaying exactly 10 items by duplicating mock data if needed or slicing */}
                    {[...suggestedProducts, ...suggestedProducts].slice(0, 10).map((item, index) => (
                        <div key={`${item.id}-${index}`} className="product-card">
                            <div className="card-badges">
                                <span className="badge-red">{t('so_hot')}</span>
                                <span className="badge-yellow">-{item.discount}</span>
                            </div>
                            <div className="card-image-wrapper">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="card-info">
                                <p className="card-brand">Anessa</p>
                                <h3 className="card-name">{item.name}</h3>
                                <div className="card-meta">
                                    <span className="star-icon" style={{ maskImage: `url(${starIcon})`, WebkitMaskImage: `url(${starIcon})` }}></span>
                                    <span className="rating">{item.rating}</span>
                                    <span className="sold">({item.sold})</span>
                                </div>
                                <div className="price-row">
                                    <span className="old-price">{item.oldPrice}</span>
                                    <span className="new-price">{item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section4">
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
