import { CButton, ProductCard, SEO, Skeleton, AnimatedPage } from '@/components/common';
import cartApi from '@/features/cart/services/cartService';
import productApi from '@/features/products/services/productService';
import { useRelatedProducts } from '@/hooks/useRecommendation';
import NotFound from '@/pages/NotFound';
import { getImageUrl, getOptimizedImageUrl } from '@/services/axiosClient';
import { useAuth } from '@/store/AuthContext';
import { useCart } from '@/store/CartContext';
import { useLanguage } from '@/store/LanguageContext';
import { useNotification } from '@/store/NotificationContext';
import { generateSlug, getIdFromSlug, PRODUCT_IMAGE_FALLBACK } from '@/utils/helpers';
import { ShoppingOutlined, StarFilled } from '@ant-design/icons';
import { Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProductDetail.css';
import ProductReviews from './ProductReviews';

export default function ProductDetail() {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const notify = useNotification();
    const { addToCart, fetchCart } = useCart();
    const { isAuthenticated, user } = useAuth();

    const productId = location.state?.productId ?? getIdFromSlug(slug);
    const fallbackImg = PRODUCT_IMAGE_FALLBACK;

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [activeTab, setActiveTab] = useState('details');
    const [selectedOptions, setSelectedOptions] = useState({});
    const [stockQuantity, setStockQuantity] = useState(0);
    const [mainImage, setMainImage] = useState(fallbackImg);
    const [quantity, setQuantity] = useState(1);
    const { data: relData, isLoading: relLoading } = useRelatedProducts(productData?.name);

    const [currentPrice, setCurrentPrice] = useState({ originPrice: 0, promotionPrice: 0, appliedPromotionType: null, hasDiscount: false });

    const galleryImages = useMemo(() => {
        if (!productData) return [];
        const images = [];
        
        if (productData.productImages && productData.productImages.length > 0) {
            productData.productImages.forEach(img => {
                const url = typeof img === 'object' ? img.imageUrl : img;
                if (url) images.push(getImageUrl(url));
            });
        } else if (productData.image) {
            if (Array.isArray(productData.image)) {
                productData.image.forEach(img => {
                    if (img) {
                        const resolvedUrl = getImageUrl(img);
                        if (resolvedUrl && !images.includes(resolvedUrl)) {
                            images.push(resolvedUrl);
                        }
                    }
                });
            } else {
                const resolvedUrl = getImageUrl(productData.image);
                if (resolvedUrl && !images.includes(resolvedUrl)) {
                    images.push(resolvedUrl);
                }
            }
        }

        const targetVariant = productData.variants?.find(v => v.id === productData.id);
        if (targetVariant?.productImageUrl) {
            const variantUrls = Array.isArray(targetVariant.productImageUrl) 
                ? targetVariant.productImageUrl 
                : [targetVariant.productImageUrl];
            variantUrls.forEach(url => {
                if (url) {
                    const fullUrl = getImageUrl(url);
                    if (!images.includes(fullUrl)) images.push(fullUrl);
                }
            });
        }

        if (images.length === 0) {
            images.push(PRODUCT_IMAGE_FALLBACK);
        }

        return images;
    }, [productData]);

    useEffect(() => {
        if (galleryImages.length > 0) setMainImage(galleryImages[0]);
    }, [galleryImages]);

    const fetchProduct = useCallback(async () => {
        if (!productId) {
            setIsError(true);
            setIsLoading(false);
            return;
        }
        setIsError(false);
        try {
            const responseData = (await productApi.getById(productId, { 
                params: { 
                    userId: user?.id, 
                    membershipLevel: user?.membershipLevel 
                } 
            })).data;
            if (!responseData) throw new Error('Product not found');

            setCurrentPrice({
                originPrice: responseData.originPrice,
                promotionPrice: responseData.promotionPrice,
                appliedPromotionType: responseData.appliedPromotionType,
                hasDiscount: (responseData.promotionPrice !== undefined && responseData.promotionPrice !== null) && responseData.promotionPrice < responseData.originPrice,
            });
            const targetVariant = responseData.variants?.find(v => v.id === responseData.id) || responseData.variants?.[0];
            setProductData(responseData);
            setSelectedOptions(targetVariant?.variantOptions || {});
            setStockQuantity(targetVariant?.stockQuantity || 0);

        } catch (err) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [productId, slug]);

    useEffect(() => {
        setIsLoading(true);
        fetchProduct();
    }, [fetchProduct]);

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
                const newSlug = generateSlug(combinedName, matchedVariant.id);
                navigate(`/product/${newSlug}`, {
                    replace: true,
                    state: { ...location.state, productId: matchedVariant.id }
                });
            }
        }
    };

    const displayName = productData?.name;
    const isOutOfStock = stockQuantity <= 0 || productData?.status === 'INACTIVE';

    const handleQuantityChange = (delta) => {
        setQuantity(prev => {
            const newVal = prev + delta;
            return newVal < 1 ? 1 : (newVal > stockQuantity ? stockQuantity : newVal);
        });
    };

    const handleAddToCart = async () => {
        if (stockQuantity <= 0) {
            notify(t('out_of_stock_msg'), 'error');
            return;
        }
        try {
            await addToCart({
                productVariantId: productData.id,
                quantity: quantity,
                name: displayName,
                price: currentPrice.originPrice,
                promotionPrice: currentPrice.promotionPrice,
                image: mainImage
            });
            notify(t('add_cart_success'), 'success');
        } catch (err) {
            notify(t('api_error_add_cart'), 'error');
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if (stockQuantity <= 0) {
            notify(t('out_of_stock_msg'), 'error');
            return;
        }
        try {
            const response = await cartApi.create({ productVariantId: productData.id, quantity, buyNow: true });
            fetchCart();

            const { cartId, quantity: resQty } = response.data || response;
            const price = currentPrice.originPrice;
            const promotionPrice = currentPrice.promotionPrice;
            const finalPrice = (promotionPrice !== undefined && promotionPrice !== null) ? promotionPrice : price;
            const grandTotal = finalPrice * (resQty || quantity);

            navigate('/checkout', {
                state: {
                    cartIds: [cartId],
                    grandTotal,
                    selectedProducts: [{
                        id: productData.id,
                        name: productData.name,
                        price: price,
                        promotionPrice: promotionPrice,
                        quantity: resQty || quantity,
                        image: mainImage,
                        effectivePrice: finalPrice
                    }]
                }
            });
        } catch (err) {
            notify(t('api_error_add_cart'), 'error');
        }
    };

    if (isError) return <NotFound />;
    if (isLoading || !productData) return (
        <div className="product-detail-page">
            <div className="product-top-section">
                <Skeleton width="45%" height="450px" borderRadius="16px" className="skeleton-img" />
                <div className="skeleton-info">
                    <Skeleton width="30%" height="20px" borderRadius="4px" className="mb15" />
                    <Skeleton width="80%" height="40px" borderRadius="8px" className="mb20" />
                    <Skeleton width="40%" height="30px" borderRadius="6px" className="mb30" />
                    <Skeleton width="100%" height="80px" borderRadius="12px" className="mb30" />
                    <Skeleton width="100%" height="60px" borderRadius="12px" />
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'details', label: t('product_details') },
        { id: 'reviews', label: `${t('reviews')} (${productData.reviewCount})` },
    ];

    return (
        <AnimatedPage>
            <div className="product-detail-page">
                <div className="product-detail-container">
                    <SEO
                        title={displayName}
                        description={productData.description}
                        image={mainImage}
                    />
                <div className="breadcrumb">
                    <Link 
                        to="/product" 
                        state={{ fromDetail: true }}
                        onClick={(e) => {
                            if (window.history.length > 1) {
                                e.preventDefault();
                                navigate(-1);
                            }
                        }}
                    >
                        {t('product')}
                    </Link>
                    <span className="divider">/</span>
                    <span className="current">{displayName}</span>
                </div>

            <div className="product-top-section">
                <div className="product-gallery">
                    <div className="thumbnail-list">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className={`thumb-item ${mainImage === img ? 'active' : ''}`} onClick={() => setMainImage(img)}>
                                <img src={getOptimizedImageUrl(img, 256)} alt={`Thumb ${idx}`} loading="lazy" />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={getOptimizedImageUrl(mainImage, 1080)} alt={displayName} fetchpriority="high" onError={(e) => { e.target.src = fallbackImg }} />
                        {currentPrice.hasDiscount && (
                            <div className={`discount-badge-main ${currentPrice.appliedPromotionType === 'UserPromotion' ? 'user-promo-badge' : ''}`}>
                                {currentPrice.appliedPromotionType === 'UserPromotion' ? t('promo_type_userpromotion') : t('promotion')}
                            </div>
                        )}
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

                    <div className="rating-container">
                        <StarFilled className="bkeuty-star" />
                        {Number(productData.averageRating).toFixed(1)}/5 ({productData.reviewCount} {t('reviews')})
                    </div>

                    <div className="price-box">
                        <div className="product-current-price-wrapper">
                            <div className="product-current-price">
                                {`${currentPrice.promotionPrice.toLocaleString('vi-VN')}đ`}
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

                    <div className="options-section">
                        {productData.options?.map((opt, idx) => (
                            <div key={idx} className="option-group">
                                <span className="option-label">{opt.name}:</span>
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
                                <span className="variant-label-title">{t('product_selected')}</span>
                                <strong className="variant-label-value">
                                    {Object.values(selectedOptions).join(' - ')}
                                </strong>
                            </div>
                        )}
                        <div className="product-meta-stats-row">
                            <div className="stat-badge-item stock-badge">
                                <span className="stat-dot green-dot"></span>
                                <span className="stat-text">
                                    {t('product_stock_count').split('{count}')[0]}
                                    <strong className="stat-value">{stockQuantity}</strong>
                                    {t('product_stock_count').split('{count}')[1]}
                                </span>
                            </div>
                            <div className="stat-badge-divider"></div>
                            <div className="stat-badge-item sold-badge">
                                <span className="stat-dot gray-dot"></span>
                                <span className="stat-text">
                                    {t('product_sold_count').split('{count}')[0]}
                                    <strong className="stat-value">{productData.sold}</strong>
                                    {t('product_sold_count').split('{count}')[1]}
                                </span>
                            </div>
                        </div>

                        <div className="option-group align-center">
                            <span className="option-label">{t('quantity')}:</span>
                            <div className="input-quantity-wrapper">
                                <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                                <input type="text" className="qty-input" value={quantity} readOnly />
                                <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="actions-wrapper">
                        <CButton type="primary" disabled={isOutOfStock} onClick={handleBuyNow} className="btn-action-buy">
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
                        <div className="tab-content animate-fade-in">
                            <p className="description-text">{productData.description}</p>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="tab-content animate-fade-in">
                            <ProductReviews
                                variantId={productData.id}
                                averageRating={productData.averageRating}
                                reviewCount={productData.reviewCount}
                                onReviewChanged={fetchProduct}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="related-products-section mt-60 animate-fade-in">
                <div className="home-section-header">
                    <h2 className="home-section-title">
                        {t('related_products')}
                    </h2>
                </div>

                <div className="home-product-grid">
                    {relLoading ? (
                        Array(5).fill(0).map((_, idx) => (
                            <ProductCard key={`rel-skeleton-${idx}`} isLoading={true} />
                        ))
                    ) : (
                        relData?.recommendedProducts?.map((item) => (
                            <ProductCard
                                key={item.productId}
                                product={item}
                                t={t}
                            />
                        ))
                    )}
                </div>
            </div>
            </div>
        </div>
        </AnimatedPage>
    );
}
