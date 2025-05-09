import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import { format } from "date-fns";
import {
    Container, Typography, Box, CircularProgress, Button, Chip, Paper, Divider
} from "@mui/material";
import { MdPayment, MdShoppingCart, MdSchedule } from "react-icons/md";

const TransactionDetails = () => {
    const { id } = useParams();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }
        const fetchTransaction = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                        'Authorization': `Bearer ${auth.token}`
                    }
                };
                const response = await axios.get(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
                    config
                );
                setTransaction(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load transaction details');
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [id, auth, navigate]);

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
        } catch {
            return dateString || 'N/A';
        }
    };

    const getStatusChip = (status) => {
        let color = "default";
        switch (status?.toLowerCase()) {
            case "pending": color = "warning"; break;
            case "paid": color = "success"; break;
            case "cancelled": color = "error"; break;
            case "completed": color = "primary"; break;
            default: color = "default";
        }
        return <Chip label={status} color={color} size="small" />;
    };

    if (loading) return (
        <Container sx={{ mt: 12, mb: 8, minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Container>
    );
    if (error) return (
        <Container sx={{ mt: 12, mb: 8, minHeight: "70vh" }}>
            <Typography color="error">{error}</Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/purchase-list')}>Back</Button>
        </Container>
    );
    if (!transaction) return null;

    return (
        <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Transaction Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Transaction ID: {transaction.id}</Typography>
                    <Typography variant="body2">Created At: {formatDate(transaction.createdAt)}</Typography>
                    <Typography variant="body2">Status: {getStatusChip(transaction.status)}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>Items:</Typography>
                {transaction.transaction_items && transaction.transaction_items.length > 0 ? (
                    transaction.transaction_items.map(item => (
                        <Box key={item.id} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <img
                                    src={item.imageUrls?.[0]}
                                    alt={item.title}
                                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                                    onError={event => {
                                        event.target.onerror = null;
                                        event.target.src = "https://images.unsplash.com/photo-1623883282543-067fbe8c85e1?w=500&auto=format&fit=crop&q=60";
                                    }}
                                />
                                <Box>
                                    <Typography variant="subtitle1">{item.title}</Typography>
                                    <Typography variant="body2">Quantity: {item.quantity || 1}</Typography>
                                    <Typography variant="body2">Price: {formatCurrency(item.price || 0)}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary">No items found.</Typography>
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>Payment Details:</Typography>
                <Typography variant="body2">
                    Method: {transaction.payment_method?.name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                    Proof: {transaction.proofImageUrl ? (
                        <a href={transaction.proofImageUrl} target="_blank" rel="noopener noreferrer">View Image</a>
                    ) : 'Not uploaded'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>Summary:</Typography>
                {(() => {
                    // Hitung subtotal dari semua item (price * quantity)
                    const subtotal = (transaction.transaction_items || []).reduce(
                        (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
                        0
                    );
                    // Diskon jika ada, fallback ke 0
                    const discount = transaction.discount || 0;
                    const total = subtotal - discount;
                    return (
                        <>
                            <Typography variant="body2">Subtotal: {formatCurrency(subtotal)}</Typography>
                            <Typography variant="body2">Discount: {formatCurrency(discount)}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                Total: {formatCurrency(total)}
                            </Typography>
                        </>
                    );
                })()}
                <Divider sx={{ my: 2 }} />
                <Button variant="contained" color="primary" onClick={() => navigate('/purchase-list')}>Back to Purchase List</Button>
            </Paper>
        </Container>
    );
};

export default TransactionDetails;
