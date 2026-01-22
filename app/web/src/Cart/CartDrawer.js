import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import './CartDrawer.css';

// Mock Image
import product_img from "../Assets/Images/Products/product_placeholder.svg";

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState(new Set());

    const handleSelect = (cartId) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(cartId)) newSelected.delete(cartId);
        else newSelected.add(cartId);
        setSelectedIds(newSelected);
    };

    const selectedTotal = cartItems
        .filter(item => selectedIds.has(item.cartId))
        .reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : 0) * item.quantity, 0);

    const handleCheckout = () => {
        if (selectedIds.size === 0) return alert(t('select_min_one')); // Basic alert

        closeCart();
        const selectedProducts = cartItems.filter(item => selectedIds.has(item.cartId));

        navigate('/checkout', {
            state: {
                cartIds: Array.from(selectedIds),
                selectedProducts: selectedProducts,
                subTotal: selectedTotal,
                discount: 0,
                total: selectedTotal
            }
        });
    };

    const handleViewCart = () => {
        closeCart();
        navigate('/cart');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`cart-backdrop ${isCartOpen ? 'open' : ''}`}
                onClick={closeCart}
            ></div>

            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <h3>{t('cart')} ({cartItems.length})</h3>
                    <button className="close-btn" onClick={closeCart}>&times;</button>
                </div>

                <div className="cart-drawer-body">
                    {cartItems.length === 0 ? (
                        <p className="empty-msg">{t('cart_empty')}</p>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div key={idx} className="drawer-item">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(item.cartId)}
                                    onChange={() => handleSelect(item.cartId)}
                                    style={{ marginRight: '10px' }}
                                />
                                <img src={product_img} alt={item.name} className="item-img" />
                                <div className="item-details">
                                    <p className="item-name">{item.name}</p>
                                    <div className="item-meta">
                                        <span className="item-qty">x{item.quantity}</span>
                                        <span className="item-price">
                                            {typeof item.price === 'number'
                                                ? item.price.toLocaleString('vi-VN') + 'đ'
                                                : item.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-drawer-footer">
                    <div className="total-row">
                        <span>{t('subtotal')}:</span>
                        <span className="total-price">{selectedTotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="action-buttons">
                        <button className="btn-view-cart" onClick={handleViewCart}>{t('view_cart')}</button>
                        <button className="btn-checkout" onClick={handleCheckout} disabled={selectedIds.size === 0}>
                            {t('checkout_now')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
