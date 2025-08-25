import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { format } from "date-fns";

import {
    Container, Typography, Box, CircularProgress, Button, Chip, Alert, Stack, Collapse, IconButton
} from "@mui/material";
import { MdPayment, MdShoppingCart, MdSchedule } from "react-icons/md";
import { BiChevronDown, BiDownload, BiDetail } from "react-icons/bi";
import Pagination from '@mui/material/Pagination';

const PurchaseList = () => {
    const { auth } = useAuth();
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState({});
    const rowsPerPage = 15;

    const handleExpandClick = (transactionId) => {
        setExpanded(prev => ({
            ...prev,
            [transactionId]: !prev[transactionId]
        }));
    };

    useEffect(() => {
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

                // Ensure each transaction has transaction_items as an array
                const txs = (response.data.data || []).map(tx => ({
                    ...tx,
                    transaction_items: Array.isArray(tx.transaction_items) ? tx.transaction_items : []
                }));

                setTransactions(txs);
                setLoading(false);

                // Refresh cart count when purchase history is loaded
                // This ensures cart count is updated if transactions were completed
                if (fetchCartCount) {
                    fetchCartCount();
                }
            } catch (err) {
                console.error("Failed to fetch transactions", err);
                setError(err.response?.data?.message || 'Failed to load transaction history');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [auth, navigate, fetchCartCount]);

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

    // Pagination logic
    const paginatedTransactions = transactions.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 py-10 xl:py-20 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 w-full">
                <div>
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
                        <>
                            <div className="grid grid-cols-1 xl:grid-cols-3 justify-between items-center gap-8 w-full">
                                {paginatedTransactions.map((transaction) => {
                                    const hasMultiple = transaction.transaction_items.length > 1;
                                    return (
                                        <div key={transaction.id} className="rounded-2xl overflow-hidden bg-white flex flex-col h-full">
                                            {/* Transaction Header */}
                                            <div className={`p-6 ${['paid', 'completed', 'success'].includes(transaction.status?.toLowerCase()) ? 'bg-green-500 text-black' : 'bg-primary text-white'} flex flex-col md:flex-row gap-6 md:items-center md:justify-between`}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-sm font-semibold">Transaction ID: {transaction.id}</div>
                                                    {/* Show purchased activity names */}
                                                    {transaction.transaction_items && transaction.transaction_items.length > 0 && (
                                                        <div className="text-md font-light mt-1 flex items-center">
                                                            {hasMultiple ? (
                                                                <>
                                                                    Activities: {transaction.transaction_items.map(item => item.title || '-').slice(0, 1).join(', ')}
                                                                    <IconButton
                                                                        size="medium"
                                                                        onClick={() => handleExpandClick(transaction.id)}
                                                                        sx={{ ml: 1, color: ['paid', 'completed', 'success'].includes(transaction.status?.toLowerCase()) ? "black" : "white" }}
                                                                    >
                                                                        <BiChevronDown style={{
                                                                            transform: expanded[transaction.id] ? "rotate(180deg)" : "rotate(0deg)",
                                                                            transition: "transform 0.2s"
                                                                        }} />
                                                                    </IconButton>
                                                                </>
                                                            ) : (
                                                                `Activity: ${transaction.transaction_items[0]?.title || '-'}`
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="text-xs">{formatDate(transaction.createdAt)}</div>
                                                </div>
                                                <div className="mt-2 md:mt-0">
                                                    {getStatusChip(transaction.status)}
                                                </div>
                                            </div>

                                            {/* Transaction Items */}
                                            <div>
                                                {hasMultiple ? (
                                                    <>
                                                        {/* Always show the first item */}
                                                        <div
                                                            key={transaction.transaction_items[0].id}
                                                            className="flex flex-row items-center gap-4 border border-gray-200 p-6 bg-gray-50"
                                                        >
                                                            <img
                                                                src={transaction.transaction_items[0].imageUrls?.[0]}
                                                                alt={transaction.transaction_items[0].title || 'Activity Image'}
                                                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                                                onError={event => {
                                                                    event.target.onerror = null;
                                                                    event.target.src = "https://images.unsplash.com/photo-1623883282543-067fbe8c85e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFtdXNlbWVudCUyMHBhcmt8ZW58MHwyfDB8fHww"
                                                                }}
                                                            />
                                                            <div className="flex flex-col flex-1">
                                                                <div className="font-semibold text-lg">
                                                                    {transaction.transaction_items[0].title || `Activity ID: ${transaction.transaction_items[0].id || '-'}`}
                                                                </div>
                                                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                                                    <MdSchedule className="mr-1" />
                                                                    Booking Date: {transaction.orderDate ? formatDate(transaction.orderDate) : '-'}
                                                                </div>
                                                                <div className="text-gray-500 text-sm mt-1">
                                                                    Quantity: {transaction.transaction_items[0].quantity || 1}
                                                                </div>
                                                                <div className="text-primary font-bold text-base mt-1">
                                                                    {formatCurrency(transaction.transaction_items[0].price || 0)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Collapse in={expanded[transaction.id]} timeout="auto" unmountOnExit>
                                                            {transaction.transaction_items.slice(1).map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex flex-row items-center gap-4 border border-gray-200 p-6 bg-gray-50"
                                                                >
                                                                    <img
                                                                        src={item.imageUrls?.[0]}
                                                                        alt={item.title || 'Activity Image'}
                                                                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                                                        onError={event => {
                                                                            event.target.onerror = null;
                                                                            event.target.src = "https://images.unsplash.com/photo-1623883282543-067fbe8c85e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFtdXNlbWVudCUyMHBhcmt8ZW58MHwyfDB8fHww"
                                                                        }}
                                                                    />
                                                                    <div className="flex flex-col flex-1">
                                                                        <div className="font-semibold text-lg">
                                                                            {item.title || `Activity ID: ${item.id || '-'}`}
                                                                        </div>
                                                                        <div className="flex items-center text-gray-500 text-sm mt-1">
                                                                            <MdSchedule className="mr-1" />
                                                                            Booking Date: {transaction.orderDate ? formatDate(transaction.orderDate) : '-'}
                                                                        </div>
                                                                        <div className="text-gray-500 text-sm mt-1">
                                                                            Quantity: {item.quantity || 1}
                                                                        </div>
                                                                        <div className="text-primary font-bold text-base mt-1">
                                                                            {formatCurrency(item.price || 0)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </Collapse>
                                                    </>
                                                ) : (
                                                    (transaction.transaction_items && transaction.transaction_items.length > 0) ? transaction.transaction_items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex flex-row items-center gap-4 border border-gray-200 p-6 bg-gray-50"
                                                        >
                                                            <img
                                                                src={item.imageUrls?.[0]}
                                                                alt={item.title || 'Activity Image'}
                                                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                                                onError={event => {
                                                                    event.target.onerror = null;
                                                                    event.target.src = "https://images.unsplash.com/photo-1623883282543-067fbe8c85e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFtdXNlbWVudCUyMHBhcmt8ZW58MHwyfDB8fHww"
                                                                }}
                                                            />
                                                            <div className="flex flex-col flex-1">
                                                                <div className="font-semibold text-lg">
                                                                    {item.title || `Activity ID: ${item.id || '-'}`}
                                                                </div>
                                                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                                                    <MdSchedule className="mr-1" />
                                                                    Booking Date: {transaction.orderDate ? formatDate(transaction.orderDate) : '-'}
                                                                </div>
                                                                <div className="text-gray-500 text-sm mt-1">
                                                                    Quantity: {item.quantity || 1}
                                                                </div>
                                                                <div className="text-primary font-bold text-base mt-1">
                                                                    {formatCurrency(item.price || 0)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="text-gray-400 text-sm italic mb-4">No activities found.</div>
                                                    )
                                                )}
                                            </div>

                                            {/* Payment Details */}
                                            <div className="p-6 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-start gap-4 border border-gray-200">
                                                <div>
                                                    <div className="flex items-center font-semibold mb-1">
                                                        <MdPayment className="mr-2" /> Payment Details
                                                    </div>
                                                    <div className="text-sm text-gray-700">
                                                        Method: {transaction.payment_method.name || 'N/A'}
                                                    </div>
                                                    {transaction.proofImageUrl && (
                                                        <div className="text-sm text-green-600 mt-1">
                                                            Payment Proof: Available
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right md:text-right flex-1">
                                                    {/* Hitung subtotal dan total berdasarkan quantity masing-masing item */}
                                                    {(() => {
                                                        const total = (transaction.transaction_items || []).reduce(
                                                            (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
                                                            0
                                                        );
                                                        return (
                                                            <>
                                                                <div className="text-sm text-gray-700">
                                                                    Subtotal: {formatCurrency(total)}
                                                                </div>
                                                                <div className="font-bold text-lg mt-1">
                                                                    Total: {formatCurrency(total)}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="p-4 bg-gray-100 flex flex-row justify-center gap-2 w-full border border-gray-200">
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<BiDetail />}
                                                    onClick={() => navigate(`/transactions-details/${transaction.id}`)}
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-center mt-10 xl:mt-20">
                                <Pagination
                                    count={Math.ceil(transactions.length / rowsPerPage)}
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    color="primary"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseList;