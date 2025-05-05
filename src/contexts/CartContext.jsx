import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { auth } = useAuth();

    // Load cart count on initial load and auth changes
    useEffect(() => {
        if (auth.isLoggedIn) {
            fetchCartCount();
        } else {
            setCartCount(0);
        }
    }, [auth.isLoggedIn]);

    const fetchCartCount = async () => {
        try {
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            const response = await axios.get(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cart',
                config
            );

            // Assuming the API returns an array of cart items
            const count = response.data.data.length;
            setCartCount(count);
        } catch (error) {
            console.error("Failed to fetch cart count", error);
        }
    };

    const addToCart = async (activityId) => {
        try {
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart',
                { activityId },
                config
            );

            // Increment cart count without fetching again
            setCartCount(prevCount => prevCount + 1);

            return true;
        } catch (error) {
            console.error("Failed to add to cart", error);
            return false;
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, addToCart, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);