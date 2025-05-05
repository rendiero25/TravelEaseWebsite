
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";

import { Button, TextField, Container, Typography, Box, Grid, Paper, IconButton, InputAdornment, Divider, CircularProgress, Alert } from "@mui/material";
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
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState(null);
    const [promoSuccess, setPromoSuccess] = useState(null);

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

        fetchCartItems();
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
        const newQuantity = Math.max(1, (newQuantities[itemId] || 1) + increment);
        newQuantities[itemId] = newQuantity;

        // Update UI immediately
        setQuantities(newQuantities);
        calculateSubtotal(cartItems, newQuantities);

        try {
            // Update quantity on server
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            };

            await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${itemId}`,
                { quantity: newQuantity },
                config
            );
        } catch (err) {
            console.error("Failed to update cart quantity", err);
            // Revert to previous quantity if update fails
            newQuantities[itemId] = quantities[itemId];
            setQuantities(newQuantities);
            calculateSubtotal(cartItems, newQuantities);
            setError("Failed to update quantity. Please try again.");
        }
    };

    const handleDateChange = async (itemId, date) => {
        if (!date || isNaN(date.getTime())) {
            console.error("Invalid date selected");
            return;
        }

        const newDates = { ...bookingDates };
        newDates[itemId] = date;

        // Update UI immediately
        setBookingDates(newDates);

        try {
            // Format date for API
            const formattedDate = formatDateString(date);

            // Update booking date on server
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            };

            await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${itemId}`,
                { bookingDate: formattedDate },
                config
            );
        } catch (err) {
            console.error("Failed to update booking date", err);
            // Revert to previous date if update fails
            newDates[itemId] = bookingDates[itemId];
            setBookingDates(newDates);
            setError("Failed to update booking date. Please try again.");
        }
    };

    const applyPromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoError("Please enter a promo code");
            return;
        }

        setPromoLoading(true);
        setPromoError(null);
        setPromoSuccess(null);

        try {
            // Validate promo code with API
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/validate-promo',
                { promoCode: promoCode.trim() },
                config
            );

            if (response.data && response.data.data) {
                const promoData = response.data.data;
                const discountAmount = (promoData.discountPercent / 100) * subtotal;
                setDiscount(discountAmount);
                setTotal(subtotal - discountAmount);
                setPromoSuccess(`Promo applied! You saved Rp ${discountAmount.toLocaleString('id-ID')}`);
            } else {
                setPromoError("Invalid promo code");
                setDiscount(0);
                setTotal(subtotal);
            }
        } catch (err) {
            console.error("Failed to validate promo code", err);
            setPromoError(err.response?.data?.message || "Failed to validate promo code");
            // For demo purposes, apply a fixed discount if API fails
            const discountAmount = subtotal * 0.1; // 10% discount
            setDiscount(discountAmount);
            setTotal(subtotal - discountAmount);
            setPromoSuccess(`Demo discount applied! You saved Rp ${discountAmount.toLocaleString('id-ID')}`);
        } finally {
            setPromoLoading(false);
        }
    };

    // Utility function to format date as YYYY-MM-DD
    const formatDateString = (date) => {
        if (!date) {
            const today = new Date();
            return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }

        try {
            if (!(date instanceof Date) || isNaN(date.getTime())) {
                // If it's not a valid Date object, use today's date
                const today = new Date();
                return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            }

            // Format as YYYY-MM-DD using direct string manipulation instead of toISOString
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (err) {
            console.error("Date formatting error:", err);
            const today = new Date();
            return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
    };

    const proceedToCheckout = async () => {
        try {
            // Prevent multiple clicks
            if (checkoutLoading) return;
            setCheckoutLoading(true);

            // Check if user is logged in
            if (!auth.isLoggedIn || !auth.token) {
                navigate('/login');
                return;
            }

            // Check if cart is empty
            if (cartItems.length === 0) {
                setError('Your cart is empty');
                setCheckoutLoading(false);
                return;
            }

            // Setup API request configuration
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            };

            // 1. GET CART DATA TO ENSURE WE HAVE VALID CART IDS
            const cartIds = cartItems.map(item => item.id);
            console.log("Cart IDs to be used:", cartIds);

            // Validate payment methods - we need at least one for the transaction
            const paymentMethodsResponse = await axios.get(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods',
                config
            );

            const paymentMethods = paymentMethodsResponse.data.data || [];
            if (!paymentMethods.length) {
                setError('No payment methods available. Please try again later.');
                setCheckoutLoading(false);
                return;
            }

            // 2. CREATE TRANSACTION WITH API (moved from Checkout.jsx)
            // Prepare transaction data with cart IDs
            const transactionData = {
                cartIds: cartIds,
                paymentMethodId: paymentMethods[0].id.toString() // Use first payment method by default
            };

            // Add promo code if available
            if (promoCode.trim()) {
                transactionData.promoCode = promoCode.trim();
            }

            console.log("Creating transaction with data:", transactionData);

            // Create transaction API call
            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction',
                transactionData,
                config
            );

            console.log("Transaction created successfully:", response.data);

            // 3. Extract transaction ID from response
            let transactionId = null;

            // Try to extract ID directly from response
            if (response.data && response.data.data && response.data.data.id) {
                transactionId = response.data.data.id;
                console.log("Transaction ID extracted from response:", transactionId);
            }
            // If no direct ID in response but success message, get from transactions API
            else if (response.data && response.data.message === "Transaction Created") {
                try {
                    // Get latest transaction from API
                    const transactionsResponse = await axios.get(
                        'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions',
                        config
                    );

                    const transactions = transactionsResponse.data.data || [];

                    if (transactions.length > 0) {
                        // Get ID from latest transaction
                        const latestTransaction = transactions[0];
                        transactionId = latestTransaction.id;
                        console.log("Transaction ID obtained from latest transaction:", transactionId);
                    } else {
                        throw new Error("No transactions found after creation");
                    }
                } catch (fetchErr) {
                    console.error("Error fetching transaction details after creation:", fetchErr);
                    setError("Transaction created but could not retrieve details. Please try again.");
                    setCheckoutLoading(false);
                    return;
                }
            } else {
                setError("Could not create transaction properly. Please try again.");
                setCheckoutLoading(false);
                return;
            }

            // Ensure we have a valid transaction ID
            if (!transactionId) {
                setError("Failed to get valid transaction ID. Please try again.");
                setCheckoutLoading(false);
                return;
            }

            // 4. Prepare transaction details for checkout page
            const transactionDetails = {
                // Now we have a real transaction ID from API
                transactionId: transactionId,
                // Items details for display
                items: cartItems.map(item => ({
                    id: item.id, // This is the cart ID
                    cartId: item.id,
                    activityId: item.activity.id,
                    title: item.activity.title,
                    description: item.activity.description,
                    city: item.activity.city,
                    province: item.activity.province,
                    imageUrl: item.activity.imageUrls?.[0],
                    price: item.activity.price,
                    quantity: quantities[item.id] || 1,
                    bookingDate: formatDateString(bookingDates[item.id])
                })),
                // Critical for API calls - array of cart IDs
                cartIds: cartIds,
                // Payment method (from first available)
                paymentMethodId: paymentMethods[0].id,
                // Promo and pricing info
                promoCode: promoCode.trim() || "None",
                subtotal: subtotal,
                discount: discount,
                total: total,
                // Status and timestamp
                status: 'pending',
                orderDate: new Date().toISOString()
            };

            console.log("Proceeding to checkout with transaction:", transactionDetails);

            // Store transaction details in session storage for checkout page
            sessionStorage.setItem('transactionDetails', JSON.stringify(transactionDetails));

            // Navigate to checkout page
            navigate('/checkout');
        } catch (err) {
            console.error("Failed to proceed to checkout", err);

            // Handle error responses
            if (err.response) {
                console.error("Error status:", err.response.status);
                console.error("Error data:", err.response.data);

                if (err.response.data?.errors) {
                    setError(`Transaction Error: ${err.response.data.errors}`);
                } else if (err.response.data?.message) {
                    setError(`Transaction Error: ${err.response.data.message}`);
                } else {
                    setError("Server returned an error. Please try again.");
                }
            } else if (err.request) {
                setError("No response from server. Please check your internet connection.");
            } else {
                setError("An error occurred while proceeding to checkout: " + err.message);
            }
        } finally {
            setCheckoutLoading(false);
        }
    };

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
            setError("Failed to delete item from cart");
        } finally {
            // Reset loading state for this specific item
            setDeleteLoading(prev => ({ ...prev, [cartId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <Container className="flex-grow py-8 flex items-center justify-center">
                    <CircularProgress />
                </Container>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Container className="flex-grow py-8">
                <Typography variant="h4" component="h1" gutterBottom className="font-semibold">
                    Your Cart
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {cartItems.length === 0 ? (
                    <Paper className="p-6 text-center">
                        <Typography variant="h6" className="mb-4">
                            Your cart is empty
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/activities')}
                        >
                            Browse Activities
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            {cartItems.map((item) => (
                                <Paper key={item.id} className="p-4 mb-4">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={3}>
                                            {item.activity.imageUrls && item.activity.imageUrls[0] && (
                                                <img
                                                    src={item.activity.imageUrls[0]}
                                                    alt={item.activity.title}
                                                    className="w-full h-24 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/150?text=Image+Not+Available";
                                                    }}
                                                />
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={9}>
                                            <Box className="flex justify-between">
                                                <Typography variant="h6" className="font-semibold">
                                                    {item.activity.title}
                                                </Typography>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    disabled={deleteLoading[item.id]}
                                                >
                                                    {deleteLoading[item.id] ? <CircularProgress size={24} /> : <DeleteIcon />}
                                                </IconButton>
                                            </Box>
                                            <Typography variant="body2" className="text-gray-600 mb-2">
                                                {item.activity.city}, {item.activity.province}
                                            </Typography>
                                            <Typography variant="body1" className="font-semibold mb-2">
                                                Rp {item.activity.price.toLocaleString('id-ID')} per person
                                            </Typography>

                                            <Grid container spacing={2} className="mt-2">
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" className="mb-1">
                                                        Quantity:
                                                    </Typography>
                                                    <Box className="flex items-center">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                            disabled={quantities[item.id] <= 1}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <Typography className="mx-2">
                                                            {quantities[item.id] || 1}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" className="mb-1">
                                                        Booking Date:
                                                    </Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DatePicker
                                                            value={bookingDates[item.id] || new Date()}
                                                            onChange={(newDate) => handleDateChange(item.id, newDate)}
                                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                                            disablePast
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <Box className="mt-2 text-right">
                                                <Typography variant="body1" className="font-semibold">
                                                    Subtotal: Rp {((item.activity.price * (quantities[item.id] || 1))).toLocaleString('id-ID')}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper className="p-6 sticky" style={{ top: '1rem' }}>
                                <Typography variant="h6" className="font-semibold mb-4">
                                    Order Summary
                                </Typography>

                                <Box className="mb-4">
                                    <TextField
                                        label="Promo Code"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        onClick={applyPromoCode}
                                                        disabled={promoLoading}
                                                        variant="text"
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        {promoLoading ? <CircularProgress size={20} /> : 'Apply'}
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {promoError && (
                                        <Typography variant="caption" color="error">
                                            {promoError}
                                        </Typography>
                                    )}
                                    {promoSuccess && (
                                        <Typography variant="caption" color="success.main">
                                            {promoSuccess}
                                        </Typography>
                                    )}
                                </Box>

                                <Box className="flex justify-between mb-2">
                                    <Typography>Subtotal</Typography>
                                    <Typography>Rp {subtotal.toLocaleString('id-ID')}</Typography>
                                </Box>

                                <Box className="flex justify-between mb-2">
                                    <Typography>Discount</Typography>
                                    <Typography color="success.main">- Rp {discount.toLocaleString('id-ID')}</Typography>
                                </Box>

                                <Divider className="my-2" />

                                <Box className="flex justify-between mb-4">
                                    <Typography variant="h6" className="font-semibold">Total</Typography>
                                    <Typography variant="h6" className="font-semibold">
                                        Rp {total.toLocaleString('id-ID')}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    onClick={proceedToCheckout}
                                    disabled={checkoutLoading || cartItems.length === 0}
                                >
                                    {checkoutLoading ? <CircularProgress size={24} /> : 'Proceed to Checkout'}
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
            <Footer />
        </div>
    );
};

export default Cart;