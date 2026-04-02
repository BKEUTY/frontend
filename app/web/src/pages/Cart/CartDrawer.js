import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, Avatar, Checkbox, Typography, Space, Button } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../Context/CartContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { CButton, EmptyState } from '../../Component/Common';
import './CartDrawer.css';
import product_cart_image from "../../Assets/Images/Products/product_placeholder_rect.svg";
import { getImageUrl } from "../../api/axiosClient";

const { Text } = Typography;

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems, removeFromCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState(new Set());

    const toggleSelect = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const selectedTotal = cartItems
        .filter(item => selectedIds.has(item.cartId))
        .reduce((sum, item) => sum + item.promotionPrice * item.quantity, 0);

    const handleCheckout = () => {
        if (selectedIds.size === 0) return;
        closeCart();
        const selectedProducts = cartItems.filter(item => selectedIds.has(item.cartId));
        navigate('/checkout', {
            state: {
                cartIds: Array.from(selectedIds),
                selectedProducts: selectedProducts.map(p => ({
                    ...p,
                    effectivePrice: p.promotionPrice,
                })),
                subTotal: selectedTotal,
                discount: 0,
                total: selectedTotal,
            }
        });
    };

    const footer = (
        <div className="cart-drawer-footer-content">
            <div className="total-row">
                <span className="total-label">{t('subtotal')}:</span>
                <span className="total-amount">{selectedTotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <Space direction="vertical" className="cart-drawer-btn-space">
                <CButton type="primary" block size="large" onClick={handleCheckout} disabled={selectedIds.size === 0}>
                    {t('checkout_now')} ({selectedIds.size})
                </CButton>
                <CButton type="secondary" block size="large" onClick={() => { closeCart(); navigate('/cart'); }}>
                    {t('view_cart')}
                </CButton>
            </Space>
        </div>
    );

    return (
        <Drawer
            title={`${t('cart')} (${cartItems.length})`}
            placement="right"
            onClose={closeCart}
            open={isCartOpen}
            size="default"
            footer={cartItems.length > 0 ? footer : null}
            className="cart-drawer-antd"
        >
            {cartItems.length === 0 ? (
                <div className="cart-empty-container">
                    <EmptyState
                        icon={<ShoppingCartOutlined className="cart-empty-icon" />}
                        title={t('cart_empty')}
                        description={t('cart_empty_desc')}
                        actionText={t('continue_shopping')}
                        onAction={() => { closeCart(); navigate('/product'); }}
                    />
                </div>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={item => {
                        const hasDiscount = item.promotionPrice > 0 && item.promotionPrice < item.price;

                        return (
                            <List.Item
                                actions={[
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeFromCart(item.cartId)}
                                        className="cart-drawer-delete-btn"
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div className="cart-drawer-avatar-wrap">
                                            <Checkbox
                                                checked={selectedIds.has(item.cartId)}
                                                onChange={() => toggleSelect(item.cartId)}
                                            />
                                            <Avatar 
                                                shape="square" 
                                                size={64} 
                                                src={item.image ? getImageUrl(item.image) : product_cart_image} 
                                            />
                                        </div>
                                    }
                                    title={
                                        <Text ellipsis={{ tooltip: item.name }} className="cart-drawer-item-title">
                                            {item.name}
                                        </Text>
                                    }
                                    description={
                                        <div className="cart-drawer-item-desc">
                                            <Text type="secondary">x{item.quantity}</Text>
                                            <div className="cart-drawer-price-row">
                                                <Text strong className="cart-drawer-item-price">
                                                    {item.promotionPrice.toLocaleString('vi-VN')}đ
                                                </Text>
                                                {hasDiscount && (
                                                    <Text delete className="cart-drawer-item-old-price">
                                                        {item.price.toLocaleString('vi-VN')}đ
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
        </Drawer>
    );
};

export default CartDrawer;
