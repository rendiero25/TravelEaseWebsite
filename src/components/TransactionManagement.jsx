import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

const PAGE_SIZE = 10;

const statusOptions = [
    { value: "success", label: "Mark as Success" },
    { value: "failed", label: "Mark as Failed" }
];

const TransactionManagement = () => {
    const { auth } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [updating, setUpdating] = useState({});
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        if (!auth.isLoggedIn || auth.user?.role !== "admin") {
            window.location.href = "/";
            return;
        }
        fetchTransactions();
        // eslint-disable-next-line
    }, [page]);

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
            const res = await axios.get(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions`,
                config
            );
            setTransactions(res.data.data || []);
            setTotalPages(Math.ceil((res.data.count || 1) / PAGE_SIZE));
        } catch (err) {
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
            fetchTransactions();
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
                                                        className={`px-3 py-1 rounded text-white text-xs font-semibold ${opt.value === "failed" ? "bg-red-500" : opt.value === "success" ? "bg-green-600" : "bg-blue-500"} disabled:opacity-50`}
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
            <div className="flex flex-row justify-center items-center gap-2 mt-6">
                <button
                    className="px-3 py-1 rounded bg-gray-200"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>
                <span className="mx-2">{page} / {totalPages}</span>
                <button
                    className="px-3 py-1 rounded bg-gray-200"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionManagement;