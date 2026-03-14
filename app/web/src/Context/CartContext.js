import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartApi from '../api/cartApi';
import axiosClient from '../api/axiosClient';
import { useLocation } from 'react-router-dom';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const { user, isAuthenticated, role } = useAuth();
    const location = useLocation();
    
    const isAdminPath = location.pathname.startsWith('/admin');
    const LOCAL_CART_KEY = 'bkeuty_guest_cart';

    const fetchCart = useCallback(async () => {
        if (role === 'ADMIN' || isAdminPath) return;

        if (isAuthenticated) {
            try {
                const res = await cartApi.getAll();
                if (res.status === 200 || res.data) {
                    const data = res.data || [];
                    const mapped = data.map(item => ({
                        ...item,
                        id: item.productId || item.id,
                        image: item.image || 'placeholder',
                    }));
                    setCartItems(mapped);
                }
            } catch (error) {}
        } else {
            const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
            setCartItems(localCart);
        }
    }, [isAuthenticated, role, isAdminPath]);

    useEffect(() => {
        const syncCartOnLogin = async () => {
            if (isAuthenticated && role === 'USER') {
                const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                if (localCart.length > 0) {
                    for (const item of localCart) {
                        try {
                            await cartApi.add({
                                userId: user?.id,
                                productId: item.productId || item.id,
                                variantId: item.variantId,
                                quantity: item.quantity
                            });
                        } catch (e) {}
                    }
                    localStorage.removeItem(LOCAL_CART_KEY);
                }
                fetchCart();
            }
        };
        syncCartOnLogin();
    }, [isAuthenticated, role, user?.id, fetchCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const saveLocalCart = (items) => {
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
        setCartItems(items);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (product) => {
        setIsCartOpen(true);
        const quantityToAdd = product.quantity || 1;

        if (isAuthenticated) {
            try {
                await cartApi.add({
                    userId: user?.id,
                    productId: product.id || product.productId,
                    variantId: product.variantId,
                    quantity: quantityToAdd
                });
                await fetchCart();
            } catch (error) {}
        } else {
            const localCart = [...cartItems];
            const existingIdx = localCart.findIndex(item => item.id === product.id && item.variantId === product.variantId);
            if (existingIdx > -1) {
                localCart[existingIdx].quantity += quantityToAdd;
            } else {
                localCart.push({ 
                    ...product, 
                    cartId: `local_${Date.now()}`, 
                    quantity: quantityToAdd 
                });
            }
            saveLocalCart(localCart);
        }
    };

    const updateQuantity = async (cartId, quantity) => {
        if (quantity < 1) return;

        if (isAuthenticated) {
            setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
            try {
                await axiosClient.put(`/api/cart/${cartId}`, { quantity });
                fetchCart();
            } catch (error) {
                fetchCart();
            }
        } else {
            const localCart = cartItems.map(item => item.cartId === cartId ? { ...item, quantity } : item);
            saveLocalCart(localCart);
        }
    };

    const removeFromCart = async (cartId) => {
        if (isAuthenticated) {
            setCartItems(prev => prev.filter(item => item.cartId !== cartId));
            try {
                await axiosClient.delete(`/api/cart/${cartId}`);
                fetchCart();
            } catch (error) {
                fetchCart();
            }
        } else {
            const localCart = cartItems.filter(item => item.cartId !== cartId);
            saveLocalCart(localCart);
        }
    };

    return (
        <CartContext.Provider value={{ 
            isCartOpen, toggleCart, openCart, closeCart, 
            cartItems, setCartItems, addToCart, fetchCart, 
            updateQuantity, removeFromCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};
