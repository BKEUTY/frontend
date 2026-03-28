import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartApi from '../api/cartApi';
import axiosClient from '../api/axiosClient';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const LOCAL_CART_KEY = 'bkeuty_guest_cart';

const getLocalCart = () => JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
const saveLocalCart = (items) => localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
const clearLocalCart = () => localStorage.removeItem(LOCAL_CART_KEY);

const mapCartItem = (item) => ({
    cartId: item.cartId,
    productVariantId: item.productVariantId,
    name: item.name || '',
    price: item.price ?? 0,
    promotionPrice: item.promotionPrice ?? item.price ?? 0,
    image: item.image || 'placeholder',
    quantity: item.quantity,
});

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated, user_role } = useAuth();

    const fetchCart = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const res = await cartApi.getAll();
                const data = res.data || [];
                setCartItems(data.map(mapCartItem));
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            }
        } else {
            setCartItems(getLocalCart());
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const syncCartOnLogin = async () => {
            if (!isAuthenticated || user_role !== 'USER') return;

            const localCart = getLocalCart();
            if (localCart.length > 0) {
                for (const item of localCart) {
                    try {
                        await cartApi.add({
                            productVariantId: item.productVariantId,
                            quantity: item.quantity,
                        });
                    } catch (e) {
                        console.error("Failed to sync cart item:", e);
                    }
                }
                clearLocalCart();
            }
            await fetchCart();
        };
        syncCartOnLogin();
    }, [isAuthenticated, user_role, fetchCart]);

    useEffect(() => {
        if (!isAuthenticated) {
            setCartItems(getLocalCart());
        }
    }, [isAuthenticated]);

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (product) => {
        setIsCartOpen(true);
        const quantityToAdd = product.quantity || 1;

        if (isAuthenticated) {
            try {
                await cartApi.add({
                    productVariantId: product.productVariantId,
                    quantity: quantityToAdd,
                });
                await fetchCart();
            } catch (error) {
                console.error("Failed to add to cart:", error);
            }
        } else {
            const localCart = getLocalCart();
            const existingIdx = localCart.findIndex(item => item.productVariantId === product.productVariantId);
            if (existingIdx > -1) {
                localCart[existingIdx].quantity += quantityToAdd;
            } else {
                localCart.push({
                    cartId: `local_${Date.now()}`,
                    productVariantId: product.productVariantId,
                    quantity: quantityToAdd,
                    name: product.name,
                    price: product.price,
                    promotionPrice: product.promotionPrice || product.price,
                    image: product.image || 'placeholder',
                });
            }
            saveLocalCart(localCart);
            setCartItems(localCart);
        }
    };

    const updateQuantity = async (cartId, quantity) => {
        if (quantity < 1) return;

        const currentItem = cartItems.find(item => item.cartId === cartId);
        if (!currentItem) return;

        const isIncreasing = quantity > currentItem.quantity;
        const diff = Math.abs(quantity - currentItem.quantity);

        if (isAuthenticated) {
            setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
            try {
                if (isIncreasing) {
                    await cartApi.add({
                        productVariantId: currentItem.productVariantId,
                        quantity: diff
                    });
                } else {
                    for (let i = 0; i < diff; i++) {
                        await cartApi.decrease(cartId);
                    }
                }
            } catch (error) {
                await fetchCart();
            }
        } else {
            const localCart = getLocalCart().map(item =>
                item.cartId === cartId ? { ...item, quantity } : item
            );
            saveLocalCart(localCart);
            setCartItems(localCart);
        }
    };

    const removeFromCart = async (cartId) => {
        if (isAuthenticated) {
            setCartItems(prev => prev.filter(item => item.cartId !== cartId));
            try {
                await axiosClient.delete(`/api/cart/${cartId}`);
            } catch (error) {
                await fetchCart();
            }
        } else {
            const localCart = getLocalCart().filter(item => item.cartId !== cartId);
            saveLocalCart(localCart);
            setCartItems(localCart);
        }
    };

    return (
        <CartContext.Provider value={{
            isCartOpen, toggleCart, openCart, closeCart,
            cartItems, setCartItems,
            addToCart, fetchCart,
            updateQuantity, removeFromCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};
