import React from 'react';
import { useNavigate } from 'react-router-dom';
import starIcon from '../../Assets/Images/Icons/icon_star.svg';
import placeHolderImg from '../../Assets/Images/Products/product_placeholder.svg';
import './ProductCard.css';

const ProductCard = ({ product, t, language, onClickData }) => {
    const navigate = useNavigate();

    // Normalizing properties since different parents might pass different structures
    const id = product.id || product.productId;
    const name = product.name;
    const price = typeof product.price === 'number' ? `${product.price.toLocaleString("vi-VN")}đ` : product.price;
    const brand = product.brand || 'BKEUTY';
    const image = product.image || placeHolderImg;
    const rating = product.rating || '4.8';

    // Handle sold count - if it comes as string with text, try to extract number or just use it.
    // Ideally it should be a number.
    let sold = product.sold || 120;
    if (typeof sold === 'string' && (sold.includes('sold') || sold.includes('đã bán'))) {
        sold = parseInt(sold); // Extract number if possible
        if (isNaN(sold)) sold = 120;
    }

    // Badges/Discounts (checking if they exist)
    const discount = product.discount || null;
    const tag = product.tag || null;

    const handleClick = () => {
        if (onClickData) {
            navigate(`/product/${id}`, { state: onClickData });
        } else {
            navigate(`/product/${id}`);
        }
    };

    return (
        <div className="product-card" onClick={handleClick}>
            {(discount || tag) && (
                <div className="card-badges">
                    {tag && <span className="badge-red">{tag}</span>}
                    {discount && <span className="badge-yellow">-{discount}</span>}
                </div>
            )}

            <div className="card-image-wrapper">
                <img src={image} alt={name} loading="lazy" />
            </div>

            <div className="card-info">
                <p className="card-brand">{brand}</p>
                <h3 className="card-name">{name}</h3>
                <div className="card-meta">
                    <span
                        className="star-icon"
                        style={{ maskImage: `url(${starIcon})`, WebkitMaskImage: `url(${starIcon})` }}
                    ></span>
                    <span className="rating">{rating}/5</span>
                    <span className="sold">({sold} {t ? t('sold_count') : 'sold'})</span>
                </div>

                <div className="price-row">
                    {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                    <span className="card-price new-price">{price}</span>
                </div>

                {/* Optional Add to Cart Button if needed, but card usually navigates */}
            </div>
        </div>
    );
};

export default ProductCard;
