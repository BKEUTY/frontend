import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNotification } from '../../Context/NotificationContext';
import { useCart } from '../../Context/CartContext';
import './ProductDetail.css';
import { StarFilled, CheckCircleFilled, HeartOutlined, MessageOutlined, ShoppingOutlined } from '@ant-design/icons';
import { CButton, Pagination, ProductCard, Skeleton } from '../../Component/Common';
import productApi from '../../api/productApi';
import { getImageUrl } from '../../api/axiosClient';
import NotFound from '../../Component/ErrorPages/NotFound';
import { generateSlug } from '../../utils/helpers';

import dummy1 from '../../Assets/Images/Products/product_dummy_1.jpg';
import dummy2 from '../../Assets/Images/Products/product_dummy_2.jpg';
import dummy3 from '../../Assets/Images/Products/product_dummy_3.jpg';
import dummy4 from '../../Assets/Images/Products/product_dummy_4.jpg';
import dummy5 from '../../Assets/Images/Products/product_dummy_5.svg';

const dummyImages = [dummy1, dummy2, dummy3, dummy4, dummy5];
const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

export default function ProductDetail() {
    const { slug } = useParams();
    const { t, language } = useLanguage();
    const notify = useNotification();
    const { addToCart } = useCart();
    const location = useLocation();

    const categoryName = location.state?.category || t('all_products');
    const categoryLink = location.state?.from || '/product';

    const stateProductId = location.state?.productId;
    const stateVariantId = location.state?.variantId;

    const fallbackImg = useMemo(() => getRandomImage(), []);

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [activeTab, setActiveTab] = useState('details');
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentVariant, setCurrentVariant] = useState(null);
    const [mainImage, setMainImage] = useState(fallbackImg);
    const [quantity, setQuantity] = useState(1);
    const [reviewPage, setReviewPage] = useState(0);
    const reviewsPerPage = 5;

    useEffect(() => {
        if (productData && productData.images && productData.images.length > 0) {
            setMainImage(productData.images[0]);
        }
    }, [productData]);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                let targetProductId = stateProductId;
                
                if (!targetProductId && slug) {
                    const allRes = await productApi.getAll({ page: 0, size: 1000 });
                    const allProducts = allRes.data?.content || [];
                    const matched = allProducts.find(p => generateSlug(p.name) === slug || slug.includes(generateSlug(p.name)));
                    if (matched) {
                        targetProductId = matched.id;
                    }
                }

                if (!targetProductId) {
                    setIsError(true);
                    setIsLoading(false);
                    return;
                }

                const response = await productApi.getById(targetProductId);
                const found = response.data;

                if (found) {
                    const basePrice = found.minPrice !== undefined ? found.minPrice : (found.price || 0);
                    
                    const mappedVariants = (found.variants || []).map(v => ({
                        id: v.id,
                        variantOptions: v.variantOptions || {},
                        price: parseFloat(v.price) || 0,
                        stockQuantity: v.stockQuantity || 0,
                        image: v.productImageUrl ? getImageUrl(v.productImageUrl) : null,
                        productVariantName: v.productVariantName
                    }));

                    const variantImages = mappedVariants.map(v => v.image).filter(img => img !== null && img !== "");

                    let options = found.options || [];
                    if (options.length === 0) {
                        const optionsMap = {};
                        mappedVariants.forEach(v => {
                            if (v.variantOptions) {
                                Object.entries(v.variantOptions).forEach(([name, val]) => {
                                    if (!optionsMap[name]) optionsMap[name] = new Set();
                                    optionsMap[name].add(val);
                                });
                            }
                        });
                        options = Object.entries(optionsMap).map(([name, valuesSet]) => ({ name, values: Array.from(valuesSet) }));
                    }

                    const mergedData = {
                        id: found.id,
                        productId: found.id,
                        name: found.name || "Sản phẩm BKEUTY",
                        brand: "BKEUTY",
                        price: mappedVariants.length > 0 ? mappedVariants[0].price : basePrice,
                        rating: 4.8,
                        reviews_count: 124,
                        categories: found.categories || [],
                        images: [found.image ? getImageUrl(found.image) : fallbackImg, ...variantImages, getRandomImage(), getRandomImage(), getRandomImage()].filter(Boolean).slice(0, 5),
                        options: options,
                        variants: mappedVariants,
                        content: {
                            en: {
                                description: found.description || "",
                                details: "High-quality BKEUTY skincare product.",
                                application: "1. Cleanse your skin.\n2. Apply a proper amount.",
                                ingredients: "Aqua, Glycerin, Botanical Extracts.",
                            },
                            vi: {
                                description: found.description || "",
                                details: "Sản phẩm chăm sóc da cao cấp từ BKEUTY.",
                                application: "1. Làm sạch da.\n2. Thoa một lượng vừa đủ.",
                                ingredients: "Nước khoáng, Glycerin, Chiết xuất thảo mộc.",
                            }
                        },
                        reviews: []
                    };
                    
                    setProductData(mergedData);
                    
                    if (stateVariantId && mappedVariants.length > 0) {
                        const targetVariant = mappedVariants.find(v => v.id === stateVariantId);
                        if (targetVariant && targetVariant.variantOptions) {
                            setSelectedOptions(targetVariant.variantOptions);
                        } else {
                            setDefaultOptions(mergedData);
                        }
                    } else {
                        setDefaultOptions(mergedData);
                    }
                } else {
                    setIsError(true);
                }
            } catch (err) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        const setDefaultOptions = (data) => {
            if (data.options) {
                const initialOptions = {};
                data.options.forEach(opt => {
                    if (opt.values && opt.values.length > 0) initialOptions[opt.name] = opt.values[0];
                });
                setSelectedOptions(initialOptions);
            }
        };

        fetchProduct();
    }, [stateProductId, stateVariantId, slug, fallbackImg]);

    useEffect(() => {
        if (productData && productData.variants && Object.keys(selectedOptions).length > 0) {
            const matchVariant = productData.variants.find(v => {
                if (!v.variantOptions || Object.keys(v.variantOptions).length === 0) return false;
                return Object.entries(selectedOptions).every(([optName, selectedVal]) => {
                    const vVal = v.variantOptions[optName];
                    if (!vVal || !selectedVal) return false;
                    return vVal.toString().toLowerCase().trim() === selectedVal.toString().toLowerCase().trim();
                });
            });
            setCurrentVariant(matchVariant || null);
        }
    }, [selectedOptions, productData]);

    useEffect(() => {
        if (currentVariant && currentVariant.image) setMainImage(currentVariant.image);
    }, [currentVariant]);

    useEffect(() => {
        if (currentVariant && productData) {
            const combinedName = currentVariant.productVariantName && currentVariant.productVariantName !== productData.name
                ? `${productData.name} ${currentVariant.productVariantName}`
                : productData.name;
                
            const newSlug = generateSlug(combinedName, productData.id, currentVariant.id);
            if (slug !== newSlug) {
                window.history.replaceState(
                    { ...window.history.state, usr: { ...window.history.state?.usr, productId: productData.id, variantId: currentVariant.id } }, 
                    '', 
                    `/product/${newSlug}`
                );
            }
        }
    }, [currentVariant, productData, slug]);

    const totalReviewPages = productData ? Math.ceil(productData.reviews.length / reviewsPerPage) : 0;
    const displayedReviews = productData ? productData.reviews.slice(reviewPage * reviewsPerPage, (reviewPage + 1) * reviewsPerPage) : [];
    const getLocalContent = (key) => productData?.content?.[language === 'vi' ? 'vi' : 'en']?.[key] || "";

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

    const handleQuantityChange = (val) => {
        const newVal = quantity + val;
        if (newVal >= 1) setQuantity(newVal);
    };

    const handleAddToCart = () => {
        const selectedVariantId = currentVariant?.id || (productData.variants && productData.variants.length > 0 ? productData.variants[0].id : productData.id);
        
        addToCart({
            cartId: `local_${Date.now()}`,
            productVariantId: selectedVariantId,
            id: selectedVariantId,
            productId: productData.id,
            name: productData.name,
            price: currentVariant ? currentVariant.price : productData.price,
            image: mainImage,
            quantity: quantity,
            variantDisplay: currentVariant?.variantOptions ? Object.values(currentVariant.variantOptions).join(' - ') : (currentVariant?.productVariantName || '')
        });
        notify(t('add_cart_success'), "success");
    };

    const tabs = [
        { id: 'details', label: t('product_details') },
        { id: 'application', label: t('how_to_apply') },
        { id: 'ingredients', label: t('ingredients') },
        { id: 'reviews', label: `${t('reviews')} (${productData.reviews_count})` },
    ];

    const isOutOfStock = currentVariant ? currentVariant.stockQuantity <= 0 : false;

    return (
        <div className="product-detail-page">
            <div className="breadcrumb">
                <Link to={categoryLink} state={{ fromDetail: true }}>{categoryName}</Link>
                <span className="divider">/</span>
                <span className="current">{productData.name}</span>
            </div>

            <div className="product-top-section">
                <div className="product-gallery">
                    <div className="thumbnail-list">
                        {productData.images.map((img, idx) => (
                            <div key={idx} className={`thumb-item ${mainImage === img ? 'active' : ''}`} onClick={() => setMainImage(img)}>
                                <img src={img} alt={`Thumb ${idx}`} />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={mainImage} alt={productData.name} onError={(e) => { e.target.src = fallbackImg }} />
                    </div>
                </div>

                <div className="product-info-side">
                    <div className="brand-label">{productData.brand}</div>
                    <h1 className="detail-title">{productData.name}</h1>

                    {productData.categories && productData.categories.length > 0 && (
                        <div className="detail-categories">
                            <span className="detail-categories-label">{t('categories')}: </span>
                            {productData.categories.map((cat, idx) => (
                                <span key={idx} className="detail-category-tag">
                                    {typeof cat === 'object' ? cat.categoryName : cat}
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
                        <div className="current-price">
                            {(currentVariant ? currentVariant.price : productData.price).toLocaleString("vi-VN")}đ
                            <span className="vat-tag">{t('vat_included')}</span>
                        </div>
                    </div>

                    <div className="product-options-section">
                        {productData.options && productData.options.map((opt, idx) => (
                            <div key={idx} className="option-group">
                                <span className="option-label">{opt.name.toUpperCase()}:</span>
                                <div className="size-options">
                                    {opt.values.map(val => {
                                        const isActive = selectedOptions[opt.name]?.toString().toLowerCase().trim() === val?.toString().toLowerCase().trim();
                                        return (
                                            <button key={val} className={`size-btn ${isActive ? 'active' : ''}`} onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}>
                                                {val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {currentVariant && (
                            <div className="selected-variant-info">
                                <span className="variant-label-title">{t('variant_selected_label')}: </span>
                                <strong className="variant-label-value">
                                    {currentVariant.variantOptions && Object.keys(currentVariant.variantOptions).length > 0
                                        ? Object.values(currentVariant.variantOptions).join(' - ')
                                        : currentVariant.productVariantName}
                                </strong>
                            </div>
                        )}

                        <div className="stock-info">
                            {t('in_stock_label')} <strong>{currentVariant ? currentVariant.stockQuantity : 0}</strong> {t('items_available')}
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
                        <CButton type="primary" disabled={isOutOfStock} onClick={() => notify(t('feature_developing_title'), "info")} className="btn-action-buy">
                            <span>{isOutOfStock ? t('out_of_stock_btn') : t('buy_now')}</span>
                        </CButton>
                        <CButton type="outline" disabled={isOutOfStock} onClick={handleAddToCart} icon={<ShoppingOutlined />} className="btn-action-cart">
                            {isOutOfStock ? t('out_of_stock_btn') : t('add_to_cart')}
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
                            <p>{getLocalContent('details')}</p>
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
                                            <div className="progress-bg"><div className="progress-fi" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}></div></div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-write-review">{t('write_review')}</button>
                            </div>

                            <div className="review-filters">
                                <button className="filter-chip active">{t('all')}</button>
                                <button className="filter-chip">{t('filter_with_media')} (24)</button>
                                <button className="filter-chip">{t('filter_5_star')} (80)</button>
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
                                                {rev.verified && <span className="verified-tag"><CheckCircleFilled className="icon-check" /> {t('verified_purchase')}</span>}
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
                            <Pagination page={reviewPage} totalPages={totalReviewPages} onPageChange={setReviewPage} />
                        </div>
                    )}
                </div>
            </div>

            <div className="recommendations-section">
                <h2 className="section-title">{t('related_products')}</h2>
                <div className="product-grid related-products-grid">
                    {[1, 2, 3, 4, 5].map(i => {
                        const relatedProduct = { id: i, name: "Capture Totale Cell Energy", brand: "Dior", price: 3500000, image: getRandomImage(), rating: 4.8, sold: 120 };
                        return <ProductCard key={i} product={relatedProduct} t={t} language={language} onClickData={{ category: language === 'vi' ? 'Gợi ý' : 'Related Products', from: location.pathname }} />;
                    })}
                </div>
            </div>
        </div>
    );
}
