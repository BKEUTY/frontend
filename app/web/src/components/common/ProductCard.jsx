import { generateSlug, PRODUCT_IMAGE_FALLBACK } from '@/utils/helpers';
import { Card, Rate, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/axiosClient';
import './ProductCard.css';
import Skeleton from './Skeleton';

const ProductCard = ({ product, t, isLoading = false, priority = false }) => {
    const navigate = useNavigate();
    const fallbackImg = PRODUCT_IMAGE_FALLBACK;

    if (isLoading) {
        return (
            <Card
                className="product-card-wrapper product-card"
                cover={
                    <div className="card-img-container">
                        <Skeleton width="100%" height="100%" borderRadius="24px 24px 0 0" style={{ position: 'absolute', top: 0, left: 0 }} />
                    </div>
                }
                variant="outlined"
            >
                <div className="card-body-content">
                    <div className="card-brand-wrap" style={{ marginBottom: '8px' }}>
                        <Skeleton width="40%" height="12px" borderRadius="100px" />
                    </div>
                    <div style={{ height: '2.8rem', overflow: 'hidden', marginBottom: '10px' }}>
                        <Skeleton width="100%" height="20px" borderRadius="4px" style={{ marginBottom: '4px' }} />
                        <Skeleton width="70%" height="20px" borderRadius="4px" />
                    </div>
                    <div className="card-rating-wrap" style={{ marginBottom: '16px' }}>
                        <Skeleton width="50%" height="12px" borderRadius="4px" />
                    </div>
                    <div className="card-footer-row" style={{ marginTop: 'auto' }}>
                        <div className="card-price-row">
                            <Skeleton width="60%" height="24px" borderRadius="4px" />
                        </div>
                        <div className="stock-sold-wrapper" style={{ marginTop: '4px' }}>
                            <Skeleton width="100%" height="20px" borderRadius="10px" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    if (!product) return null;

    // Normalize data from different DTOs (Chatbot vs Product Service)
    const productId = product.productId || product.id;
    const name = product.variantName || product.name;
    const imagePath = product.imageUrl || product.image;
    const image = imagePath ? getImageUrl(imagePath) : fallbackImg;
    
    const currentPrice = product.discountPrice !== undefined && product.discountPrice !== null ? product.discountPrice : (product.promotionPrice ?? product.originPrice ?? 0);
    const oldPrice = product.originPrice ?? 0;
    const hasDiscount = currentPrice < oldPrice;

    const handleClick = () => {
        const slug = generateSlug(name, productId);
        navigate(`/product/${slug}`, { state: { productId } });
    };

    return (
        <Card
            hoverable
            className="product-card-wrapper product-card"
            cover={
                <div className="card-img-container">
                    <img 
                        alt={name} 
                        src={image} 
                        onError={(e) => { e.target.src = fallbackImg }} 
                        loading={priority ? undefined : "lazy"}
                        fetchpriority={priority ? "high" : undefined}
                        width="228"
                        height="228"
                    />
                    {hasDiscount && (
                        <div className={`card-promo-tag ${product.appliedPromotionType === 'UserPromotion' ? 'user-promo-tag' : ''}`}>
                            {product.appliedPromotionType === 'UserPromotion' ? t('promo_type_userpromotion') : t('promotion')}
                        </div>
                    )}
                </div>
            }
            onClick={handleClick}
            variant="outlined"
        >
            <div className="card-body-content">
                <div className="card-brand-wrap">
                    <span className="card-brand-text">{product.brand?.toUpperCase()}</span>
                </div>

                <h3 className="card-product-name">{name}</h3>

                {product.categories && product.categories.length > 0 && (
                    <div className="card-cat-pills">
                        {product.categories.slice(0, 2).map((cat) => (
                            <span key={cat.id || cat.categoryName} className="cat-pill">
                                {cat.categoryName}
                            </span>
                        ))}
                    </div>
                )}

                <div className="card-rating-wrap">
                    <Tooltip title={`${Number(product.averageRating || 0).toFixed(1)} ${t('rating')}`}>
                        <div className="card-stars-wrapper">
                            <Rate disabled value={product.averageRating || 0} allowHalf className="card-stars" />
                        </div>
                    </Tooltip>
                    <span className="card-review-txt">({product.reviewCount || 0} {t('reviews')})</span>
                </div>

                <div className="card-footer-row">
                    <div className="card-price-row">
                        <span className={`card-price-current ${hasDiscount ? 'is-discounted' : ''}`}>
                            {Number(currentPrice).toLocaleString('vi-VN')}đ
                        </span>
                        {hasDiscount && (
                            <span className="card-price-old">
                                {Number(oldPrice).toLocaleString('vi-VN')}đ
                            </span>
                        )}
                    </div>

                    <div className="stock-sold-wrapper">
                        <div className={`stock-status ${(product.stockQuantity ?? 1) > 0 ? 'is-available' : 'is-unavailable'}`}>
                            <span>
                                {(product.stockQuantity ?? 1) > 0 
                                    ? `${t('in_stock')} ${product.stockQuantity ?? ''}` 
                                    : t('out_of_stock_btn')}
                            </span>
                        </div>
                        <div className="sold-status">
                            <span>
                                {t('sold')} {product.sold || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
