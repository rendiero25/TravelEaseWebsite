import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

const PaymentMethodManagement = () => {
    const { auth } = useAuth(); // Pindahkan ke sini
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);

    const fetchMethods = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
                { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
            );
            setMethods(res.data.data || []);
        } catch {
            setError("Failed to fetch payment methods");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!auth.isLoggedIn || auth.user?.role !== "admin") {
            window.location.href = "/";
            return;
        }
        fetchMethods();
    }, []);

    const handleCreate = async () => {
        setCreating(true);
        setError(null);
        try {
            await axios.post(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/generate-payment-methods",
                {},
                { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c", Authorization: `Bearer ${auth.token}` } }
            );
            fetchMethods();
        } catch {
            setError("Failed to create payment methods");
        }
        setCreating(false);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Payment Methods</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                    onClick={handleCreate}
                    disabled={creating}
                >
                    {creating ? "Creating..." : "Create Payment"}
                </button>
            </div>
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : error ? (
                <div className="text-red-600 mb-4">{error}</div>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {methods.map((m) => (
                        <div
                            key={m.id}
                            className="flex flex-col items-center border rounded-lg shadow p-4 w-[18%] min-w-[180px] mb-4 bg-white"
                        >
                            <img
                                src={m.logoUrl}
                                alt={m.name}
                                className="w-16 h-16 object-contain mb-2"
                                onError={event => {
                                    event.target.onerror = null;
                                    event.target.src = "https://s31799.pcdn.co/wp-content/uploads/2022/01/credit-icon-2022.png"}}
                                
                                
                            />

                            <div className="font-semibold text-center">{m.name}</div>
                            <div className="text-xs text-gray-500 text-center mt-1">{m.description}</div>
                        </div>
                    ))}
                    {methods.length === 0 && (
                        <div className="text-gray-500">No payment methods found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentMethodManagement;