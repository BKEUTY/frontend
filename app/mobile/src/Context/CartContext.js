import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const LOCAL_CART_KEY = 'bkeuty_guest_cart';

const getLocalCart = async () => {
    try {
        const item = await AsyncStorage.getItem(LOCAL_CART_KEY);
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

const saveLocalCart = async (items) => {
    try {
        await AsyncStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch (e) {
        console.error(e);
    }
};

const clearLocalCart = async () => {
    try {
        await AsyncStorage.removeItem(LOCAL_CART_KEY);
    } catch (e) {
        console.error(e);
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user, isAuthenticated } = useAuth();
    const userRole = user?.role || 'USER';

    const fetchCart = useCallback(async () => {
        if (isAuthenticated) {
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
        } else {
            const local = await getLocalCart();
            setCartItems(local);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const initCart = async () => {
            if (isAuthenticated && userRole === 'USER') {
                const localCart = await getLocalCart();
                if (localCart.length > 0) {
                    const token = await AsyncStorage.getItem('token');
                    for (const item of localCart) {
                        try {
                            await axiosClient.post('/api/cart', {
                                productVariantId: item.productVariantId,
                                quantity: item.quantity
                            }, {
                                headers: token ? { Authorization: `Bearer ${token}` } : {},
                                skipGlobalErrorHandler: true
                            });
                        } catch (err) {
                            console.error("Failed to sync mobile guest cart item", err);
                        }
                    }
                    await clearLocalCart();
                }
            }
            await fetchCart();
        };
        initCart();
    }, [isAuthenticated, userRole, fetchCart]);

    const addToCart = async (product) => {
        const existingIdx = cartItems.findIndex(item => item.id === product.id);
        let newCart = [...cartItems];

        if (existingIdx > -1) {
            newCart[existingIdx].quantity += (product.quantity || 1);
        } else {
            newCart.push({ ...product, quantity: product.quantity || 1 });
        }
        setCartItems(newCart);

        if (isAuthenticated) {
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
        } else {
            const localCart = await getLocalCart();
            const localIdx = localCart.findIndex(item => item.id === product.id);
            if (localIdx > -1) {
                localCart[localIdx].quantity += (product.quantity || 1);
            } else {
                localCart.push({ ...product, quantity: product.quantity || 1 });
            }
            await saveLocalCart(localCart);
        }
    };

    const deleteCartItem = async (cartId) => {
        setCartItems(prev => prev.filter(p => p.cartId !== cartId));
        
        if (isAuthenticated) {
            try {
                await axiosClient.delete(`/api/cart/${cartId}`, { errorMessage: 'api_error_remove_cart' });
            } catch (error) {
                console.error("Delete cart item failed", error);
                await fetchCart();
            }
        } else {
            const localCart = await getLocalCart();
            const newLocal = localCart.filter(item => item.cartId !== cartId);
            await saveLocalCart(newLocal);
        }
    };

    const updateCartQuantity = async (cartId, quantity) => {
        if (quantity < 1) return;
        
        setCartItems(prev => prev.map(item => 
            item.cartId === cartId ? { ...item, quantity } : item
        ));

        if (isAuthenticated) {
            try {
                await axiosClient.put(`/api/cart/${cartId}?quantity=${quantity}`, {}, {
                    errorMessage: 'api_error_update_cart'
                });
            } catch (error) {
                console.error("Update cart quantity failed", error);
                await fetchCart();
            }
        } else {
            const localCart = await getLocalCart();
            const newLocal = localCart.map(item =>
                item.cartId === cartId ? { ...item, quantity } : item
            );
            await saveLocalCart(newLocal);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, fetchCart, addToCart, deleteCartItem, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
