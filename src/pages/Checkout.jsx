import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import { format } from "date-fns";

import {
    Container, Typography, Box, Grid, Paper, Divider, Alert,
    CircularProgress, Button, TextField, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, Stepper, Step,
    StepLabel, Card, CardContent, CardMedia, Radio, RadioGroup,
    FormControlLabel, FormControl, FormLabel, FormHelperText
} from "@mui/material";
import { BiReceipt, BiCreditCard, BiCheckCircle, BiArrowBack, BiUpload } from "react-icons/bi";
import { MdPayment, MdShoppingCart, MdLocationOn } from "react-icons/md";

const Checkout = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [address, setAddress] = useState({
        fullName: "",
        street: "",
        city: "",
        province: "",
        postalCode: "",
        phone: ""
    });
    const [transactionId, setTransactionId] = useState(null);
    const [proofImage, setProofImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [proofImageUrl, setProofImageUrl] = useState(null);
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const [confirmationSuccess, setConfirmationSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Steps for checkout process
    const steps = ['Review Order', 'Payment Method', 'Upload Proof', 'Confirmation'];

    useEffect(() => {
        // Check if user is logged in
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }

        // Get transaction details from session storage
        const getTransactionFromStorage = () => {
            try {
                const storedTransaction = sessionStorage.getItem('transactionDetails');
                if (!storedTransaction) {
                    throw new Error('No transaction details found. Please return to cart.');
                }

                const parsedTransaction = JSON.parse(storedTransaction);
                console.log("Retrieved transaction details:", parsedTransaction);
                setTransactionDetails(parsedTransaction);

                // If transaction has a payment method, set it as selected
                if (parsedTransaction.paymentMethodId) {
                    setSelectedPaymentMethod(parsedTransaction.paymentMethodId);
                }

                setLoading(false);
            } catch (err) {
                console.error("Failed to retrieve transaction details", err);
                setError('Failed to load transaction details. Please return to cart.');
                setLoading(false);
            }
        };

        // Fetch available payment methods
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
                // Don't set error here, as it's not critical
            }
        };

        getTransactionFromStorage();
        fetchPaymentMethods();
    }, [auth.isLoggedIn, auth.token, navigate]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentMethodSelect = (id) => {
        setSelectedPaymentMethod(id);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProofImage(e.target.files[0]);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const createTransaction = async () => {
        try {
            setProcessingPayment(true);

            // Make sure we have the correct cartIds format from transactionDetails
            const cartIds = transactionDetails.items.map(item => item.id);

            // Make sure we have a payment method selected
            if (!selectedPaymentMethod) {
                setError("Please select a payment method");
                setProcessingPayment(false);
                return;
            }

            // Make the API call to create transaction
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            const payload = {
                paymentMethodId: selectedPaymentMethod,
                cartIds: cartIds // Using properly formatted cart IDs
            };

            console.log("Transaction payload:", payload);

            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction',
                payload,
                config
            );

            console.log("Transaction created:", response.data);

            // Store transaction ID for next steps
            setPaymentSuccess(true);
            setActiveStep(2); // Move to upload proof step

        } catch (err) {
            console.error("Failed to create transaction", err);
            setError('Failed to process payment. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };

    const uploadProofImage = async () => {
        if (!proofImage) {
            setError('No image selected');
            return;
        }

        try {
            setUploadingImage(true);
            setError(null);

            const formData = new FormData();
            formData.append('image', proofImage);

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

            if (response.data && response.data.status === 'OK') {
                setProofImageUrl(response.data.data.imageUrl);
                // Now update the transaction with the proof URL
                await updateTransactionWithProof(response.data.data.imageUrl);
            } else {
                throw new Error(response.data?.message || 'Failed to upload image');
            }
        } catch (err) {
            console.error("Failed to upload proof image", err);
            setError(err.response?.data?.message || 'Failed to upload proof image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const updateTransactionWithProof = async (imageUrl = null) => {
        if (!transactionId) {
            setError('Transaction ID is missing');
            return;
        }

        try {
            setConfirmingPayment(true);
            setError(null);

            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            const data = {
                proofPaymentUrl: imageUrl || proofImageUrl
            };

            const response = await axios.post(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${transactionId}`,
                data,
                config
            );

            if (response.data && response.data.status === 'OK') {
                // For demo purposes, let's simulate automatic transaction confirmation
                await simulateAdminConfirmation();

                // Advance to final step
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                throw new Error(response.data?.message || 'Failed to update transaction with payment proof');
            }
        } catch (err) {
            console.error("Failed to update transaction with proof", err);
            setError(err.response?.data?.message || 'Failed to update transaction with payment proof. Please try again.');
        } finally {
            setConfirmingPayment(false);
        }
    };

    // Simulate admin confirmation (for demo purposes)
    const simulateAdminConfirmation = async () => {
        try {
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}` // Using user token for demo
                }
            };

            const data = {
                status: "success"
            };

            const response = await axios.post(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${transactionId}`,
                data,
                config
            );

            if (response.data && response.data.status === 'OK') {
                setConfirmationSuccess(true);
                // Clear transaction from session storage as it's complete
                sessionStorage.removeItem('transactionDetails');
            }
        } catch (err) {
            console.error("Failed to confirm transaction (simulation)", err);
            // Don't fail the whole process if this fails, as it's just a simulation
        }
    };

    const handleFinish = () => {
        // Navigate to purchase history or home
        navigate('/purchase-list');
    };

    const handleNext = () => {
        if (activeStep === 1) { // Payment Method step
            // Make sure selectedPaymentMethod is not null before proceeding
            if (!selectedPaymentMethod) {
                setError('Please select a payment method before proceeding');
                return;
            }

            // Find the selected payment method object
            const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

            if (!selectedMethod) {
                setError('Invalid payment method selected');
                return;
            }

            // Now proceed with transaction creation using selectedMethod.id
            createTransaction(selectedMethod.id);
        } else {
            // Handle other steps
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Review Your Order
                        </Typography>
                        {transactionDetails && transactionDetails.items && (
                            <>
                                <List>
                                    {transactionDetails.items.map((item) => (
                                        <ListItem key={item.id} sx={{ mb: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="rounded"
                                                    src={item.activity?.imageUrls?.[0] || ''}
                                                    sx={{ width: 80, height: 80, mr: 2 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={item.activity?.title || 'Activity'}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            Quantity: {item.quantity || 1}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="span" variant="body2">
                                                            Price: ${item.activity?.price?.toFixed(2) || '0.00'}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            <Typography variant="body1" fontWeight="bold">
                                                ${(item.activity?.price * (item.quantity || 1)).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Subtotal:</Typography>
                                    <Typography variant="body1">${transactionDetails.subtotal?.toFixed(2) || '0.00'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Discount:</Typography>
                                    <Typography variant="body1">-${transactionDetails.discount?.toFixed(2) || '0.00'}</Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6" color="primary">${transactionDetails.total?.toFixed(2) || '0.00'}</Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Select Payment Method
                        </Typography>
                        {processingPayment ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup
                                    value={selectedPaymentMethod || ''}
                                    onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                                >
                                    {paymentMethods.map((method) => (
                                        <Paper
                                            key={method.id}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                border: selectedPaymentMethod === method.id ? '2px solid #1976d2' : '1px solid #eee',
                                                borderRadius: 2,
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handlePaymentMethodSelect(method.id)}
                                        >
                                            <FormControlLabel
                                                value={method.id}
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box sx={{ mr: 2 }}>
                                                            <BiCreditCard size={24} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body1">{method.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {method.description || 'Pay with this method'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                                sx={{ width: '100%', margin: 0 }}
                                            />
                                        </Paper>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Upload Payment Proof
                        </Typography>
                        <Paper sx={{ p: 3, mb: 3, border: '1px dashed #1976d2', borderRadius: 2 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                {proofImageUrl ? (
                                    <Box>
                                        <img
                                            src={proofImageUrl}
                                            alt="Payment proof"
                                            style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '16px' }}
                                        />
                                        <Typography variant="body2" color="success.main" gutterBottom>
                                            Image uploaded successfully!
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<BiUpload />}
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{ mt: 1 }}
                                        >
                                            Change Image
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                        />
                                        <Button
                                            variant="outlined"
                                            startIcon={<BiUpload />}
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{ mb: 2 }}
                                        >
                                            {proofImage ? 'Change Image' : 'Select Image'}
                                        </Button>
                                        {proofImage && (
                                            <Typography variant="body2" color="text.secondary">
                                                Selected: {proofImage.name}
                                            </Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                            Please upload a clear image of your payment receipt or screenshot.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>

                        {uploadingImage && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                                <CircularProgress size={24} sx={{ mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Uploading image...
                                </Typography>
                            </Box>
                        )}

                        {confirmingPayment && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                                <CircularProgress size={24} sx={{ mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Confirming payment...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <BiCheckCircle size={64} color="#4caf50" />
                        <Typography variant="h5" color="success.main" gutterBottom sx={{ mt: 2 }}>
                            Payment Successful!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Your transaction has been completed successfully.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Transaction ID: {transactionId}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Date: {format(new Date(), 'PPP')}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={handleFinish}
                        >
                            View Purchase History
                        </Button>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <MdShoppingCart size={28} style={{ marginRight: '8px' }} />
                        <Typography variant="h5" component="h1">
                            Checkout
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <Box sx={{ mt: 2, mb: 4 }}>
                                {renderStepContent()}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    disabled={activeStep === 0 || activeStep === steps.length - 1}
                                    onClick={handleBack}
                                    startIcon={<BiArrowBack />}
                                >
                                    Back
                                </Button>
                                <Box>
                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFinish}
                                        >
                                            Finish
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            disabled={
                                                processingPayment ||
                                                uploadingImage ||
                                                confirmingPayment
                                            }
                                        >
                                            {activeStep === steps.length - 2 ? 'Complete' : 'Next'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
            
        </>
    );
};

export default Checkout;