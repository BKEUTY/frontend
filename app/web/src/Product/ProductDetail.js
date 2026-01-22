
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useNotification } from '../Context/NotificationContext';
import { useCart } from '../Context/CartContext';
import './ProductDetail.css';
import best_selling_image from "../Assets/Images/Products/product_placeholder.svg";
import starIcon from "../Assets/Images/Icons/icon_star.svg";

export default function ProductDetail() {
    const { id } = useParams();
    const { t, language } = useLanguage(); // Get language ('en', 'vi')
    const notify = useNotification();
    const { addToCart } = useCart();
    const location = useLocation();

    // Determine breadcrumb category based on state passed from navigation or default
    // If user clicked from "Skincare", location.state.category might be set
    const categoryName = location.state?.category || t('all_products');
    const categoryLink = location.state?.from || '/product';

    const productData = {
        id: id,
        name: "Beauty Prestige LA Micro-Huile De Rose Advanced Serum",
        brand: "Dior",
        price: 9250000,
        original_price: 10500000,
        rating: 4.8,
        reviews_count: 124,
        images: [
            best_selling_image,
            best_selling_image,
            best_selling_image,
            best_selling_image
        ],
        sizes: ["30ml", "50ml", "75ml"],

        // Localized Content
        content: {
            en: {
                description: "The first repair supplement enriched with the Rose de Granville's 22 micro-nutrients and the revitalizing power of Rose sap. It corrects the signs of aging and deeply renews the skin.",
                details: "La Micro-Huile de Rose Advanced Serum is the first repair supplement that concentrates the double power of the Rose de Granville. From the stem to the flower, this extraordinary rose offers a wealth of micro-nutrients essential for skin vitality.",
                application: "1. Dispense two to three pumps into the palm of your hand. Then, using the pads of the fingers, apply the serum to the entire face from the center outwards.\n2. Use gentle pressure to make the serum penetrate deeply.\n3. Finally, to enhance the contours, hold the chin between the index and middle fingers and move up the jawline.",
                ingredients: "Aqua (Water), Glycerin, Propanediol, Dimethicone, Limnanthes Alba (Meadowfoam) Seed Oil, ... (Full list usually here)",
                advance: "The new formula concentrates the nutritive power of the Rose de Granville's 22 micro-nutrients with the revitalizing power of its sap. This synergy allows for a correction of the signs of aging.",
                benefits_list: ["Revitalizing", "Repairing", "Anti-aging"],
            },
            vi: {
                description: "Tinh chất phục hồi đầu tiên được bổ sung 22 vi chất dinh dưỡng từ Hoa Hồng dòng Granville và sức mạnh tái tạo của nhựa hoa. Nó khắc phục các dấu hiệu lão hóa và đổi mới làn da từ sâu bên trong.",
                details: "La Micro-Huile de Rose Advanced Serum là tinh chất phục hồi đầu tiên tập trung sức mạnh kép của Hoa Hồng dòng Granville. Từ thân đến hoa, loài hoa hồng phi thường này cung cấp vô số vi chất dinh dưỡng cần thiết cho sức sống của làn da.",
                application: "1. Lấy hai đến ba lần bơm vào lòng bàn tay. Sau đó, dùng các đầu ngón tay thoa serum lên toàn bộ khuôn mặt từ giữa ra ngoài.\n2. Dùng lực ấn nhẹ để serum thẩm thấu sâu.\n3. Cuối cùng, để nâng cao đường nét, giữ cằm giữa ngón trỏ và ngón giữa và di chuyển lên đường viền hàm.",
                ingredients: "Nước (Aqua), Glycerin, Propanediol, Dimethicone, Dầu hạt Limnanthes Alba (Meadowfoam)... (Danh sách đầy đủ)",
                advance: "Công thức mới tập trung sức mạnh dinh dưỡng của 22 vi chất từ Hoa Hồng dòng Granville cùng sức mạnh tái tạo của nhựa hoa. Sự kết hợp này mang lại khả năng khắc phục các dấu hiệu lão hóa vượt trội.",
                benefits_list: ["Tái Tạo", "Phục Hồi", "Chống Lão Hóa"],
            }
        },
        reviews: [
            { user: "Sarah L.", date: "12 Oct 2023", rating: 5, content: "Absolutely amazing! My skin feels so soft and the glow is incredible.", verified: true },
            { user: "Minh Anh", date: "05 Nov 2023", rating: 4, content: "Đắt nhưng xắt ra miếng. Trải nghiệm rất sang chảnh.", verified: true }
        ]
    };

    // Helper to get current locale content safely
    const getLocalContent = (key) => {
        return productData.content[language === 'vi' ? 'vi' : 'en'][key] || productData.content['en'][key];
    };

    const [activeTab, setActiveTab] = useState('details');
    const [selectedSize, setSelectedSize] = useState(productData.sizes[0]);
    const [mainImage, setMainImage] = useState(productData.images[0]);
    const [quantity, setQuantity] = useState(1);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

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
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Code: #SKU-{id}</span>
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
                        <div className="tab-content">
                            <div className="review-stats">
                                <div className="big-rating">{productData.rating}</div>
                                <div>
                                    <div style={{ color: '#ffc107', fontSize: '1.2rem' }}>★★★★★</div>
                                    <div style={{ color: '#888' }}>Based on {productData.reviews_count} reviews</div>
                                </div>
                            </div>
                            {productData.reviews.map((rev, i) => (
                                <div key={i} className="review-item">
                                    <div className="review-header">
                                        <div className="reviewer-name">
                                            {rev.user}
                                            {rev.verified && <span className="verified-badge">✓ {t('verified_purchase')}</span>}
                                        </div>
                                        <div className="review-date">{rev.date}</div>
                                    </div>
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, starIdx) => (
                                            <span key={starIdx} style={{ opacity: starIdx < rev.rating ? 1 : 0.3, color: '#ffc107' }}>★</span>
                                        ))}
                                    </div>
                                    <p style={{ marginTop: '10px' }}>{rev.content}</p>
                                </div>
                            ))}
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
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="product-card">
                            <div className="card-image-wrapper">
                                <img src={best_selling_image} alt="Rel" />
                            </div>
                            <div className="card-info">
                                <p className="card-brand">Dior</p>
                                <h3 className="card-name">Capture Totale Cell Energy</h3>
                                <div className="card-price">3.500.000đ</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
