import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNotification } from '../../Context/NotificationContext';
import { useCart } from '../../Context/CartContext';
import './ProductDetail.css';
import { StarFilled, CheckCircleFilled, HeartOutlined, MessageOutlined, ShoppingOutlined } from '@ant-design/icons';
import { CButton, Pagination, ProductCard, Skeleton } from '../../Component/Common';
import { Tag } from 'antd';
import productApi from '../../api/productApi';
import { getImageUrl } from '../../api/axiosClient';
import NotFound from '../../Component/ErrorPages/NotFound';

import dummy1 from '../../Assets/Images/Products/product_dummy_1.jpg';
import dummy2 from '../../Assets/Images/Products/product_dummy_2.jpg';
import dummy3 from '../../Assets/Images/Products/product_dummy_3.jpg';
import dummy4 from '../../Assets/Images/Products/product_dummy_4.jpg';
import dummy5 from '../../Assets/Images/Products/product_dummy_5.svg';

const dummyImages = [dummy1, dummy2, dummy3, dummy4, dummy5];
const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

export default function ProductDetail() {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const notify = useNotification();
    const { addToCart } = useCart();

    const productId = location.state?.productId ?? null;
    const fallbackImg = useMemo(() => getRandomImage(), []);

    const resolveHasDiscount = (originPrice, promotionPrice) =>
        originPrice > 0 && promotionPrice > 0 && promotionPrice < originPrice;

    const [productData, setProductData] = useState(null);
    // const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [activeTab, setActiveTab] = useState('details');
    const [selectedOptions, setSelectedOptions] = useState({});
    const [stockQuantity, setStockQuantity] = useState(0);
    const [mainImage, setMainImage] = useState(fallbackImg);
    const [quantity, setQuantity] = useState(1);
    const [reviewPage, setReviewPage] = useState(0);
    const reviewsPerPage = 5;

    const [currentPrice, setCurrentPrice] = useState({ originPrice: 0, promotionPrice: 0, hasDiscount: false });

    const galleryImages = useMemo(() => {
        if (!productData) return [];
        const variantImage = productData.variants?.find(v => v.id === productData.id)?.productImageUrl;
        const images = [
            productData.image ? getImageUrl(productData.image) : fallbackImg,
            variantImage ? getImageUrl(variantImage) : getRandomImage()
        ].filter(Boolean);

        const uniqueImages = [...new Set(images)];
        if (uniqueImages.length < 2) uniqueImages.push(getRandomImage());

        return uniqueImages;
    }, [productData, fallbackImg]);

    useEffect(() => {
        if (galleryImages.length > 0) setMainImage(galleryImages[0]);
    }, [galleryImages]);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsError(false);
            setIsLoading(true);
            try {
                let responseData = null;

                if (productId) {
                    responseData = (await productApi.getById(productId)).data;
                } else if (slug) {
                    responseData = (await productApi.getByName(slug)).data;
                }

                if (!responseData) throw new Error('Product not found');

                setCurrentPrice({
                    originPrice: responseData.originPrice,
                    promotionPrice: responseData.promotionPrice,
                    hasDiscount: resolveHasDiscount(responseData.originPrice, responseData.promotionPrice),
                });

                const mergedData = {
                    ...responseData,
                    rating: 4.8,
                    reviews_count: 0,
                    content: {
                        en: {
                            application: '1. Cleanse your skin.\n2. Apply a proper amount.',
                            ingredients: 'Aqua, Glycerin, Botanical Extracts.',
                        },
                        vi: {
                            application: '1. Làm sạch da.\n2. Thoa một lượng vừa đủ.',
                            ingredients: 'Nước khoáng, Glycerin, Chiết xuất thảo mộc.',
                        },
                    },
                    reviews: [],
                };

                setProductData(mergedData);

                const targetVariant = mergedData.variants?.find(v => v.id === mergedData.id) || mergedData.variants?.[0];
                setSelectedOptions(targetVariant?.variantOptions || {});
                setStockQuantity(targetVariant?.stockQuantity || 0);

            } catch (err) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId, slug, fallbackImg]);

    const findMatchedVariant = (options) => {
        if (!productData?.variants) return null;
        const normalize = (val) => val?.toString().toLowerCase().trim();
        return productData.variants.find(v => {
            if (!v.variantOptions) return false;
            return Object.entries(options).every(([key, value]) =>
                normalize(v.variantOptions[key]) === normalize(value)
            );
        });
    };

    const handleOptionSelect = (optName, val) => {
        if (!productData?.variants) return;

        const newSelectedOptions = { ...selectedOptions, [optName]: val };
        setSelectedOptions(newSelectedOptions);

        const matchedVariant = findMatchedVariant(newSelectedOptions);

        if (matchedVariant) {
            setStockQuantity(matchedVariant.stockQuantity);
            
            if (matchedVariant.id !== productData.id) {
                const combinedName = matchedVariant.productVariantName || productData.name;
                navigate(`/product/${combinedName}`, {
                    replace: true,
                    state: {
                        ...location.state,
                        productId: matchedVariant.id
                    }
                });
            }
        }
    };

    const displayName = productData?.name;
    const isOutOfStock = stockQuantity <= 0 || productData?.status === 'INACTIVE';
    const shownPrice = currentPrice.hasDiscount ? currentPrice.promotionPrice : currentPrice.originPrice;

    const totalReviewPages = productData?.reviews ? Math.ceil(productData.reviews.length / reviewsPerPage) : 0;
    const displayedReviews = productData?.reviews
        ? productData.reviews.slice(reviewPage * reviewsPerPage, (reviewPage + 1) * reviewsPerPage)
        : [];

    const getLocalContent = (key) => productData?.content?.[language === 'vi' ? 'vi' : 'en']?.[key] || '';

    const handleQuantityChange = (val) => {
        if (quantity + val >= 1) setQuantity(q => q + val);
    };

    const handleAddToCart = () => {
        addToCart({
            cartId: `local_${Date.now()}`,
            productVariantId: productData.id,
            id: productData.id,
            productId: productData.id,
            name: displayName,
            price: shownPrice,
            image: mainImage,
            quantity,
            variantDisplay: selectedOptions ? Object.values(selectedOptions).join(' - ') : '',
        });
        notify(t('add_cart_success'), 'success');
    };

    if (isError) return <NotFound />;
    if (isLoading || !productData) return (
        <div className="product-detail-page">
            <div className="product-top-section">
                <Skeleton width="45%" height="450px" className="detail-skeleton-img" />
                <div className="detail-skeleton-info">
                    <Skeleton width="30%" height="20px" className="mb-15" />
                    <Skeleton width="80%" height="40px" className="mb-20" />
                    <Skeleton width="40%" height="30px" className="mb-30" />
                    <Skeleton width="100%" height="80px" className="mb-30" />
                    <Skeleton width="100%" height="60px" />
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'details', label: t('product_details') },
        { id: 'application', label: t('how_to_apply') },
        { id: 'ingredients', label: t('ingredients') },
        { id: 'reviews', label: `${t('reviews')} (${productData.reviews_count})` },
    ];

    return (
        <div className="product-detail-page">
            <div className="breadcrumb">
                <Link to={'/product'} state={{ fromDetail: true }}>{t('product')}</Link>
                <span className="divider">/</span>
                <span className="current">{displayName}</span>
            </div>

            <div className="product-top-section">
                <div className="product-gallery">
                    <div className="thumbnail-list">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className={`thumb-item ${mainImage === img ? 'active' : ''}`} onClick={() => setMainImage(img)}>
                                <img src={img} alt={`Thumb ${idx}`} />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={mainImage} alt={displayName} onError={(e) => { e.target.src = fallbackImg }} />
                        {currentPrice.hasDiscount && <div className="discount-badge-main">{t('promotion')}</div>}
                    </div>
                </div>

                <div className="product-info-side">
                    <div className="brand-label">
                        {productData.brand}
                        {productData.status && (
                            <Tag color={productData.status === 'ACTIVE' ? 'processing' : 'default'} style={{ marginLeft: 10 }}>
                                {productData.status}
                            </Tag>
                        )}
                    </div>
                    <h1 className="detail-title">{displayName}</h1>

                    {productData.categories?.length > 0 && (
                        <div className="detail-categories">
                            <span className="detail-categories-label">{t('categories')}: </span>
                            {productData.categories.map((cat, idx) => (
                                <span key={idx} className="detail-category-tag">
                                    {cat?.categoryName}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="detail-tags">
                        <div className="rating-container">
                            <StarFilled className="bkeuty-star" />
                            <strong>{productData.rating}</strong>/5 ({productData.reviews_count} {t('reviews')})
                        </div>
                    </div>

                    <div className="price-box">
                        <div className="product-current-price-wrapper">
                            <div className="product-current-price">
                                {`${shownPrice.toLocaleString('vi-VN')}đ`}
                            </div>
                            {currentPrice.hasDiscount && (
                                <div className="product-old-price-wrapper">
                                    <span className="product-old-price-text">
                                        {currentPrice.originPrice.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="product-options-section">
                        {productData.options?.map((opt, idx) => (
                            <div key={idx} className="option-group">
                                <span className="option-label">{opt.name.toUpperCase()}:</span>
                                <div className="size-options">
                                    {opt.values.map(val => {
                                        const isActive = selectedOptions[opt.name]?.toString().toLowerCase().trim() === val?.toString().toLowerCase().trim();
                                        return (
                                            <button
                                                key={val}
                                                className={`size-btn ${isActive ? 'active' : ''}`}
                                                onClick={() => handleOptionSelect(opt.name, val)}
                                            >
                                                {val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {Object.keys(selectedOptions).length > 0 && (
                            <div className="selected-variant-info">
                                <span className="variant-label-title">{t('variant_selected_label')}: </span>
                                <strong className="variant-label-value">
                                    {Object.values(selectedOptions).join(' - ')}
                                </strong>
                            </div>
                        )}

                        <div className="stock-info">
                            {t('in_stock_label')} <strong>{stockQuantity}</strong> {t('items_available')}
                        </div>

                        <div className="option-group align-center mt-10">
                            <span className="option-label">{t('quantity')}:</span>
                            <div className="input-quantity-wrapper">
                                <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                                <input type="text" className="qty-input" value={quantity} readOnly />
                                <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="actions-wrapper">
                        <CButton type="primary" disabled={isOutOfStock} onClick={() => notify(t('feature_developing_title'), 'info')} className="btn-action-buy">
                            <span>{productData.status === 'INACTIVE' ? t('inactive') : isOutOfStock ? t('out_of_stock_btn') : t('buy_now')}</span>
                        </CButton>
                        <CButton type="outline" disabled={isOutOfStock} onClick={handleAddToCart} icon={<ShoppingOutlined />} className="btn-action-cart">
                            {productData.status === 'INACTIVE' ? t('inactive') : isOutOfStock ? t('out_of_stock_btn') : t('add_to_cart')}
                        </CButton>
                    </div>
                </div>
            </div>

            <div className="product-content-tabs">
                <div className="tab-headers">
                    {tabs.map(tab => (
                        <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="tab-body">
                    {activeTab === 'details' && (
                        <div className="tab-content">
                            <h3>{t('product_details')}</h3>
                            <p>{productData.description}</p>
                        </div>
                    )}
                    {activeTab === 'application' && (
                        <div className="tab-content">
                            <h3>{t('how_to_apply')}</h3>
                            {getLocalContent('application').split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    )}
                    {activeTab === 'ingredients' && (
                        <div className="tab-content">
                            <h3>{t('ingredients')}</h3>
                            <p>{getLocalContent('ingredients')}</p>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="tab-content review-tab-content">
                            <div className="review-dashboard">
                                <div className="rating-overview">
                                    <span className="big-score">{productData.rating}</span>
                                    <div className="star-stack">
                                        <div className="star-row">
                                            {[...Array(5)].map((_, i) => <StarFilled key={i} className="bkeuty-star" />)}
                                        </div>
                                        <span className="total-reviews">{productData.reviews_count} {t('reviews')}</span>
                                    </div>
                                </div>
                                <div className="rating-bars">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="bar-row">
                                            <span className="star-label">{star} <StarFilled style={{ fontSize: '12px' }} className="bkeuty-star" /></span>
                                            <div className="progress-bg">
                                                <div className="progress-fi" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-write-review">{t('write_review')}</button>
                            </div>

                            <div className="review-filters">
                                <button className="filter-chip active">{t('all')}</button>
                                <button className="filter-chip">{t('filter_with_media')} (0)</button>
                                <button className="filter-chip">{t('filter_5_star')} (0)</button>
                            </div>

                            <div className="review-list-container">
                                {displayedReviews.map((rev, i) => (
                                    <div key={i} className="review-card">
                                        <div className="review-user-avatar">{rev.user.charAt(0)}</div>
                                        <div className="review-content-body">
                                            <div className="review-header-row">
                                                <span className="reviewer-name">{rev.user}</span>
                                                <span className="review-time">{rev.date}</span>
                                            </div>
                                            <div className="review-stars-row">
                                                {[...Array(5)].map((_, starIdx) => (
                                                    <span key={starIdx} className={`rv-star ${starIdx < rev.rating ? 'filled' : ''}`}>
                                                        <StarFilled className="bkeuty-star" />
                                                    </span>
                                                ))}
                                                {rev.verified && (
                                                    <span className="verified-tag">
                                                        <CheckCircleFilled className="icon-check" /> {t('verified_purchase')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="review-text">{rev.content}</div>
                                            <div className="review-actions">
                                                <button className="action-btn"><HeartOutlined className="icon-action" /> {t('like')}</button>
                                                <button className="action-btn"><MessageOutlined className="icon-action" /> {t('comment')}</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                page={reviewPage}
                                totalPages={totalReviewPages}
                                totalItems={productData.reviews.length}
                                pageSize={reviewsPerPage}
                                onPageChange={setReviewPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* {relatedProducts.length > 0 && (
                <div className="recommendations-section">
                    <h2 className="section-title">{t('related_products')}</h2>
                    <div className="product-grid related-products-grid">
                        {relatedProducts.map((p, i) => (
                            <ProductCard key={i} product={p} t={t} />
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
}
