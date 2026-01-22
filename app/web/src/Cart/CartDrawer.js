import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import './CartDrawer.css';

// Mock Image
import product_img from "../Assets/Images/Products/product_placeholder.svg";

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
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
                    <h3>Giỏ hàng ({cartItems.length})</h3>
                    <button className="close-btn" onClick={closeCart}>&times;</button>
                </div>

                <div className="cart-drawer-body">
                    {cartItems.length === 0 ? (
                        <p className="empty-msg">Chưa có sản phẩm nào trong giỏ hàng.</p>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div key={idx} className="drawer-item">
                                <img src={product_img} alt={item.name} className="item-img" />
                                <div className="item-details">
                                    <p className="item-name">{item.name}</p>
                                    <div className="item-meta">
                                        <span className="item-qty">x{item.quantity}</span>
                                        <span className="item-price">{item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-drawer-footer">
                    <div className="total-row">
                        <span>Tạm tính:</span>
                        <span className="total-price">1.500.000đ</span>
                    </div>
                    <div className="action-buttons">
                        <button className="btn-view-cart" onClick={handleViewCart}>Xem giỏ hàng</button>
                        <button className="btn-checkout" onClick={handleCheckout}>Thanh toán ngay</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
