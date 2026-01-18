import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Home.css';
import hero_bg from '../Assets/Images/Banners/image_84.svg'; // Reuse or placeholder
// We need product images. Reusing existing for now.
import product_img from "../Assets/Images/Products/product image.svg";
import about_image from "../Assets/Images/Banners/Frame 26085715.svg";

// Mock data to match image
// Mock data to match image

const bestSellers = [
    { id: 1, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img },
    { id: 2, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img },
    { id: 3, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img },
    { id: 4, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán', image: product_img }
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

    return (
        <div className="home-container">
            {/* Sub Header for Categories - As seen in image */}
            <div className="category-bar">
                <div className="category-list">
                    <span className="cat-item">☰ {t('categories')}</span> |
                    <span className="cat-item">{t('brands')}</span> |
                    <span className="cat-item">{t('new_arrivals')}</span> |
                    <span className="cat-item">{t('best_sellers')}</span> |
                    <span className="cat-item">{t('hot_deals')}</span> |
                    <span className="cat-item">{t('bkeuty_deals')}</span>
                </div>
                <div className="search-bar-mini">
                    <input type="text" placeholder={t('search_hint')} />
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero-section" style={{ backgroundImage: `url("${hero_bg}")` }}>
                {/* Overlay gradient usually handled in CSS */}
                <div className="hero-content">
                    <h1 className="hero-title">{t('mid_autumn_promo')}</h1>
                    <p className="hero-subtitle">{t('promo_subtitle')}</p>
                    <button className="btn-hero-primary">{t('shop_now')}</button>
                </div>
                <button className="carousel-arrow arrow-left">❮</button>
                <button className="carousel-arrow arrow-right">❯</button>
            </section>

            {/* Best Sellers */}
            <section className="section-full-width">
                <h2 className="home-section-title">{t('best_sellers')}</h2>
                <div className="home-product-grid">
                    {bestSellers.map((item) => (
                        <div key={item.id} className="product-card">
                            <div className="card-image-wrapper">
                                <img src={item.image} alt={item.name} />
                                <button className="carousel-arrow arrow-left-card">❮</button>
                                <button className="carousel-arrow arrow-right-card">❯</button>
                            </div>
                            <div className="card-info">
                                <p className="card-brand">Obagi</p>
                                <h3 className="card-name">{item.name}</h3>
                                <div className="card-meta">
                                    <span className="rating">⭐ {item.rating}</span>
                                    <span className="sold">({item.sold})</span>
                                </div>
                                <div className="card-price">{item.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Suggested For You */}
            <section className="section-full-width bg-gray">
                <h2 className="home-section-title">{t('section_suggested')}</h2>
                <div className="suggested-grid">
                    {suggestedProducts.map((item) => (
                        <div key={item.id} className="product-card suggested-card">
                            <div className="card-badges">
                                <span className="badge-red">{t('so_hot')}</span>
                                <span className="badge-yellow">-{item.discount}</span>
                            </div>
                            <img src={item.image} alt={item.name} className="suggested-img" />
                            <div className="card-info">
                                <p className="card-brand">Anessa</p>
                                <h3 className="card-name">{item.name}</h3>
                                <div className="card-meta">
                                    <span className="rating">⭐ {item.rating} ({item.sold})</span>
                                </div>
                                <div className="price-row">
                                    <span className="old-price">{item.oldPrice}</span>
                                    <span className="new-price">{item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate row to simulate grid */}
                    {suggestedProducts.map((item) => (
                        <div key={`dup-${item.id}`} className="product-card suggested-card">
                            <div className="card-badges">
                                <span className="badge-red">{t('so_hot')}</span>
                                <span className="badge-yellow">-{item.discount}</span>
                            </div>
                            <img src={item.image} alt={item.name} className="suggested-img" />
                            <div className="card-info">
                                <p className="card-brand">Anessa</p>
                                <h3 className="card-name">{item.name}</h3>
                                <div className="card-meta">
                                    <span className="rating">⭐ {item.rating} ({item.sold})</span>
                                </div>
                                <div className="price-row">
                                    <span className="old-price">{item.oldPrice}</span>
                                    <span className="new-price">{item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button className="btn-view-more">Xem Thêm</button>
                </div>
            </section>

            <section className="section4">
                <section className="section4_col1">
                    <h1>{t('brand_story')}</h1>
                    <p>{t('brand_desc')}</p>
                    <button className="section4_col1_bt button">{t('explore')}</button>
                </section>
                <section className="section4_col2">
                    <img className="ablout_image" src={about_image} alt="About Us" />
                </section>
            </section>
        </div>
    );
};

export default Home;
