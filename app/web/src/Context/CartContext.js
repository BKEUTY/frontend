import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Nước Hoa Hồng Obagi 2% BHA', price: '1.150.000đ', quantity: 1, image: 'placeholder' },
        { id: 2, name: 'Sữa Chống Nắng Anessa', price: '431.000đ', quantity: 2, image: 'placeholder' }
    ]);

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{ isCartOpen, toggleCart, openCart, closeCart, cartItems, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
