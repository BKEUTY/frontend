import { generateSlug } from '@/utils/helpers';
import { Card, Rate, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/axiosClient';
import './ProductCard.css';
import Skeleton from './Skeleton';

import dummy1 from '@/assets/images/products/product_dummy_1.jpg';
import dummy2 from '@/assets/images/products/product_dummy_2.jpg';
import dummy3 from '@/assets/images/products/product_dummy_3.jpg';
import dummy4 from '@/assets/images/products/product_dummy_4.jpg';
import dummy5 from '@/assets/images/products/product_dummy_5.svg';

const dummyImages = [dummy1, dummy2, dummy3, dummy4, dummy5];
const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

const ProductCard = ({ product, t, isLoading = false }) => {
    const navigate = useNavigate();
    const fallbackImg = useMemo(() => getRandomImage(), []);

    if (isLoading) {
        return (
            <Card
                className="product-card-wrapper product-card"
                cover={<Skeleton width="100%" height="240px" borderRadius="16px 16px 0 0" />}
                variant="outlined"
            >
                <div className="p-4 flex flex-col flex-1">
                    <Skeleton width="40%" height="12px" borderRadius="100px" className="mb-2.5" />
                    <Skeleton width="100%" height="20px" borderRadius="4px" className="mb-2.5" />
                    <Skeleton width="100%" height="20px" borderRadius="4px" className="mb-5" />
                    <div className="mt-auto pt-3 border-t border-dashed border-[#e2e8f0] flex items-end justify-between gap-2">
                        <Skeleton width="60%" height="24px" borderRadius="4px" />
                        <Skeleton width="30%" height="20px" borderRadius="4px" />
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
                    <img alt={name} src={image} onError={(e) => { e.target.src = fallbackImg }} loading="lazy" />
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
                            <Rate disabled defaultValue={product.averageRating || 0} allowHalf className="card-stars" />
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
