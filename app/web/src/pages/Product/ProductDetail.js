import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNotification } from '../../Context/NotificationContext';
import { useCart } from '../../Context/CartContext';
import './ProductDetail.css';
import {
    StarFilled,
    CheckCircleFilled,
    HeartOutlined,
    MessageOutlined,
    ShoppingOutlined,
    ThunderboltFilled,
    ClockCircleOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import best_selling_image from "../../Assets/Images/Products/product_placeholder.svg";
import Pagination from "../../Component/Common/Pagination";
import ProductCard from "../../Component/Common/ProductCard";
import Skeleton from "../../Component/Common/Skeleton";
import productApi from '../../api/productApi';
import { getImageUrl } from '../../api/axiosClient';
import NotFound from '../../Component/ErrorPages/NotFound';

export default function ProductDetail({ previewProduct }) {
    const { id } = useParams();
    const { t, language } = useLanguage();
    const notify = useNotification();
    const { addToCart } = useCart();
    const location = useLocation();

    const categoryName = location.state?.category || t('all_products');
    const categoryLink = location.state?.from || '/product';

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [activeTab, setActiveTab] = useState('details');
    const [selectedSize, setSelectedSize] = useState("50ml");
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentVariant, setCurrentVariant] = useState(null);
    const [mainImage, setMainImage] = useState(best_selling_image);
    const [quantity, setQuantity] = useState(1);

    const [reviewPage, setReviewPage] = useState(0);
    const reviewsPerPage = 5;

    useEffect(() => {
        if (productData && productData.images && productData.images.length > 0) {
            setMainImage(productData.images[0]);
        }
    }, [productData]);

    useEffect(() => {
        if (previewProduct) {
            const mockOptions = [
                { name: "Màu Sắc", values: ["Nâu", "Vàng"] },
                { name: "Kích Thước", values: ["XL", "XXL", "XXXL"] }
            ];

            const mockVariants = [
                { id: 1, optionValues: ["Nâu", "XL"], price: 150000, stockQuantity: 10 },
                { id: 2, optionValues: ["Nâu", "XXL"], price: 160000, stockQuantity: 0 },
                { id: 3, optionValues: ["Nâu", "XXXL"], price: 170000, stockQuantity: 5 },
                { id: 4, optionValues: ["Vàng", "XL"], price: 155000, stockQuantity: 20 },
                { id: 5, optionValues: ["Vàng", "XXL"], price: 165000, stockQuantity: 15 },
                { id: 6, optionValues: ["Vàng", "XXXL"], price: 175000, stockQuantity: 2 }
            ];

            const mergedData = {
                id: previewProduct.productId || previewProduct.id,
                name: previewProduct.name,
                brand: "BKEUTY",
                price: previewProduct.price || 0,
                original_price: (previewProduct.price || 0) * 1.2,
                rating: 4.8,
                reviews_count: 124,
                images: [
                    previewProduct.image ? getImageUrl(previewProduct.image) : best_selling_image,
                    best_selling_image,
                    best_selling_image
                ],
                sizes: ["30ml", "50ml", "75ml"],
                options: mockOptions,
                variants: mockVariants,
                content: {
                    en: {
                        description: previewProduct.description || "Product description...",
                        details: "Full details...",
                        application: "Apply daily...",
                        ingredients: "Aqua, Glycerin...",
                        advance: "Advanced formula...",
                        benefits_list: ["Revitalizing", "Repairing"]
                    },
                    vi: {
                        description: previewProduct.description || "Mô tả sản phẩm...",
                        details: "Chi tiết...",
                        application: "Sử dụng hàng ngày...",
                        ingredients: "Nước, Glycerin...",
                        advance: "Công thức tiên tiến...",
                        benefits_list: ["Tái Tạo", "Phục Hồi"]
                    }
                },
                reviews: []
            };
            setProductData(mergedData);
            setMainImage(mergedData.images[0]);
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                // const response = await productApi.getAll({ page: 0, size: 1000 });
                // const found = response.data.content.find(p => p.productId === id);

                const found = {
                    productId: id,
                    id: id,
                    name: "Sản phẩm BKEUTY " + id,
                    price: 1500000,
                    description: "Đây là dữ liệu chi tiết sản phẩm mẫu (hardcoded) do API chưa sẵn sàng.",
                    image: null
                };
                if (found) {
                    const mockOptions = [
                        { name: "Màu Sắc", values: ["Nâu", "Vàng"] },
                        { name: "Kích Thước", values: ["XL", "XXL", "XXXL"] }
                    ];

                    const mockVariants = [
                        { id: 1, optionValues: ["Nâu", "XL"], price: 150000, stockQuantity: 10 },
                        { id: 2, optionValues: ["Nâu", "XXL"], price: 160000, stockQuantity: 0 },
                        { id: 3, optionValues: ["Nâu", "XXXL"], price: 170000, stockQuantity: 5 },
                        { id: 4, optionValues: ["Vàng", "XL"], price: 155000, stockQuantity: 20 },
                        { id: 5, optionValues: ["Vàng", "XXL"], price: 165000, stockQuantity: 15 },
                        { id: 6, optionValues: ["Vàng", "XXXL"], price: 175000, stockQuantity: 2 }
                    ];

                    const mergedData = {
                        id: found.id || found.productId,
                        name: found.name,
                        brand: "BKEUTY",
                        price: found.price,
                        original_price: found.price * 1.1,
                        rating: 4.8,
                        reviews_count: 124,
                        images: [
                            found.image ? getImageUrl(found.image) : best_selling_image,
                            best_selling_image,
                            best_selling_image
                        ],
                        sizes: ["30ml", "50ml", "75ml"],
                        options: mockOptions,
                        variants: mockVariants,
                        content: {
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
                        reviews: []
                    };
                    setProductData(mergedData);
                    setMainImage(mergedData.images[0]);
                } else {
                    setIsError(true);
                }
            } catch (err) {
                console.error("Error fetching product detail:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id, previewProduct]);

    useEffect(() => {
        if (productData && productData.options) {
            const initialOptions = {};
            productData.options.forEach(opt => {
                if (opt.values && opt.values.length > 0) {
                    initialOptions[opt.name] = opt.values[0];
                }
            });
            setSelectedOptions(initialOptions);
        }
    }, [productData]);

    useEffect(() => {
        if (productData && productData.variants && Object.keys(selectedOptions).length > 0) {
            const match = productData.variants.find(v => {
                return productData.options.every((opt, index) => {
                    return v.optionValues[index] === selectedOptions[opt.name];
                });
            });
            setCurrentVariant(match || null);
        }
    }, [selectedOptions, productData]);

    const totalReviewPages = productData ? Math.ceil(productData.reviews.length / reviewsPerPage) : 0;
    const displayedReviews = productData ? productData.reviews.slice(reviewPage * reviewsPerPage, (reviewPage + 1) * reviewsPerPage) : [];

    const getLocalContent = (key) => {
        if (!productData) return "";
        return productData.content[language === 'vi' ? 'vi' : 'en'][key] || productData.content['en'][key];
    };

    if (isError) return <NotFound />;

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
            price: productData.price,
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
    const isOutOfStock = currentVariant ? currentVariant.stockQuantity === 0 : false;

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
                    </div>
                </div>

                <div className="product-info-side">
                    <div className="brand-label">{productData.brand}</div>
                    <h1 className="detail-title">{productData.name}</h1>

                    <div className="detail-tags">
                        <div className="rating-container">
                            <StarFilled style={{ color: '#ffc107', fontSize: '18px' }} />
                            <strong>{productData.rating}</strong>/5 ({productData.reviews_count} {t('reviews')})
                        </div>
                    </div>

                    <div className="flash-deal-banner">
                        <div className="flash-deal-left">
                            <span className="flash-icon"><ThunderboltFilled /></span> FLASH DEAL
                        </div>
                        <div className="flash-countdown">
                            <ClockCircleOutlined style={{ marginRight: '5px' }} /> {t('ends_in')}: <span>02</span>:<span>04</span>:<span>42</span>
                        </div>
                    </div>

                    <div className="price-box">
                        <div className="current-price">
                            {(currentVariant ? currentVariant.price : productData.price).toLocaleString("vi-VN")}đ
                            <span className="vat-tag">{t('vat_included')}</span>
                        </div>
                        <div className="old-price-row">
                            <span className="market-price">{t('market_price')}: {(currentVariant ? currentVariant.price * 1.2 : productData.original_price).toLocaleString("vi-VN")}đ</span>
                            <span className="save-price">{t('save')}: {((currentVariant ? currentVariant.price * 1.2 : productData.original_price) - (currentVariant ? currentVariant.price : productData.price)).toLocaleString("vi-VN")}đ</span>
                        </div>
                    </div>

                    <div className="product-options-section">
                        {productData.options && productData.options.map((opt, idx) => (
                            <div key={idx} className="option-group">
                                <span className="option-label">{opt.name}: <strong>{selectedOptions[opt.name]}</strong></span>
                                <div className="size-options">
                                    {opt.values.map(val => {
                                        // check if variant exists for this choice if want to disable, but simple approach is fine
                                        return (
                                            <button
                                                key={val}
                                                className={`size-btn ${selectedOptions[opt.name] === val ? 'active' : ''}`}
                                                onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}
                                            >
                                                {val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="stock-info" style={{ marginTop: 10, color: '#666', fontSize: '0.95rem' }}>
                            {t('in_stock_label')} <strong>{currentVariant ? currentVariant.stockQuantity : 0}</strong> {t('items_available')}
                        </div>

                        <div className="option-group">
                            <span className="option-label">{t('quantity')}:</span>
                            <div className="input-quantity-wrapper">
                                <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                                <input type="text" className="qty-input" value={quantity} readOnly />
                                <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="shipping-info-box">
                        <div className="shipping-header">
                            <span className="now-free-icon">{t('now_free_badge')}</span>
                            <strong>{t('fast_delivery_2h')}</strong>
                        </div>
                        <div className="shipping-desc">
                            {t('fast_delivery_details_ext')}
                            <span className="link-text">{t('view_more')}</span>
                        </div>
                    </div>

                    <div className="actions">
                        <button className={`btn-buy-now ${isOutOfStock ? 'disabled' : ''}`} disabled={isOutOfStock}>
                            <span className="btn-main-text">{isOutOfStock ? t('out_of_stock_btn') : t('buy_now')}</span>
                        </button>
                        <button className={`btn-add-bag ${isOutOfStock ? 'disabled' : ''}`} onClick={handleAddToCart} disabled={isOutOfStock}>
                            <ShoppingOutlined style={{ marginRight: '8px' }} /> {isOutOfStock ? t('out_of_stock_btn') : t('add_to_cart')}
                        </button>
                    </div>
                </div>
            </div>

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
                                                        <StarFilled />
                                                    </span>
                                                ))}
                                                {rev.verified && <span className="verified-tag"><CheckCircleFilled className="icon-check" /> {t('verified_purchase')}</span>}
                                            </div>
                                            <div className="review-text">
                                                {rev.content}
                                            </div>
                                            <div className="review-actions">
                                                <button className="action-btn">
                                                    <HeartOutlined className="icon-action" /> {t('like')}
                                                </button>
                                                <button className="action-btn">
                                                    <MessageOutlined className="icon-action" /> {t('comment')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination
                                page={reviewPage}
                                totalPages={totalReviewPages}
                                onPageChange={setReviewPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="recommendations-section">
                <h2 className="section-title">{t('related_products')}</h2>
                <div className="product-grid related-products-grid">
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
