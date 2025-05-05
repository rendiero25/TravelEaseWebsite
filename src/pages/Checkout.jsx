import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";

import {Container, Typography, Box, Grid, Paper, RadioGroup, Radio, FormControlLabel, Button, Divider, CircularProgress, Alert, TextField } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import Header from '../components/Header';
import Footer from '../components/Footer';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Checkout = () => {

    const { auth } = useAuth();
    const navigate = useNavigate();

    // State variables
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [timerActive, setTimerActive] = useState(false);
    const [paymentProof, setPaymentProof] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('pending');

    // Timer interval reference
    const timerRef = useRef(null);

    useEffect(() => {
        // Redirect if not logged in
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }

        // Get transaction details from session storage
        const storedDetails = sessionStorage.getItem('transactionDetails');
        if (!storedDetails) {
            navigate('/cart');
            return;
        }

        setTransactionDetails(JSON.parse(storedDetails));

        // Fetch payment methods
        fetchPaymentMethods();

        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [auth.isLoggedIn, navigate]);

    // Effect for timer functionality
    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timerActive, timeLeft]);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            const response = await axios.get(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods',
                config
            );

            setPaymentMethods(response.data.data || []);
            // Set the first payment method as default selected if available
            if (response.data.data && response.data.data.length > 0) {
                setSelectedPaymentMethod(response.data.data[0].id);
            }

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch payment methods", err);
            setError('Failed to load payment methods');
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePayment = () => {
        if (!selectedPaymentMethod) {
            setError('Please select a payment method');
            return;
        }

        // Start the timer
        setTimerActive(true);
    };

    const handleCancelTransaction = async () => {
        if (!transactionDetails?.transactionId) {
            setError('Transaction ID not found');
            return;
        }

        try {
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${transactionDetails.transactionId}`,
                {},
                config
            );

            // Clear session storage
            sessionStorage.removeItem('transactionDetails');

            // Navigate to activities page
            navigate('/activities');

        } catch (err) {
            console.error("Failed to cancel transaction", err);
            setError(err.response?.data?.message || 'Failed to cancel transaction');
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setPaymentProof(event.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!paymentProof) {
            setError('Please select a file to upload');
            return;
        }

        try {
            setUploadLoading(true);

            const formData = new FormData();
            formData.append('image', paymentProof);

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image',
                formData,
                config
            );

            // Save the uploaded image URL
            setImageUrl(response.data.data.imageUrl);
            setUploadLoading(false);

        } catch (err) {
            console.error("Failed to upload image", err);
            setError(err.response?.data?.message || 'Failed to upload proof of payment');
            setUploadLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!imageUrl) {
            setError('Please upload proof of payment first');
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            // Update transaction with proof of payment
            await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${transactionDetails.transactionId}`,
                { imageUrl },
                config
            );

            // Update transaction status to 'paid'
            await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${transactionDetails.transactionId}`,
                { status: 'paid' },
                config
            );

            // Update local status
            setTransactionStatus('paid');
            setLoading(false);

        } catch (err) {
            console.error("Failed to confirm payment", err);
            setError(err.response?.data?.message || 'Failed to confirm payment');
            setLoading(false);
        }
    };

    if (loading && !transactionDetails) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <CircularProgress />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 py-10 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                <div className="min-h-screen flex flex-col">
                    <Container maxWidth="lg" className="flex-grow my-8">
                        <Typography variant="h4" gutterBottom className="font-semibold">
                            Checkout
                        </Typography>

                        {error && (
                            <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        {transactionStatus === 'paid' ? (
                            <Paper className="p-6 mt-4">
                                <Alert severity="success" className="mb-4">
                                    Payment successful! Thank you for your purchase.
                                </Alert>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/purchase-list')}
                                    className="mt-4"
                                >
                                    View My Purchases
                                </Button>
                            </Paper>
                        ) : (
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={8}>
                                    <Paper className="p-6">
                                        <Typography variant="h6" className="font-semibold mb-4">
                                            Order Details
                                        </Typography>

                                        {transactionDetails?.items.map((item, index) => (
                                            <Box key={index} className="mb-4">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={3}>
                                                        {item.imageUrl && (
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.title}
                                                                className="w-full h-24 object-cover rounded"
                                                            />
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={12} sm={9}>
                                                        <Typography variant="h6" className="font-semibold">
                                                            {item.title}
                                                        </Typography>
                                                        <Typography variant="body2" className="text-gray-600 mb-1">
                                                            {item.city}, {item.province}
                                                        </Typography>
                                                        <Typography variant="body2" className="mb-1">
                                                            Quantity: {item.quantity}
                                                        </Typography>
                                                        <Typography variant="body1" className="font-semibold">
                                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                {index < transactionDetails.items.length - 1 && (
                                                    <Divider className="my-4" />
                                                )}
                                            </Box>
                                        ))}
                                    </Paper>

                                    <Paper className="p-6 mt-4">
                                        <Typography variant="h6" className="font-semibold mb-4">
                                            Payment Method
                                        </Typography>

                                        {paymentMethods.length > 0 ? (
                                            <RadioGroup
                                                value={selectedPaymentMethod}
                                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                            >
                                                {paymentMethods.map((method) => (
                                                    <FormControlLabel
                                                        key={method.id}
                                                        value={method.id}
                                                        control={<Radio />}
                                                        label={
                                                            <Box className="flex items-center">
                                                                {method.imageUrl && (
                                                                    <img
                                                                        src={method.imageUrl}
                                                                        alt={method.name}
                                                                        className="h-6 mr-2"
                                                                    />
                                                                )}
                                                                <Typography>{method.name}</Typography>
                                                            </Box>
                                                        }
                                                    />
                                                ))}
                                            </RadioGroup>
                                        ) : (
                                            <Typography>No payment methods available</Typography>
                                        )}

                                        {!timerActive && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="mt-4"
                                                onClick={handlePayment}
                                                disabled={!selectedPaymentMethod || loading}
                                            >
                                                {loading ? <CircularProgress size={24} /> : 'Pay Now'}
                                            </Button>
                                        )}
                                    </Paper>

                                    {timerActive && (
                                        <Paper className="p-6 mt-4">
                                            <Typography variant="h6" className="font-semibold mb-2">
                                                Payment Timer
                                            </Typography>
                                            <Typography variant="body1" className="mb-4">
                                                Please complete your payment within:
                                            </Typography>
                                            <Typography variant="h4" className="font-bold text-center mb-4 text-red-500">
                                                {formatTime(timeLeft)}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={handleCancelTransaction}
                                                className="mt-2"
                                                fullWidth
                                            >
                                                Cancel Transaction
                                            </Button>
                                        </Paper>
                                    )}

                                    {timerActive && (
                                        <Paper className="p-6 mt-4">
                                            <Typography variant="h6" className="font-semibold mb-4">
                                                Already Paid?
                                            </Typography>

                                            <Box className="mb-4">
                                                <Button
                                                    component="label"
                                                    variant="contained"
                                                    startIcon={<CloudUploadIcon />}
                                                    disabled={uploadLoading}
                                                >
                                                    Upload proof of payment
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />
                                                </Button>
                                                {paymentProof && (
                                                    <Typography variant="body2" className="mt-2">
                                                        Selected file: {paymentProof.name}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {paymentProof && !imageUrl && (
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleFileUpload}
                                                    disabled={uploadLoading}
                                                    className="mb-4"
                                                >
                                                    {uploadLoading ? <CircularProgress size={24} /> : 'Upload Image'}
                                                </Button>
                                            )}

                                            {imageUrl && (
                                                <>
                                                    <Box className="mb-4">
                                                        <img
                                                            src={imageUrl}
                                                            alt="Payment Proof"
                                                            className="max-w-full h-auto"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </Box>

                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={handleConfirmPayment}
                                                        disabled={loading}
                                                        fullWidth
                                                    >
                                                        {loading ? <CircularProgress size={24} /> : 'Confirm Payment'}
                                                    </Button>
                                                </>
                                            )}
                                        </Paper>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Paper className="p-6 sticky top-4">
                                        <Typography variant="h6" className="font-semibold mb-4">
                                            Order Summary
                                        </Typography>

                                        <Box className="flex justify-between mb-2">
                                            <Typography>Subtotal</Typography>
                                            <Typography>Rp {transactionDetails?.subtotal.toLocaleString('id-ID')}</Typography>
                                        </Box>

                                        <Box className="flex justify-between mb-2">
                                            <Typography>Promo Code</Typography>
                                            <Typography>{transactionDetails?.promoCode}</Typography>
                                        </Box>

                                        <Box className="flex justify-between mb-2">
                                            <Typography>Discount</Typography>
                                            <Typography>- Rp {transactionDetails?.discount.toLocaleString('id-ID')}</Typography>
                                        </Box>

                                        <Divider className="my-2" />

                                        <Box className="flex justify-between mb-2">
                                            <Typography variant="h6" className="font-semibold">Total</Typography>
                                            <Typography variant="h6" className="font-semibold">
                                                Rp {transactionDetails?.total.toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>

                                        <Box className="mt-4">
                                            <Typography variant="subtitle2" className="font-semibold mb-1">
                                                Transaction ID:
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={transactionDetails?.transactionId || ''}
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </Container>
                </div>
            </div>
        </div>
    )
}

export default Checkout;