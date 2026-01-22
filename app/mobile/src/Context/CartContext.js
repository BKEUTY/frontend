import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const response = await axiosClient.get('/cart/1');
            // Ensure data structure compatibility
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
        fetchCart();
    }, []);

    const addToCart = async (product) => {
        // Optimistic update
        const existing = cartItems.find(item => item.id === product.id);
        if (existing) {
            setCartItems(prev => prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item));
        } else {
            setCartItems(prev => [...prev, { ...product, quantity: product.quantity || 1 }]);
        }

        try {
            await axiosClient.post('/cart', {
                productId: product.id,
                userId: 1,
            });
            // Re-fetch to confirm and sync (optional, or just rely on optimistic)
            // fetchCart(); 
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    };

    const deleteCartItem = async (cartId) => {
        try {
            await axiosClient.delete(`/cart/${cartId}`);
            setCartItems(prev => prev.filter(p => p.cartId !== cartId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, fetchCart, addToCart, deleteCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
