import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, Avatar, Checkbox, Typography, Space, Button } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '@/store/CartContext';
import { useLanguage } from '@/store/LanguageContext';
import { CButton, EmptyState } from '@/components/common';
import { generateSlug, PRODUCT_IMAGE_FALLBACK } from '@/utils/helpers';
import './CartDrawer.css';
import { getImageUrl, getOptimizedImageUrl } from "@/services/axiosClient";

const { Text } = Typography;

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems, removeFromCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState(new Set());

    const handleItemClick = (name, productVariantId) => {
        closeCart();
        const slug = generateSlug(name, productVariantId);
        navigate(`/product/${slug}`, { state: { productId: productVariantId } });
    };

    const toggleSelect = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const selectedTotal = cartItems
        .filter(item => selectedIds.has(item.cartId))
        .reduce((sum, item) => sum + (item.promotionPrice ?? item.price ?? 0) * item.quantity, 0);

    const selectedTotalItemsCount = cartItems
        .filter(item => selectedIds.has(item.cartId))
        .reduce((sum, item) => sum + (item.quantity || 1), 0);

    const totalItemsInCart = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

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
            <Space orientation="vertical" className="cart-drawer-btn-space">
                <CButton type="primary" block size="large" onClick={handleCheckout} disabled={selectedIds.size === 0}>
                    {t('checkout_now')} ({selectedTotalItemsCount})
                </CButton>
                <CButton type="secondary" block size="large" onClick={() => { closeCart(); navigate('/cart'); }}>
                    {t('view_cart')}
                </CButton>
            </Space>
        </div>
    );

    return (
        <Drawer
            title={`${t('cart')} (${totalItemsInCart})`}
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
                        const hasDiscount = item.promotionPrice !== undefined && item.promotionPrice !== null && item.promotionPrice < item.price;

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
                                                onClick={() => handleItemClick(item.name, item.productVariantId)}
                                                style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <img 
                                                    src={item.image ? getOptimizedImageUrl(item.image, 256) : PRODUCT_IMAGE_FALLBACK}
                                                    onError={(e) => { e.target.src = PRODUCT_IMAGE_FALLBACK }}
                                                    alt="product"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </Avatar>
                                        </div>
                                    }
                                    title={
                                        <Text 
                                            ellipsis={{ tooltip: item.name }} 
                                            className="cart-drawer-item-title"
                                            onClick={() => handleItemClick(item.name, item.productVariantId)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.name}
                                        </Text>
                                    }
                                    description={
                                        <div className="cart-drawer-item-desc">
                                            <Text type="secondary">x{item.quantity}</Text>
                                            <div className="cart-drawer-price-row">
                                                 <Text strong className="cart-drawer-item-price">
                                                     {(item.promotionPrice ?? item.price ?? 0).toLocaleString('vi-VN')}đ
                                                 </Text>
                                                 {hasDiscount && (
                                                     <Text delete className="cart-drawer-item-old-price">
                                                         {(item.price ?? 0).toLocaleString('vi-VN')}đ
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
