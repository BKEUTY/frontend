import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartApi from '../api/cartApi';
import axiosClient from '../api/axiosClient';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const { user, isAuthenticated, user_role } = useAuth();
    
    const LOCAL_CART_KEY = 'bkeuty_guest_cart';

    const fetchCart = useCallback(async () => {
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
            } catch (error) {
                console.error("Failed to fetch cart items:", error);
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
            setCartItems(localCart);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const syncCartOnLogin = async () => {
            if (isAuthenticated && user_role === 'USER') {
                const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                if (localCart.length > 0) {
                    for (const item of localCart) {
                        try {
                            await cartApi.add({
                                productVariantId: item.variantId || item.productId || item.id,
                                quantity: item.quantity
                            });
                        } catch (e) {
                            console.error("Failed to sync item:", e);
                        }
                    }
                    localStorage.removeItem(LOCAL_CART_KEY);
                }
                fetchCart();
            }
        };
        syncCartOnLogin();
    }, [isAuthenticated, user_role, user?.id, fetchCart]);

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
                    productVariantId: product.productVariantId,
                    quantity: quantityToAdd
                });
                await fetchCart();
            } catch (error) {
                console.error("Failed to add to cart:", error);
            }
        } else {
            const localCart = [...cartItems];
            const existingIdx = localCart.findIndex(item => item.productVariantId === product.productVariantId || (item.id === product.id && !item.productVariantId));
            if (existingIdx > -1) {
                localCart[existingIdx].quantity += quantityToAdd;
            } else {
                localCart.push({ 
                    ...product, 
                    cartId: product.cartId || `local_${Date.now()}`, 
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
