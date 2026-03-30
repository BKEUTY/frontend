import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Rate, Typography, Space, Tag } from 'antd';
import { getImageUrl } from '../../api/axiosClient';
import './ProductCard.css';

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
    const hasDiscount = product.originPrice > 0 && product.discountPrice > 0 && product.discountPrice < product.originPrice;
    const rating = parseFloat(product.rating || 4.8);
    const tag = hasDiscount ? t('promotion') : product.tag;
    const productId = product.productId;

    const handleClick = () => {
        navigate(`/product/${product.variantName}`, { state: { productId } });
    };

    const CardContent = (
        <Card
            hoverable
            className="product-card-antd product-card"
            cover={
                <div className="card-image-wrapper">
                    <img alt={product.variantName} src={image} onError={(e) => { e.target.src = fallbackImg }} loading="lazy" />
                </div>
            }
            onClick={handleClick}
            bordered={false}
        >
            <div className="card-info">
                <Space size="small" className="card-brand-cat">
                    <Text type="secondary" className="card-brand">{product.brand.toUpperCase()}</Text>
                </Space>

                <Title level={5} className="card-name" ellipsis={{ rows: 2 }}>{product.variantName}</Title>

                {product.categories && product.categories.length > 0 && (
                    <div className="card-categories-wrapper">
                        {product.categories.slice(0, 2).map((cat) => (
                            <span key={cat.id} className="card-category-pill">
                                {cat.categoryName}
                            </span>
                        ))}
                        {product.categories.length > 2 && (
                            <span className="card-category-pill plus-more">
                                +{product.categories.length - 2}
                            </span>
                        )}
                    </div>
                )}

                <Space size="small" align="center" className="card-rating">
                    <Rate disabled defaultValue={rating} allowHalf className="card-rating-stars" />
                    {/* <Text type="secondary" className="card-sold-count">({product.sold})</Text> */}
                </Space>

                <div className="price-stock-row">
                    <div className="price-col">
                        {hasDiscount && (
                            <Text delete className="card-old-price">
                                {product.originPrice.toLocaleString('vi-VN')}đ
                            </Text>
                        )}
                        <Text className="card-price">
                            {product.discountPrice.toLocaleString('vi-VN')}đ
                        </Text>
                    </div>
                    <Tag color={product.stock > 0 ? 'green' : 'red'} className="stock-tag">
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
