import React, { createContext, useState, useContext, useEffect } from 'react';

import cartApi from '../api/cartApi';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const userId = 1;

    const fetchCart = async () => {
        try {
            const res = await cartApi.getAll(userId);
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
        fetchCart();
    }, []);

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (product) => {

        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item);
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
        setIsCartOpen(true);

        try {

            await cartApi.add({
                userId: userId,
                productId: product.id || product.productId
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

    return (
        <CartContext.Provider value={{ isCartOpen, toggleCart, openCart, closeCart, cartItems, setCartItems, addToCart, fetchCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
