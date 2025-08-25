import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

const PAGE_SIZE = 20;

const statusOptions = [
    { value: "success", label: "Mark as Success" },
    { value: "failed", label: "Mark as Failed" }
];

const TransactionManagement = () => {
    const { auth } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [updating, setUpdating] = useState({});
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        if (!auth.isLoggedIn || auth.user?.role !== "admin") {
            window.location.href = "/";
            return;
        }
        fetchTransactions();
    }, [auth.isLoggedIn, auth.user?.role]);

    // Handle page changes for client-side pagination
    useEffect(() => {
        if (allTransactions.length > 0) {
            const startIndex = (page - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            const paginatedTransactions = allTransactions.slice(startIndex, endIndex);
            setTransactions(paginatedTransactions);
        }
    }, [page, allTransactions]);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            console.log("Fetching all transactions..."); // Debug logging

            const res = await axios.get(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions`,
                config
            );

            console.log("API Response:", res.data); // Debug logging

            const fetchedTransactions = res.data.data || [];

            // Sort transactions by creation date (newest first)
            const sortedTransactions = fetchedTransactions.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA; // Descending order (newest first)
            });

            setAllTransactions(sortedTransactions);
            setTotalItems(sortedTransactions.length);
            setTotalPages(Math.ceil(sortedTransactions.length / PAGE_SIZE));

            // Set initial page transactions (page 1)
            const startIndex = (page - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);
            setTransactions(paginatedTransactions);

        } catch (err) {
            console.error("Fetch transactions error:", err);
            setError("Failed to fetch transactions");
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id, status) => {
        setUpdating(prev => ({ ...prev, [id]: true }));
        setError(null);
        setSuccessMsg("");
        try {
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };
            await axios.post(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${id}`,
                { status },
                config
            );
            setSuccessMsg("Status updated successfully");
            // Reset to page 1 after status update to ensure we see the updated data
            if (page !== 1) {
                setPage(1);
            } else {
                fetchTransactions();
            }
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction Management</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Total</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8">Loading...</td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8">No transactions found.</td>
                            </tr>
                        ) : (
                            // Hitung total transaksi per user
                            transactions.map(tx => {
                                const userTransactionCount = {};
                                transactions.forEach(tx => {
                                    const userId = tx.user?.id;
                                    if (userId) {
                                        userTransactionCount[userId] = (userTransactionCount[userId] || 0) + 1;
                                    }
                                });
                                return (
                                    <tr key={tx.id} className="border-b">
                                        <td className="px-4 py-2">{tx.id}</td>
                                        <td className="px-4 py-2">
                                            {tx.user?.name || "-"}
                                            {tx.user?.id && (
                                                <span className="ml-2 text-xs text-gray-500">(Total: {userTransactionCount[tx.user.id] || 1})</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">{tx.status}</td>
                                        <td className="px-4 py-2">{tx.total ? tx.total.toLocaleString("id-ID", { style: "currency", currency: "IDR" }) : "-"}</td>
                                        <td className="px-4 py-2">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-row gap-2">
                                                {statusOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        className={`px-3 py-1 cursor-pointer rounded text-white text-xs font-semibold ${opt.value === "failed" ? "bg-red-500" : opt.value === "success" ? "bg-green-600" : "bg-blue-500"} disabled:opacity-50`}
                                                        disabled={updating[tx.id]}
                                                        onClick={() => handleStatusUpdate(tx.id, opt.value)}
                                                        type="button"
                                                    >
                                                        {updating[tx.id] ? "Updating..." : opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-row justify-center items-center gap-2 mt-6">
                    <button
                        className="px-4 py-2 cursor-pointer rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={page === 1 || loading}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    <span className="mx-4 text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 cursor-pointer rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={page === totalPages || loading}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionManagement;