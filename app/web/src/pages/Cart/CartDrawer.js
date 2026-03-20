import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, Avatar, Button, Checkbox, Typography, Space } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../Context/CartContext';
import { useLanguage } from '../../i18n/LanguageContext';
import './CartDrawer.css';

import dummy1 from '../../Assets/Images/Products/product_dummy_1.jpg';
import dummy2 from '../../Assets/Images/Products/product_dummy_2.jpg';
import dummy3 from '../../Assets/Images/Products/product_dummy_3.jpg';
import dummy4 from '../../Assets/Images/Products/product_dummy_4.jpg';
import dummy5 from '../../Assets/Images/Products/product_dummy_5.svg';

const dummyImages = [dummy1, dummy2, dummy3, dummy4, dummy5];
const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

const { Text, Title } = Typography;

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
        .reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : 0) * item.quantity, 0);

    const handleCheckout = () => {
        if (selectedIds.size === 0) return;

        closeCart();
        const selectedProducts = cartItems.filter(item => selectedIds.has(item.cartId));

        navigate('/checkout', {
            state: {
                cartIds: Array.from(selectedIds),
                selectedProducts,
                subTotal: selectedTotal,
                discount: 0,
                total: selectedTotal
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
                <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleCheckout}
                    disabled={selectedIds.size === 0}
                    className="cart-drawer-checkout-btn"
                >
                    {t('checkout_now')} ({selectedIds.size})
                </Button>
                <Button block size="large" onClick={() => { closeCart(); navigate('/cart'); }}>
                    {t('view_cart')}
                </Button>
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
            footer={footer}
            className="cart-drawer-antd"
        >
            {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                    <div className="empty-cart-icon-wrapper">
                        <ShoppingCartOutlined className="empty-cart-icon" />
                    </div>
                    <Title level={4} className="empty-cart-title">{t('cart_empty')}</Title>
                    <Text type="secondary" className="empty-cart-desc">{t('cart_empty_desc')}</Text>
                    <Button type="primary" size="large" onClick={() => { closeCart(); navigate('/product'); }}>
                        {t('continue_shopping')}
                    </Button>
                </div>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={item => (
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
                                        <Avatar shape="square" size={64} src={item.image || getRandomImage()} />
                                    </div>
                                }
                                title={<Text ellipsis={{ tooltip: item.name }} className="cart-drawer-item-title">{item.name}</Text>}
                                description={
                                    <div className="cart-drawer-item-desc">
                                        <Text type="secondary">x{item.quantity}</Text>
                                        <Text strong className="cart-drawer-item-price">
                                            {item.price?.toLocaleString('vi-VN')}đ
                                        </Text>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Drawer>
    );
};

export default CartDrawer;
