import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Rate, Typography, Tag } from 'antd';
import { getImageUrl } from '../../api/axiosClient';
import './ProductCard.css';
import { generateSlug } from '../../utils/helpers';

import dummy1 from '../../Assets/Images/Products/product_dummy_1.jpg';
import dummy2 from '../../Assets/Images/Products/product_dummy_2.jpg';
import dummy3 from '../../Assets/Images/Products/product_dummy_3.jpg';
import dummy4 from '../../Assets/Images/Products/product_dummy_4.jpg';
import dummy5 from '../../Assets/Images/Products/product_dummy_5.svg';

const dummyImages = [dummy1, dummy2, dummy3, dummy4, dummy5];
const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

const { Text, Title } = Typography;

const ProductCard = ({ product, t }) => {
    const navigate = useNavigate();
    const fallbackImg = useMemo(() => getRandomImage(), []);

    const image = product.imgUrl ? getImageUrl(product.imgUrl) : fallbackImg;
    const hasDiscount = product.discountPrice < product.originPrice;
    const tag = hasDiscount ? t('promotion') : product.tag;
    const productId = product.productId;

    const handleClick = () => {
        const slug = generateSlug(product.variantName, productId);
        navigate(`/product/${slug}`, { state: { productId } });
    };

    const CardContent = (
        <Card
            hoverable
            className="product-card-wrapper product-card"
            cover={
                <div className="card-img-container">
                    <img alt={product.variantName} src={image} onError={(e) => { e.target.src = fallbackImg }} loading="lazy" />
                </div>
            }
            onClick={handleClick}
            variant="outlined"
        >
            <div className="card-body-content">
                <div className="card-brand-wrap">
                    <Text type="secondary" className="card-brand-text">{product.brand?.toUpperCase()}</Text>
                </div>

                <Title level={5} className="card-product-name" ellipsis={{ rows: 2 }}>{product.variantName}</Title>

                {product.categories && product.categories.length > 0 && (
                    <div className="card-cat-pills">
                        {product.categories.slice(0, 2).map((cat) => (
                            <span key={cat.id} className="cat-pill">
                                {cat.categoryName}
                            </span>
                        ))}
                        {product.categories.length > 2 && (
                            <span className="cat-pill plus-pill">
                                +{product.categories.length - 2}
                            </span>
                        )}
                    </div>
                )}

                <div className="card-rating-wrap">
                    <div className="card-stars-tooltip" data-rating={`${Number(product.averageRating || 0).toFixed(1)} ${t('rating')}`}>
                        <Rate disabled defaultValue={product.averageRating} allowHalf className="card-stars" />
                    </div>
                    <Text type="secondary" className="card-review-txt">({product.reviewCount} {t('reviews')})</Text>
                </div>

                <div className="card-footer-row">
                    <div className="card-price-col">
                        {hasDiscount && (
                            <Text delete className="card-price-old">
                                {product.originPrice.toLocaleString('vi-VN')}đ
                            </Text>
                        )}
                        <Text className={`card-price-current ${hasDiscount ? 'is-discounted' : ''}`}>
                            {product.discountPrice.toLocaleString('vi-VN')}đ
                        </Text>
                    </div>
                    <Tag color={product.stock > 0 ? 'green' : 'red'} className="card-stock-tag">
                        {product.stock > 0 ? `${t('in_stock')} ${product.stock}` : t('out_of_stock_btn')}
                    </Tag>
                </div>
            </div>
        </Card>
    );

    if (tag) {
        return <Badge.Ribbon text={tag} color="pink">{CardContent}</Badge.Ribbon>;
    }

    return CardContent;
};

export default ProductCard;
