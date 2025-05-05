import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";

import { Button, TextField, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Grid, Paper, IconButton, InputAdornment, Divider } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const Cart = () => {

    const { auth } = useAuth();
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

    useEffect(() => {
        // Redirect if not logged in
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }

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
                setCartItems(items);

                // Initialize quantities for each item
                const initialQuantities = {};
                items.forEach(item => {
                    initialQuantities[item.id] = 1;
                });
                setQuantities(initialQuantities);

                // Initialize booking dates for each item
                const initialDates = {};
                items.forEach(item => {
                    initialDates[item.id] = new Date();
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
                setError('Failed to load cart items');
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [auth.isLoggedIn, auth.token, navigate]);

    const calculateSubtotal = (items, qtys) => {
        const sub = items.reduce((total, item) => {
            return total + (item.activity.price * (qtys[item.id] || 1));
        }, 0);

        setSubtotal(sub);
        setTotal(sub - discount);
    };

    const handleQuantityChange = (itemId, increment) => {
        const newQuantities = { ...quantities };
        newQuantities[itemId] = Math.max(1, (newQuantities[itemId] || 1) + increment);
        setQuantities(newQuantities);
        calculateSubtotal(cartItems, newQuantities);
    };

    const handleDateChange = (itemId, date) => {
        const newDates = { ...bookingDates };
        newDates[itemId] = date;
        setBookingDates(newDates);
    };

    const applyPromoCode = () => {
        // In a real app, you would validate the promo code with your backend
        // For now, let's just simulate a fixed discount
        if (promoCode.trim() !== "") {
            const discountAmount = 50000; // Example: 50,000 IDR discount
            setDiscount(discountAmount);
            setTotal(subtotal - discountAmount);
        }
    };

    const proceedToCheckout = async () => {
        // Check if user is logged in
        if (!auth.isLoggedIn || !auth.token) {
            navigate('/login');
            return;
        }

        // Check if cart is empty
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        try {
            // Create transaction using API
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            // Prepare transaction data
            const transactionData = {
                promoCode: promoCode.trim() || null,
                items: cartItems.map(item => ({
                    activityId: item.activity.id,
                    quantity: quantities[item.id] || 1,
                    bookingDate: bookingDates[item.id].toISOString().split('T')[0]
                }))
            };

            console.log("Transaction data:", transactionData); // Log the data being sent

            // Call the create transaction API
            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction',
                transactionData,
                config
            );

            console.log("Transaction response:", response.data); // Log the response

            // // Check if user role is allowed (optional additional check)
            // if (auth.user && !['user', 'admin'].includes(auth.user.role)) {
            //     throw new Error("You don't have permission to proceed with checkout");
            // }

            // Store transaction data for checkout page
            const transactionDetails = {
                transactionId: response.data.data.id,
                items: cartItems.map(item => ({
                    id: item.id,
                    title: item.activity.title,
                    description: item.activity.description,
                    city: item.activity.city,
                    province: item.activity.province,
                    imageUrl: item.activity.imageUrls?.[0],
                    price: item.activity.price,
                    quantity: quantities[item.id] || 1
                })),
                promoCode: promoCode.trim() || "None",
                subtotal: subtotal,
                discount: discount,
                total: total
            };

            // Store transaction details in session storage to use in checkout page
            sessionStorage.setItem('transactionDetails', JSON.stringify(transactionDetails));

            // Navigate to checkout page
            navigate('/checkout');

        } catch (err) {
            console.error("Failed to create transaction", err);
            console.error("Error details:", err.response?.data);
            alert(err.response?.data?.message || "Failed to create transaction. Please try again.");
        }
    };

    // // Store order data in session/local storage or pass via state
    //     sessionStorage.setItem('orderData', JSON.stringify(orderData));
    //     sessionStorage.setItem('orderSummary', JSON.stringify({
    //         subtotal,
    //         discount,
    //         total
    //     }));
    //
    //     navigate('/checkout');
    // };

    const handleDeleteItem = async (cartId) => {
        try {
            // Set loading state for this specific item
            setDeleteLoading(prev => ({ ...prev, [cartId]: true }));

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            // Call the delete cart API
            await axios.delete(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`,
                config
            );

            // Remove the item from local state
            const updatedCartItems = cartItems.filter(item => item.id !== cartId);
            setCartItems(updatedCartItems);

            // Update the quantities state
            const newQuantities = { ...quantities };
            delete newQuantities[cartId];
            setQuantities(newQuantities);

            // Update the booking dates state
            const newDates = { ...bookingDates };
            delete newDates[cartId];
            setBookingDates(newDates);

            // Recalculate subtotal and total
            calculateSubtotal(updatedCartItems, newQuantities);

        } catch (err) {
            console.error("Failed to delete cart item", err);
            alert("Failed to delete item from cart");
        } finally {
            // Reset loading state for this specific item
            setDeleteLoading(prev => ({ ...prev, [cartId]: false }));
        }
    };

    const handleCheckout = () => {
        // Implement the checkout process
        console.log("Proceeding to checkout with items:", cartItems);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl">Loading your cart...</div>
            </div>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl text-red-500">Error: {error}</div>
            </div>
            <Footer />
        </div>
    );

    return(
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 py-10 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                    <Container className="flex-grow py-10">
                        <Typography variant="h4" gutterBottom>
                            Your Cart
                        </Typography>

                        {cartItems.length === 0 ? (
                            <Typography>Your cart is empty.</Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {/* Cart Items */}
                                <Grid item xs={12} md={8}>
                                    {cartItems.map(item => (
                                        <Accordion key={item.id} sx={{ mb: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item xs={5}>
                                                        <Typography variant="subtitle1">
                                                            {item.activity.title}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography variant="body2">
                                                            {item.activity.city}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body2">
                                                            {item.activity.province}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Box display="flex" justifyContent="flex-end">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        disabled={deleteLoading[item.id]}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" paragraph>
                                                            {item.activity.description}
                                                        </Typography>
                                                        <Typography variant="body2" color="primary">
                                                            Price: IDR {item.activity.price.toLocaleString()}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>

                                            <Box p={2}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={6} md={4}>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                                label="Booking Date"
                                                                value={bookingDates[item.id]}
                                                                onChange={(date) => handleDateChange(item.id, date)}
                                                                disablePast
                                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4}>
                                                        <Box display="flex" alignItems="center">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                                disabled={quantities[item.id] <= 1}
                                                            >
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <TextField
                                                                value={quantities[item.id] || 1}
                                                                disabled
                                                                size="small"
                                                                sx={{ width: 60, mx: 1, input: { textAlign: 'center' } }}
                                                            />
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={4}>
                                                        <Typography variant="body1" align="right">
                                                            Total: IDR {((item.activity.price * (quantities[item.id] || 1)).toLocaleString())}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Accordion>
                                    ))}
                                </Grid>

                                {/* Order Summary */}
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={3} sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Order Summary
                                        </Typography>

                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography>Subtotal</Typography>
                                            <Typography>IDR {subtotal.toLocaleString()}</Typography>
                                        </Box>

                                        <Box mb={3}>
                                            <TextField
                                                label="Promo Code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                size="small"
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Button
                                                                variant="text"
                                                                onClick={applyPromoCode}
                                                                size="small"
                                                            >
                                                                Apply
                                                            </Button>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{ mb: 1 }}
                                            />

                                            {discount > 0 && (
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography color="success.main">Discount</Typography>
                                                    <Typography color="success.main">-IDR {discount.toLocaleString()}</Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box display="flex" justifyContent="space-between" mb={3}>
                                            <Typography variant="h6">Total</Typography>
                                            <Typography variant="h6">IDR {total.toLocaleString()}</Typography>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={proceedToCheckout}
                                            sx={{
                                                backgroundColor: '#F97316',
                                                '&:hover': {
                                                    backgroundColor: '#FB923C',
                                                }
                                            }}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </Container>
            </div>
        </div>
    )
}

export default Cart;