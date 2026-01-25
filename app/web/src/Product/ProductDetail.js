import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useNotification } from '../Context/NotificationContext';
import { useCart } from '../Context/CartContext';
import './ProductDetail.css';
import { FaStar, FaCheckCircle, FaRegHeart, FaRegComment } from 'react-icons/fa';
import best_selling_image from "../Assets/Images/Products/product_placeholder.svg";
import starIcon from "../Assets/Images/Icons/icon_star.svg";
import Pagination from "../Component/Common/Pagination";
import ProductCard from "../Component/Common/ProductCard";
import Skeleton from "../Component/Common/Skeleton";
import productApi from '../api/productApi';

export default function ProductDetail() {
    const { id } = useParams();
    const { t, language } = useLanguage(); // Get language ('en', 'vi')
    const notify = useNotification();
    const { addToCart } = useCart();
    const location = useLocation();

    // Determine breadcrumb category based on state passed from navigation or default
    const categoryName = location.state?.category || t('all_products');
    const categoryLink = location.state?.from || '/product';

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('details');
    const [selectedSize, setSelectedSize] = useState("50ml");
    const [mainImage, setMainImage] = useState(best_selling_image);
    const [quantity, setQuantity] = useState(1);

    // Initial load
    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                // Fetch basic info from backend
                // Since backend is limited (missing reviews, sizes, specific details), we use a mock template
                // and override key fields with backend data.
                const response = await productApi.getAll({ page: 0, size: 100 });
                const found = response.data.content.find(p => p.productId === id || p.id === id);

                if (found) {
                    const mergedData = {
                        id: found.id || found.productId,
                        name: found.name,
                        brand: "BKEUTY", // Backend missing brand
                        price: found.price,
                        original_price: found.price * 1.1, // Fake original
                        rating: 4.8,
                        reviews_count: 124,
                        images: [
                            found.image || best_selling_image,
                            best_selling_image,
                            best_selling_image
                        ],
                        sizes: ["30ml", "50ml", "75ml"],
                        content: { // Keep mock content
                            en: {
                                description: found.description || "Product description...",
                                details: "Full details...",
                                application: "Apply daily...",
                                ingredients: "Aqua, Glycerin...",
                                advance: "Advanced formula...",
                                benefits_list: ["Revitalizing", "Repairing"]
                            },
                            vi: {
                                description: found.description || "Mô tả sản phẩm...",
                                details: "Chi tiết...",
                                application: "Sử dụng hàng ngày...",
                                ingredients: "Nước, Glycerin...",
                                advance: "Công thức tiên tiến...",
                                benefits_list: ["Tái Tạo", "Phục Hồi"]
                            }
                        },
                        reviews: [] // Keep empty or mock
                    };
                    setProductData(mergedData);
                    setMainImage(mergedData.images[0]);
                }
            } catch (err) {
                console.error("Error fetching product detail:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Review Pagination
    const [reviewPage, setReviewPage] = useState(0);
    const reviewsPerPage = 5;
    const totalReviewPages = productData ? Math.ceil(productData.reviews.length / reviewsPerPage) : 0;
    const displayedReviews = productData ? productData.reviews.slice(reviewPage * reviewsPerPage, (reviewPage + 1) * reviewsPerPage) : [];

    // Helper to get current locale content safely
    const getLocalContent = (key) => {
        if (!productData) return "";
        return productData.content[language === 'vi' ? 'vi' : 'en'][key] || productData.content['en'][key];
    };

    if (isLoading || !productData) return (
        <div className="product-detail-page">
            <div className="product-top-section">
                <Skeleton width="50%" height="450px" style={{ marginRight: '20px' }} />
                <div style={{ flex: 1 }}>
                    <Skeleton width="40%" height="20px" style={{ marginBottom: '10px' }} />
                    <Skeleton width="80%" height="40px" style={{ marginBottom: '20px' }} />
                    <Skeleton width="30%" height="30px" style={{ marginBottom: '20px' }} />
                    <Skeleton width="100%" height="100px" style={{ marginBottom: '20px' }} />
                    <Skeleton width="100%" height="50px" />
                </div>
            </div>
        </div>
    );


    const handleQuantityChange = (val) => {
        const newVal = quantity + val;
        if (newVal >= 1) setQuantity(newVal);
    };

    const handleAddToCart = () => {
        addToCart({
            id: productData.id,
            name: productData.name,
            price: productData.price, // Keep as number
            image: mainImage,
            quantity: quantity
        });
        notify(t('add_cart_success'), "success");
    };

    const tabs = [
        { id: 'details', label: t('product_details') },
        { id: 'application', label: t('how_to_apply') },
        { id: 'ingredients', label: t('ingredients') },
        { id: 'advance', label: t('what_makes_it_advance') },
        { id: 'reviews', label: `${t('reviews')} (${productData.reviews_count})` },
    ];

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to={categoryLink} state={{ fromDetail: true }}>{categoryName}</Link>
                <span className="divider">/</span>
                <span className="current">{productData.name}</span>
            </div>

            <div className="product-top-section">
                {/* Left: Gallery */}
                <div className="product-gallery">
                    <div className="thumbnail-list">
                        {productData.images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`thumb-item ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                            >
                                <img src={img} alt={`Thumb ${idx}`} />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={mainImage} alt={productData.name} />
                        {/* Optional Tag Overlay */}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="product-info-side">
                    <div className="brand-label">{productData.brand}</div>
                    <h1 className="detail-title">{productData.name}</h1>

                    <div className="detail-tags">
                        <div className="rating-container">
                            <div className="star-icon" style={{
                                width: '18px', height: '18px',
                                backgroundColor: '#ffc107',
                                mask: `url(${starIcon}) no-repeat center / contain`,
                                WebkitMask: `url(${starIcon}) no-repeat center / contain`
                            }}></div>
                            <strong>{productData.rating}</strong>/5 ({productData.reviews_count} {t('reviews')})
                        </div>
                        <span style={{ color: '#ddd' }}>|</span>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>{t('sku')}{id}</span>
                    </div>

                    <div className="detail-price">
                        {productData.price.toLocaleString("vi-VN")}đ
                        <span className="original-price">{productData.original_price.toLocaleString("vi-VN")}đ</span>
                    </div>

                    <p className="product-short-desc">
                        {getLocalContent('description')}
                    </p>

                    <div className="size-selector">
                        <span className="size-label">{t('sizes')}: <strong>{selectedSize}</strong></span>
                        <div className="size-options">
                            {productData.sizes.map(size => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="actions">
                        <div className="input-quantity-wrapper">
                            <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                            <input type="text" className="qty-input" value={quantity} readOnly />
                            <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                        </div>
                        <button className="btn-add-bag" onClick={handleAddToCart}>
                            {t('add_to_bag')} - {(productData.price * quantity).toLocaleString("vi-VN")}đ
                        </button>
                        <button className="btn-wishlist">♡</button>
                    </div>

                    <ul className="features-list">
                        <li><span>✔</span> {t('formula')}: {t(language === 'vi' ? '92% Thành phần tự nhiên' : '92% Natural Origin Ingredients')}</li>
                        {getLocalContent('benefits_list').map((benefit, i) => (
                            <li key={i}><span>✔</span> {benefit}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="product-content-tabs">
                <div className="tab-headers">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="tab-body">
                    {activeTab === 'details' && (
                        <div className="tab-content">
                            <h3>{t('product_details')}</h3>
                            <p>{getLocalContent('details')}</p>
                        </div>
                    )}
                    {activeTab === 'application' && (
                        <div className="tab-content">
                            <h3>{t('how_to_apply')}</h3>
                            {getLocalContent('application').split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    )}
                    {activeTab === 'ingredients' && (
                        <div className="tab-content">
                            <h3>{t('ingredients')}</h3>
                            <p>{getLocalContent('ingredients')}</p>
                        </div>
                    )}
                    {activeTab === 'advance' && (
                        <div className="tab-content">
                            <h3>{t('what_makes_it_advance')}</h3>
                            <p>{getLocalContent('advance')}</p>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="tab-content review-tab-content">
                            {/* Visual-First: Review Summary Card */}
                            <div className="review-dashboard">
                                <div className="rating-overview">
                                    <span className="big-score">{productData.rating}</span>
                                    <div className="star-stack">
                                        <div className="star-row">★★★★★</div>
                                        <span className="total-reviews">{productData.reviews_count} {t('reviews')}</span>
                                    </div>
                                </div>
                                <div className="rating-bars">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="bar-row">
                                            <span className="star-label">{star} ★</span>
                                            <div className="progress-bg">
                                                <div className="progress-fi" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-write-review">{t('write_review')}</button>
                            </div>

                            {/* Contextual Relevance: Filter Tabs (Mock) */}
                            <div className="review-filters">
                                <button className="filter-chip active">{t('all')}</button>
                                <button className="filter-chip">{t('filter_with_media')} (24)</button>
                                <button className="filter-chip">{t('filter_5_star')} (80)</button>
                            </div>

                            <div className="review-list-container">
                                {displayedReviews.map((rev, i) => (
                                    <div key={i} className="review-card">
                                        <div className="review-user-avatar">
                                            {rev.user.charAt(0)}
                                        </div>
                                        <div className="review-content-body">
                                            <div className="review-header-row">
                                                <span className="reviewer-name">{rev.user}</span>
                                                <span className="review-time">{rev.date}</span>
                                            </div>
                                            <div className="review-stars-row">
                                                {[...Array(5)].map((_, starIdx) => (
                                                    <span key={starIdx} className={`rv-star ${starIdx < rev.rating ? 'filled' : ''}`}>
                                                        <FaStar />
                                                    </span>
                                                ))}
                                                {rev.verified && <span className="verified-tag"><FaCheckCircle className="icon-check" /> {t('verified_purchase')}</span>}
                                            </div>
                                            <div className="review-text">
                                                {rev.content}
                                            </div>

                                            {/* Action Buttons: Like & Comment */}
                                            <div className="review-actions">
                                                <button className="action-btn">
                                                    <FaRegHeart className="icon-action" /> {t('like') || 'Like'}
                                                </button>
                                                <button className="action-btn">
                                                    <FaRegComment className="icon-action" /> {t('comment') || 'Comment'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <Pagination
                                page={reviewPage}
                                totalPages={totalReviewPages}
                                onPageChange={setReviewPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Recommendations (Mockup) */}
            <div className="recommendations-section">
                <h2 className="section-title">{t('related_products')}</h2>
                {/* Reuse Product Grid Logic or Static Items */}
                <div className="product-grid related-products-grid">
                    {/* Mock 5 items */}
                    {[1, 2, 3, 4, 5].map(i => {
                        const relatedProduct = {
                            id: i,
                            name: "Capture Totale Cell Energy",
                            brand: "Dior",
                            price: 3500000,
                            image: best_selling_image,
                            rating: 4.8,
                            sold: 120
                        };

                        const clickState = {
                            category: language === 'vi' ? 'Gợi ý' : 'Related Products',
                            from: location.pathname
                        };

                        return (
                            <ProductCard
                                key={i}
                                product={relatedProduct}
                                t={t}
                                language={language}
                                onClickData={clickState}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
