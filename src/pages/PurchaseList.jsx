import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import { format } from "date-fns";

import {
    Container, Typography, Box, Grid, Paper, Divider,
    CircularProgress, Button, Accordion, AccordionSummary,
    AccordionDetails, Chip, Card, CardContent, CardMedia,
    Alert, Stack
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MdPayment, MdShoppingCart, MdReceipt, MdSchedule } from "react-icons/md";
import { BiChevronDown, BiDownload, BiDetail } from "react-icons/bi";

const PurchaseList = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchTransactions = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                        'Authorization': `Bearer ${auth.token}`
                    }
                };

                const response = await axios.get(
                    'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions',
                    config
                );

                console.log("Transactions:", response.data);
                setTransactions(response.data.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch transactions", err);
                setError(err.response?.data?.message || 'Failed to load transaction history');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [auth, navigate]);

    // Helper function to format status with appropriate colors
    const getStatusChip = (status) => {
        let color = "default";
        let label = status;

        switch (status?.toLowerCase()) {
            case "pending":
                color = "warning";
                break;
            case "paid":
                color = "success";
                break;
            case "cancelled":
                color = "error";
                break;
            case "completed":
                color = "primary";
                break;
            default:
                color = "default";
        }

        return <Chip label={label} color={color} size="small" />;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
        } catch (error) {
            return dateString || 'N/A';
        }
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    My Purchase History
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                ) : transactions.length === 0 ? (
                    <Box sx={{ my: 4, p: 4, textAlign: 'center' }}>
                        <MdShoppingCart size={64} color="#ccc" style={{ margin: '0 auto' }} />
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                            You don't have any transactions yet
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            onClick={() => navigate('/activities')}
                        >
                            Browse Activities
                        </Button>
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        {transactions.map((transaction) => (
                            <Paper
                                key={transaction.id}
                                elevation={2}
                                sx={{ overflow: 'hidden', borderRadius: 2 }}
                            >
                                {/* Transaction Header */}
                                <Box sx={{ p: 3, bgcolor: 'primary.light', color: 'white' }}>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Typography variant="subtitle2">
                                                Transaction ID: {transaction.id}
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatDate(transaction.createdAt)}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            {getStatusChip(transaction.status)}
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider />

                                {/* Transaction Items */}
                                <Box sx={{ p: 3 }}>
                                    {transaction.carts && transaction.carts.map((item) => (
                                        <Card
                                            key={item.id}
                                            sx={{
                                                mb: 2,
                                                display: 'flex',
                                                borderRadius: 2,
                                                boxShadow: 'none',
                                                border: '1px solid #eee'
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 120, height: 120, objectFit: 'cover' }}
                                                image={item.activity?.imageUrls?.[0] || 'https://via.placeholder.com/120x120?text=No+Image'}
                                                alt={item.activity?.title || 'Activity Image'}
                                            />
                                            <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                                                <Typography component="div" variant="h6">
                                                    {item.activity?.title || 'Activity Name'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <MdSchedule style={{ marginRight: 4 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Booking Date: {formatDate(item.bookingDate)}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Quantity: {item.quantity || 1}
                                                </Typography>
                                                <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                                                    {formatCurrency(item.activity?.price || 0)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>

                                <Divider />

                                {/* Payment Details */}
                                <Box sx={{ p: 3, bgcolor: '#f9f9f9' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <MdPayment style={{ marginRight: 8 }} /> Payment Details
                                            </Typography>
                                            <Typography variant="body2">
                                                Method: {transaction.paymentMethod?.name || 'N/A'}
                                            </Typography>
                                            {transaction.proofImageUrl && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    Payment Proof: Available
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2">Subtotal: {formatCurrency(transaction.totalAmount || 0)}</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                                                    Total: {formatCurrency(transaction.totalAmount || 0)}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ p: 2, bgcolor: '#f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<BiDetail />}
                                        onClick={() => navigate(`/transactions-user/${transaction.id}`)}
                                        sx={{ mr: 2 }}
                                    >
                                        View Details
                                    </Button>
                                    {transaction.status === 'COMPLETED' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<BiDownload />}
                                        >
                                            Download Invoice
                                        </Button>
                                    )}
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Container>

        </>
    );
};

export default PurchaseList;