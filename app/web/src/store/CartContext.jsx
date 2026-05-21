import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartApi from '../features/cart/services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const LOCAL_CART_KEY = 'bkeuty_guest_cart';

const getLocalCart = () => JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
const saveLocalCart = (items) => localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
const clearLocalCart = () => localStorage.removeItem(LOCAL_CART_KEY);

const mapCartItem = ({ cartId, productVariantId, name, price, promotionPrice, image, quantity }) => ({
    cartId, productVariantId, name, price, promotionPrice, image, quantity
});

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated, user_role } = useAuth();

    const fetchCart = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const res = await cartApi.getAll();
                setCartItems(res.data.map(mapCartItem));
            } catch (error) {
                console.error(error);
            }
        } else {
            setCartItems(getLocalCart());
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const initCart = async () => {
            if (isAuthenticated) {
                const localCart = getLocalCart();
                if (localCart.length > 0) {
                    for (const item of localCart) {
                        try {
                            await cartApi.create({
                                productVariantId: item.productVariantId,
                                quantity: item.quantity
                            });
                        } catch (err) {
                            console.error("Failed to sync guest cart item", err);
                        }
                    }
                    clearLocalCart();
                }
            }
            await fetchCart();
        };
        initCart();
    }, [isAuthenticated, fetchCart]);

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (product) => {
        const { productVariantId, quantity, name, price, promotionPrice, image } = product;

        if (isAuthenticated) {
            try {
                const res = await cartApi.create({ productVariantId, quantity });
                const added = res.data;
                setCartItems(prev => {
                    const exists = prev.find(item => item.productVariantId === added.productVariantId);
                    if (exists) {
                        return prev.map(item =>
                            item.productVariantId === added.productVariantId
                                ? mapCartItem({ 
                                    ...item, 
                                    cartId: added.cartId, 
                                    quantity: added.quantity 
                                  })
                                : item
                        );
                    }
                    return [...prev, mapCartItem({
                        cartId: added.cartId,
                        productVariantId: added.productVariantId,
                        name: name,
                        price: price,
                        promotionPrice: promotionPrice ?? price,
                        image: image,
                        quantity: added.quantity
                    })];
                });
                setIsCartOpen(true);
            } catch (error) {
                console.error(error);
                throw error;
            }
        } else {
            const localCart = getLocalCart();
            const existingIdx = localCart.findIndex(item => item.productVariantId === productVariantId);
            
            if (existingIdx > -1) {
                localCart[existingIdx].quantity += quantity;
            } else {
                localCart.push({
                    cartId: `local_${Date.now()}`,
                    productVariantId,
                    name,
                    price,
                    promotionPrice,
                    image,
                    quantity
                });
            }
            saveLocalCart(localCart);
            setCartItems(localCart);
            setIsCartOpen(true);
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
                    await cartApi.create({
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
                await cartApi.delete(cartId);
            } catch (error) {
                await fetchCart();
            }
        } else {
            const localCart = getLocalCart().filter(item => item.cartId !== cartId);
            saveLocalCart(localCart);
            setCartItems(localCart);
        }
    };

    const clearCartItems = (ids) => {
        setCartItems(prev => prev.filter(item => !ids.includes(item.cartId)));
    };

    return (
        <CartContext.Provider value={{
            isCartOpen, toggleCart, openCart, closeCart,
            cartItems, setCartItems,
            addToCart, fetchCart,
            updateQuantity, removeFromCart, clearCartItems
        }}>
            {children}
        </CartContext.Provider>
    );
};
