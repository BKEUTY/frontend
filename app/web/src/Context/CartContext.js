import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/1`);
            if (res.ok) {
                const data = await res.json();
                // Ensure data structure compatibility if needed, or just set it
                // API returns like: [{cartId, productId, name, price, quantity, ...}]
                // Our context used: {id, name, price, quantity, image}
                // map it:
                const mapped = data.map(item => ({
                    ...item,
                    id: item.productId || item.id, // Ensure unified ID access
                    image: item.image || 'placeholder',
                    // Price parsing if string "1.000.000đ" vs number
                    // The API likely returns numbers or strings. Let's handle it in display or standardize here.
                    // For now, store raw data + ensured id.
                }));
                setCartItems(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    };

    // Initial Fetch
    // useEffect(() => {
    //     fetchCart();
    // }, []); 
    // Commented out to avoid double fetch issues during dev if strict mode, but usually good.
    // Actually, let's enable it.
    useEffect(() => {
        fetchCart();
    }, []);

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = (product) => {
        // Optimistic UI Update
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item);
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
        setIsCartOpen(true);

        // Background Sync (Duplicate of Product.js logic, ideally centralized here)
        // fetch(...) 
        // For now, rely on Product.js calling API, but we should probably expose a "refresh" method.
    };

    const updateQuantity = async (cartId, quantity) => {
        if (quantity < 1) return;

        // Optimistic
        setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: quantity } : item));

        try {
            await fetch(`${process.env.REACT_APP_API_URL}/cart/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }) // Assuming backend accepts this
            });
            // fetchCart(); // Sync to be sure?
        } catch (error) {
            console.error("Failed to update quantity", error);
            fetchCart(); // Revert on error
        }
    };

    return (
        <CartContext.Provider value={{ isCartOpen, toggleCart, openCart, closeCart, cartItems, setCartItems, addToCart, fetchCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
