// Cart.jsx updates

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";

import {
    Button, TextField, Container, Typography, Box, Grid,
    Paper, IconButton, InputAdornment, Divider, CircularProgress,
    Alert
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const Cart = () => {
    const { auth } = useAuth();
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [promoCode, setPromoCode] = useState("");
    const [bookingDates, setBookingDates] = useState({});
    const [quantities, setQuantities] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState(null);
    const [promoSuccess, setPromoSuccess] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    useEffect(() => {
        // Redirect if not logged in
        if (!auth.isLoggedIn) {
            // Cek localStorage auth, jika ada, setAuth otomatis oleh AuthProvider
            const storedAuth = localStorage.getItem('auth');
            if (!storedAuth) {
                navigate('/login');
                return;
            }
        }

        // Jangan fetch cart jika token belum siap
        if (!auth.token) return;

        setError(null); // Reset error sebelum fetch

        const fetchCartItems = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                        'Authorization': `Bearer ${auth.token}`
                    }
                };

                const response = await axios.get(
                    'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts',
                    config
                );

                const items = response.data.data || [];
                console.log("Cart items:", items);
                setCartItems(items);

                // Initialize quantities for each item
                const initialQuantities = {};
                items.forEach(item => {
                    initialQuantities[item.id] = item.quantity || 1;
                });
                setQuantities(initialQuantities);

                // Initialize booking dates for each item
                const initialDates = {};
                items.forEach(item => {
                    initialDates[item.id] = item.bookingDate ? new Date(item.bookingDate) : new Date();
                });
                setBookingDates(initialDates);

                const deleteLoadingState = {};
                items.forEach(item => {
                    deleteLoadingState[item.id] = false;
                });
                setDeleteLoading(deleteLoadingState);

                calculateSubtotal(items, initialQuantities);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch cart items", err);
                setError(err.response?.data?.message || 'Failed to load cart items');
                setLoading(false);
            }
        };

        // Fetch payment methods
        const fetchPaymentMethods = async () => {
            try {
                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };

                const response = await axios.get(
                    'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods',
                    config
                );

                setPaymentMethods(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch payment methods", err);
                // Not critical, so don't set error
            }
        };

        fetchCartItems();
        fetchPaymentMethods();
    }, [auth.isLoggedIn, auth.token, navigate]);

    const calculateSubtotal = (items, qtys) => {
        const sub = items.reduce((total, item) => {
            return total + (item.activity.price * (qtys[item.id] || 1));
        }, 0);

        setSubtotal(sub);
        setTotal(sub - discount);
    };

    const handleQuantityChange = async (itemId, increment) => {
        const newQuantities = { ...quantities };
        newQuantities[itemId] = Math.max(1, newQuantities[itemId] + increment);
        setQuantities(newQuantities);
        calculateSubtotal(cartItems, newQuantities);
    };

    const handleDateChange = (itemId, date) => {
        const newDates = { ...bookingDates };
        newDates[itemId] = date;
        setBookingDates(newDates);
    };

    const handleRemoveItem = async (itemId) => {
        try {
            setDeleteLoading(prev => ({ ...prev, [itemId]: true }));

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            await axios.delete(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${itemId}`,
                config
            );

            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            calculateSubtotal(updatedItems, quantities);

            setDeleteLoading(prev => ({ ...prev, [itemId]: false }));

            // Update cartCount di header setelah hapus item
            if (fetchCartCount) {
                fetchCartCount();
            }
        } catch (err) {
            console.error("Failed to remove item from cart", err);
            setError('Failed to remove item from cart');
            setDeleteLoading(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handlePromoCodeSubmit = async (e) => {
        e.preventDefault();
        if (!promoCode.trim()) return;

        try {
            setPromoLoading(true);
            setPromoError(null);
            setPromoSuccess(null);

            // Implement promo code validation here
            // This is a placeholder for promo code logic
            setTimeout(() => {
                setPromoLoading(false);
                setPromoSuccess("Promo code applied successfully!");
                setDiscount(20); // Example: $20 discount
                setTotal(subtotal - 20);
            }, 1000);

        } catch (err) {
            setPromoLoading(false);
            setPromoError('Invalid promo code');
        }
    };

    const handleCheckout = async () => {
        try {
            if (cartItems.length === 0) {
                setError("Your cart is empty");
                return;
            }

            setCheckoutLoading(true);

            // Prepare transaction details to pass to checkout page
            const transactionData = {
                items: cartItems,
                subtotal: subtotal,
                discount: discount,
                total: total,
                paymentMethodId: selectedPaymentMethod
            };

            // Store transaction details in session storage for checkout page
            sessionStorage.setItem('transactionDetails', JSON.stringify(transactionData));

            // Navigate to checkout page
            navigate('/checkout');
        } catch (error) {
            console.error("Checkout error:", error);
            setError("Failed to proceed to checkout. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Container className="flex-grow py-8">
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </div>
        );
    }

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 py-10 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                <div className="flex flex-col min-h-screen">
                    <Container className="flex-grow py-8">
                        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                            Your Cart
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {cartItems.length === 0 ? (
                            <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6">Your cart is empty</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/activities')}
                                >
                                    Browse Activities
                                </Button>
                            </Paper>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Cart Items */}
                                <div className="w-full md:w-2/3">
                                    <Paper elevation={2} className="p-6 mb-6">
                                        {cartItems.map((item) => (
                                            <Box key={item.id} className="mb-6 pb-6 border-b border-gray-200">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="w-full sm:w-1/4 flex-shrink-0 flex items-center">
                                                        <img
                                                            src={item.activity.imageUrls?.[0] || 'placeholder.jpg'}
                                                            alt={item.activity.title}
                                                            className="w-32 h-32 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="w-full sm:w-3/4 flex flex-col gap-4">
                                                        <div className="flex justify-between items-start">
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                {item.activity.title}
                                                            </Typography>
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                disabled={deleteLoading[item.id]}
                                                            >
                                                                {deleteLoading[item.id] ? <CircularProgress size={20} /> : <DeleteIcon />}
                                                            </IconButton>
                                                        </div>
                                                        <Typography variant="body2" color="text.secondary" className="mb-2">
                                                            {item.activity.description?.substring(0, 120)}...
                                                        </Typography>
                                                        <div className="flex items-center mb-3 gap-2">
                                                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                                ${item.activity.price}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" className="ml-2">
                                                                per person
                                                            </Typography>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            <div className="w-full sm:w-1/2">
                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <DatePicker
                                                                        label="Booking Date"
                                                                        value={bookingDates[item.id]}
                                                                        onChange={(date) => handleDateChange(item.id, date)}
                                                                        format="dd/MM/yyyy"
                                                                        sx={{ width: '100%' }}
                                                                    />
                                                                </LocalizationProvider>
                                                            </div>
                                                            <div className="w-full sm:w-1/2">
                                                                <TextField
                                                                    label="Quantity"
                                                                    type="number"
                                                                    value={quantities[item.id] || 1}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <IconButton
                                                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                                                    disabled={quantities[item.id] <= 1}
                                                                                >
                                                                                    <RemoveIcon />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        ),
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                <IconButton
                                                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                                                >
                                                                                    <AddIcon />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                    sx={{ width: '100%' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Box>
                                        ))}
                                    </Paper>
                                </div>
                                {/* Order Summary */}
                                <div className="w-full md:w-1/3">
                                    <Paper elevation={2} className="p-6 mb-6">
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            Order Summary
                                        </Typography>
                                        <div className="flex justify-between mb-2">
                                            <Typography>Subtotal</Typography>
                                            <Typography>${subtotal.toFixed(2)}</Typography>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between mb-2">
                                                <Typography>Discount</Typography>
                                                <Typography color="error">-${discount.toFixed(2)}</Typography>
                                            </div>
                                        )}
                                        <Divider sx={{ my: 2 }} />
                                        <div className="flex justify-between mb-4">
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                ${total.toFixed(2)}
                                            </Typography>
                                        </div>
                                        <form onSubmit={handlePromoCodeSubmit}>
                                            <TextField
                                                label="Promo Code"
                                                fullWidth
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Button
                                                                type="submit"
                                                                disabled={promoLoading || !promoCode.trim()}
                                                            >
                                                                {promoLoading ? <CircularProgress size={24} /> : 'Apply'}
                                                            </Button>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{ mb: 2 }}
                                            />
                                        </form>
                                        {promoError && (
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {promoError}
                                            </Alert>
                                        )}
                                        {promoSuccess && (
                                            <Alert severity="success" sx={{ mb: 2 }}>
                                                {promoSuccess}
                                            </Alert>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            size="large"
                                            onClick={handleCheckout}
                                            disabled={checkoutLoading || cartItems.length === 0}
                                        >
                                            {checkoutLoading ? <CircularProgress size={24} /> : 'Proceed to Checkout'}
                                        </Button>
                                    </Paper>
                                </div>
                            </div>
                        )}
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Cart;