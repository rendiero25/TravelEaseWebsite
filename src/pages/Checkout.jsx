
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

        try {
            const parsedDetails = JSON.parse(storedDetails);
            console.log("Loaded transaction details from session storage:", parsedDetails);

            // Validasi transaksi
            if (!parsedDetails.transactionId) {
                setError("Transaction ID is missing. Please go back to cart and try again.");
                navigate('/cart');
                return;
            }

            // Update state with transaction details
            setTransactionDetails(parsedDetails);

            // Fetch payment methods
            fetchPaymentMethods();

            // Aktifkan timer karena transaksi sudah dibuat
            setTimerActive(true);
        } catch (error) {
            console.error("Error parsing transaction details:", error);
            navigate('/cart');
            return;
        }

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

            // Set the payment method yang sama dengan yang digunakan untuk membuat transaksi
            if (transactionDetails?.paymentMethodId) {
                setSelectedPaymentMethod(transactionDetails.paymentMethodId);
            }
            // Fallback ke metode pertama jika tidak ada
            else if (response.data.data && response.data.data.length > 0) {
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

    const handlePayment = async () => {
        if (!selectedPaymentMethod) {
            setError('Please select a payment method');
            return;
        }

        try {
            setLoading(true);
            console.log("Transaction details:", transactionDetails);

            // Setup API request configuration
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Gunakan cartIds dari transactionDetails yang sudah ada di session storage
            let cartIds = [];

            if (transactionDetails.cartIds && Array.isArray(transactionDetails.cartIds) && transactionDetails.cartIds.length > 0) {
                // Gunakan cartIds yang sudah ada di transactionDetails
                cartIds = transactionDetails.cartIds;
                console.log("Using cartIds from session storage:", cartIds);
            } else {
                // Fallback: Get cart data from API
                const cartResponse = await axios.get(
                    'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts',
                    config
                );

                const userCarts = cartResponse.data.data || [];
                console.log("User carts:", userCarts);

                if (userCarts.length === 0) {
                    setError('You have no items in your cart');
                    setLoading(false);
                    return;
                }

                // Extract cart IDs
                cartIds = userCarts.map(cart => cart.id);
            }

            console.log("Cart IDs to be used:", cartIds);

            // Prepare transaction data with valid cart IDs
            const transactionData = {
                cartIds: cartIds,
                paymentMethodId: selectedPaymentMethod.toString()
            };

            // Add promo code if available
            if (transactionDetails.promoCode && transactionDetails.promoCode !== "None") {
                transactionData.promoCode = transactionDetails.promoCode;
            }

            console.log("Creating transaction with data:", transactionData);

            // Create transaction API call
            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction',
                transactionData,
                config
            );

            console.log("Transaction created successfully:", response.data);

            // Logika untuk menangani berbagai format respons API
            let transactionId = null;

            // Coba ambil ID dari respons langsung
            if (response.data && response.data.data && response.data.data.id) {
                transactionId = response.data.data.id;
                console.log("Transaction ID extracted from response:", transactionId);
            }
            // Jika tidak ada ID dalam respons tapi ada pesan sukses, coba ambil dari API transaksi
            else if (response.data && response.data.message === "Transaction Created") {
                try {
                    // Ambil transaksi terbaru dari API
                    const transactionsResponse = await axios.get(
                        'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user-transactions',
                        config
                    );

                    // Jika ada transaksi, ambil yang terbaru
                    const transactions = transactionsResponse.data.data || [];

                    if (transactions.length > 0) {
                        // Ambil ID dari transaksi terbaru
                        const latestTransaction = transactions[0];
                        transactionId = latestTransaction.id;
                        console.log("Transaction ID obtained from latest transaction:", transactionId);
                    } else {
                        throw new Error("No transactions found after creation");
                    }
                } catch (fetchErr) {
                    console.error("Error fetching transaction details after creation:", fetchErr);
                    throw new Error("Could not retrieve transaction ID after creation");
                }
            } else {
                throw new Error("Transaction ID not found in API response");
            }

            // CRITICAL: Pastikan kita mendapatkan transactionId yang valid
            if (!transactionId) {
                throw new Error("Failed to get valid transaction ID");
            }

            // Update transaction details with real transaction ID
            const updatedTransactionDetails = {
                ...transactionDetails,
                transactionId: transactionId, // Gunakan ID yang valid dari API
                cartIds: cartIds,
                // Tambahkan data lain yang mungkin ada dari respons API
                orderDate: new Date().toISOString(),
                status: 'pending'
            };

            // Update state dan session storage
            setTransactionDetails(updatedTransactionDetails);
            sessionStorage.setItem('transactionDetails', JSON.stringify(updatedTransactionDetails));

            // Aktivasi timer pembayaran
            setTimerActive(true);
            setLoading(false);
        } catch (err) {
            console.error("Failed to create transaction", err);

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
                setError(`Request error: ${err.message}`);
            }

            setLoading(false);
        }
    };


    const handleCancelTransaction = async () => {
        if (!transactionDetails?.transactionId) {
            setError('Transaction ID not found');
            return;
        }

        // Jika ID transaksi adalah temporary, kita tidak perlu memanggil API cancel
        if (transactionDetails.isTemporary) {
            // Cukup clear session storage dan navigate ke halaman activities
            sessionStorage.removeItem('transactionDetails');
            navigate('/activities');
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

            const response = await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${transactionDetails.transactionId}`,
                {},
                config
            );

            console.log("Transaction cancelled successfully:", response.data);

            // Clear session storage
            sessionStorage.removeItem('transactionDetails');

            // Navigate to activities page
            navigate('/activities');

        } catch (err) {
            console.error("Failed to cancel transaction", err);

            if (err.response) {
                if (err.response.data?.message) {
                    setError(`Cancel transaction error: ${err.response.data.message}`);
                } else {
                    setError(`Failed to cancel transaction (status ${err.response.status})`);
                }
            } else {
                setError('Failed to cancel transaction');
            }

            setLoading(false);
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

            console.log("Uploading payment proof...");

            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image',
                formData,
                config
            );

            console.log("Upload response:", response.data);

            // Variabel untuk menyimpan URL gambar
            let imgUrl = '';

            // Periksa beberapa kemungkinan struktur respons
            if (response.data && response.data.data && response.data.data.imageUrl) {
                imgUrl = response.data.data.imageUrl;
            } else if (response.data && response.data.data && response.data.data.url) {
                imgUrl = response.data.data.url;
            } else if (response.data && response.data.imageUrl) {
                imgUrl = response.data.imageUrl;
            } else if (response.data && response.data.url) {
                imgUrl = response.data.url;
            } else if (response.data && typeof response.data === 'string' && response.data.startsWith('http')) {
                // Jika responsnya langsung string URL
                imgUrl = response.data;
            } else {
                // Tidak ada URL gambar dalam respons
                console.error("Image URL not found in response structure:", response.data);
                throw new Error("Could not find image URL in server response");
            }

            // Set image URL state
            setImageUrl(imgUrl);
            console.log("Image uploaded successfully, URL:", imgUrl);

            setUploadLoading(false);

        } catch (err) {
            console.error("Failed to upload image", err);

            if (err.response) {
                console.error("Error response data:", err.response.data);

                if (err.response.data && err.response.data.message) {
                    setError(`Upload failed: ${err.response.data.message}`);
                } else {
                    setError(`Upload failed with status ${err.response.status}`);
                }
            } else if (err.request) {
                setError("No response from server. Please check your network connection.");
            } else {
                setError(`Upload error: ${err.message}`);
            }

            setUploadLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!imageUrl) {
            setError('Please upload proof of payment first');
            return;
        }

        if (!transactionDetails?.transactionId) {
            setError('Transaction ID not found. Please try creating the transaction again.');
            return;
        }

        // Hanya lanjutkan jika transactionId bukan string "TEMP-..."
        if (transactionDetails.transactionId.toString().startsWith('TEMP-')) {
            setError('Invalid transaction ID. Please try creating the transaction again by clicking Pay Now.');
            return;
        }

        try {
            setLoading(true);
            console.log(`Confirming payment for transaction ${transactionDetails.transactionId} with image URL: ${imageUrl}`);

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Step 1: Update transaction with proof of payment
            const updatePaymentResponse = await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${transactionDetails.transactionId}`,
                { imageUrl },
                config
            );

            console.log("Proof of payment updated successfully:", updatePaymentResponse.data);

            // Step 2: Update transaction status to 'paid'
            const updateStatusResponse = await axios.put(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${transactionDetails.transactionId}`,
                { status: 'paid' },
                config
            );

            console.log("Transaction status updated successfully:", updateStatusResponse.data);

            // Update local status
            setTransactionStatus('paid');
            setLoading(false);

            // Clear cart menggunakan deleteCart API untuk setiap item
            try {
                if (transactionDetails.cartIds && Array.isArray(transactionDetails.cartIds)) {
                    // Hapus semua cart item secara async
                    await Promise.all(transactionDetails.cartIds.map(cartId =>
                        axios.delete(
                            `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`,
                            config
                        )
                    ));
                    console.log("Cart items cleared successfully");
                }
            } catch (clearCartErr) {
                console.error("Failed to clear cart after payment", clearCartErr);
                // Tidak menampilkan error ke user karena ini bukan operasi kritis
            }

        } catch (err) {
            console.error("Failed to confirm payment", err);

            if (err.response) {
                console.error("Error response:", err.response.data);

                if (err.response.status === 404) {
                    setError(`Transaction with ID ${transactionDetails.transactionId} was not found. Please try creating the transaction again.`);
                } else if (err.response.data?.message) {
                    setError(`Payment confirmation failed: ${err.response.data.message}`);
                } else {
                    setError(`Payment confirmation failed with status ${err.response.status}`);
                }
            } else if (err.request) {
                setError("No response from server. Please check your internet connection.");
            } else {
                setError(`Payment confirmation error: ${err.message}`);
            }

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
            <Header />
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

                                        {transactionDetails?.items && transactionDetails.items.length > 0 ? (
                                            transactionDetails.items.map((item, index) => (
                                                <Box key={index} className="mb-4">
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={3}>
                                                            {item.imageUrl && (
                                                                <img
                                                                    src={item.imageUrl}
                                                                    alt={item.title}
                                                                    className="w-full h-24 object-cover rounded"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://via.placeholder.com/150?text=Image+Not+Available";
                                                                    }}
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
                                            ))
                                        ) : (
                                            <Typography variant="body1">No items in cart</Typography>
                                        )}
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
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = "https://via.placeholder.com/30?text=Bank";
                                                                        }}
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

                                        {/* Hapus tombol Pay Now karena transaksi sudah dibuat */}
                                        <Typography variant="body2" color="textSecondary" className="mt-2">
                                            Your transaction has been created. Please complete payment using the selected method.
                                        </Typography>
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
                                                disabled={loading}
                                            >
                                                {loading ? <CircularProgress size={24} /> : 'Cancel Transaction'}
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
                                            <Typography>
                                                Rp {(transactionDetails?.subtotal || 0).toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>

                                        <Box className="flex justify-between mb-2">
                                            <Typography>Promo Code</Typography>
                                            <Typography>
                                                {transactionDetails?.promoCode || 'None'}
                                            </Typography>
                                        </Box>

                                        <Box className="flex justify-between mb-2">
                                            <Typography>Discount</Typography>
                                            <Typography>
                                                - Rp {(transactionDetails?.discount || 0).toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>

                                        <Divider className="my-2" />

                                        <Box className="flex justify-between mb-2">
                                            <Typography variant="h6" className="font-semibold">Total</Typography>
                                            <Typography variant="h6" className="font-semibold">
                                                Rp {(transactionDetails?.total || 0).toLocaleString('id-ID')}
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
                                                value={transactionDetails?.transactionId || 'Not created yet'}
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
            <Footer />
        </div>
    );
};

export default Checkout;