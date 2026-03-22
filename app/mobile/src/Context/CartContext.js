import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id || 1;

    const fetchCart = async () => {
        if (!isAuthenticated) return;
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axiosClient.get('/api/cart', { 
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                errorMessage: 'api_error_fetch_cart',
                skipGlobalErrorHandler: true
            });

            const mapped = response.data.map(item => ({
                ...item,
                id: item.productId || item.id,
                image: item.image || 'placeholder',
            }));
            setCartItems(mapped);
        } catch (error) {
            console.error("Failed to fetch mobile cart", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, userId]);

    const addToCart = async (product) => {
        const existing = cartItems.find(item => item.id === product.id);
        if (existing) {
            setCartItems(prev => prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item));
        } else {
            setCartItems(prev => [...prev, { ...product, quantity: product.quantity || 1 }]);
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await axiosClient.post('/api/cart', {
                productVariantId: product.productVariantId,
                quantity: product.quantity || 1
            }, { 
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                errorMessage: 'api_error_add_cart',
                skipGlobalErrorHandler: true
            });

            await fetchCart();
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    };

    const deleteCartItem = async (cartId) => {
        try {
            await axiosClient.delete(`/api/cart/${cartId}`, { errorMessage: 'api_error_remove_cart' });
            setCartItems(prev => prev.filter(p => p.cartId !== cartId));
        } catch (error) {
            console.error("Delete cart item failed", error);
        }
    };

    const updateCartQuantity = async (cartId, quantity) => {
        if (quantity < 1) return;
        try {
            await axiosClient.put(`/api/cart/${cartId}?quantity=${quantity}`, {}, {
                errorMessage: 'api_error_update_cart'
            });
            setCartItems(prev => prev.map(item => 
                item.cartId === cartId ? { ...item, quantity } : item
            ));
        } catch (error) {
            console.error("Update cart quantity failed", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, fetchCart, addToCart, deleteCartItem, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
