import React, { createContext, useState, useContext, useEffect } from 'react';

import { useAuth } from './AuthContext';
import cartApi from '../api/cartApi';
import { useLocation } from 'react-router-dom';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const { user, isAuthenticated, role } = useAuth();
    const location = useLocation();
    const userId = user?.id || 1;

    const isAdminPath = location.pathname.startsWith('/admin');

    const fetchCart = async () => {
        if (role === 'ADMIN' || !isAuthenticated || isAdminPath) return;

        try {
            const res = await cartApi.getAll();
            if (res.status === 200) {
                const data = res.data;
                const mapped = data.map(item => ({
                    ...item,
                    id: item.productId || item.id,
                    image: item.image || 'placeholder',
                }));
                setCartItems(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    };

    useEffect(() => {
        // Only fetch for non-admins and non-admin routes
        if (isAuthenticated && role !== 'ADMIN' && !isAdminPath) {
            fetchCart();
        }
    }, [role, isAuthenticated, isAdminPath]);

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id && item.variantId === product.variantId);
            if (existing) {
                return prev.map(item => (item.id === product.id && item.variantId === product.variantId) ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item);
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
        setIsCartOpen(true);

        try {
            await cartApi.add({
                userId: userId,
                productId: product.id || product.productId,
                variantId: product.variantId
            });

            await fetchCart();
        } catch (error) {
            console.error("Failed to add to cart API", error);
        }
    };

    const updateQuantity = async (cartId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: quantity } : item));
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    return (
        <CartContext.Provider value={{ isCartOpen, toggleCart, openCart, closeCart, cartItems, setCartItems, addToCart, fetchCart, updateQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
