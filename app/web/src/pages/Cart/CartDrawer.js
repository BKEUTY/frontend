import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, Avatar, Button, Checkbox, Typography, Space, Divider } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../Context/CartContext';
import { useLanguage } from '../../i18n/LanguageContext';
import product_img from "../../Assets/Images/Products/product_placeholder.svg";
import './CartDrawer.css';

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
                <Text strong>{t('subtotal')}:</Text>
                <Title level={4} style={{ margin: 0, color: '#c2185b' }}>
                    {selectedTotal.toLocaleString('vi-VN')}đ
                </Title>
            </div>
            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleCheckout}
                    disabled={selectedIds.size === 0}
                    style={{ background: '#c2185b', borderColor: '#c2185b' }}
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
            width={400}
            footer={footer}
            className="cart-drawer-antd"
        >
            {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                    <div className="empty-cart-icon-wrapper">
                        <ShoppingCartOutlined className="empty-cart-icon" />
                    </div>
                    <Title level={4} style={{ marginTop: 16 }}>{t('cart_empty')}</Title>
                    <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>{t('cart_empty_desc')}</Text>
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
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Checkbox
                                            checked={selectedIds.has(item.cartId)}
                                            onChange={() => toggleSelect(item.cartId)}
                                        />
                                        <Avatar shape="square" size={64} src={item.image || product_img} />
                                    </div>
                                }
                                title={<Text ellipsis={{ tooltip: item.name }} style={{ width: 140 }}>{item.name}</Text>}
                                description={
                                    <Space direction="vertical" size={2}>
                                        <Text type="secondary">x{item.quantity}</Text>
                                        <Text strong style={{ color: '#c2185b' }}>
                                            {item.price?.toLocaleString('vi-VN')}đ
                                        </Text>
                                    </Space>
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
