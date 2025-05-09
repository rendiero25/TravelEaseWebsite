import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const PromoManagement = () => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // create/update
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        terms_condition: "",
        promo_code: "",
        promo_discount_price: "",
        minimum_claim_price: ""
    });
    const [selectedId, setSelectedId] = useState(null);

    // Fetch promos
    const fetchPromos = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
                { headers: { apiKey: API_KEY } }
            );
            setPromos(res.data.data || []);
            setFiltered(res.data.data || []);
        } catch {
            setError("Failed to fetch promos");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    // Search by name (local filter, fallback to API by ID if exact match)
    const handleSearch = async () => {
        if (!search.trim()) {
            setFiltered(promos);
            return;
        }
        // Local filter by name
        const local = promos.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        if (local.length > 0) {
            setFiltered(local);
        } else {
            // Try fetch by ID (assume user input is ID)
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promo/${search}`,
                    { headers: { apiKey: API_KEY } }
                );
                setFiltered(res.data.data ? [res.data.data] : []);
            } catch {
                setFiltered([]);
                setError("Promo not found");
            }
            setLoading(false);
        }
    };

    // Open modal for create/update
    const openModal = (mode, promo = null) => {
        setModalMode(mode);
        setFormData(
            promo
                ? {
                    title: promo.title,
                    description: promo.description,
                    imageUrl: promo.imageUrl,
                    terms_condition: promo.terms_condition,
                    promo_code: promo.promo_code,
                    promo_discount_price: promo.promo_discount_price,
                    minimum_claim_price: promo.minimum_claim_price
                }
                : {
                    title: "",
                    description: "",
                    imageUrl: "",
                    terms_condition: "",
                    promo_code: "",
                    promo_discount_price: "",
                    minimum_claim_price: ""
                }
        );
        setSelectedId(promo ? promo.id : null);
        setModalOpen(true);
    };

    // Submit create/update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (modalMode === "create") {
                await axios.post(
                    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-promo",
                    formData,
                    { headers: { apiKey: API_KEY, Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setSuccess("Promo created!");
            } else {
                await axios.post(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-promo/${selectedId}`,
                    formData,
                    { headers: { apiKey: API_KEY, Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setSuccess("Promo updated!");
            }
            setModalOpen(false);
            fetchPromos();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit");
        }
        setLoading(false);
    };

    // Delete promo
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this promo?")) return;
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await axios.delete(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-promo/${id}`,
                { headers: { apiKey: API_KEY, Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setSuccess("Promo deleted!");
            fetchPromos();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete");
        }
        setLoading(false);
    };

    // Split promos into rows of 5
    const rows = [];
    for (let i = 0; i < filtered.length; i += 5) {
        rows.push(filtered.slice(i, i + 5));
    }

    return (
        <div className="w-full p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Search by name or ID"
                        className="border p-2 rounded"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSearch}>Search</button>
                    <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setSearch(""); setFiltered(promos); }}>Show All</button>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => openModal("create")}>Create Promo</button>
            </div>

            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}

            {loading ? (
                <div>Loading...</div>
            ) : rows.length === 0 ? (
                <div className="text-gray-400 italic">No promos found.</div>
            ) : (
                <div className="flex flex-col gap-6">
                    {rows.map((row, idx) => (
                        <div key={idx} className="flex flex-row gap-4">
                            {row.map(promo => (
                                <div key={promo.id} className="flex flex-col bg-white rounded-lg shadow-md w-full max-w-xs min-w-[220px] flex-1">
                                    <img
                                        src={promo.imageUrl || "https://via.placeholder.com/400x180?text=No+Image"}
                                        alt={promo.title}
                                        className="h-32 w-full object-cover rounded-t-lg"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x180?text=No+Image"; }}
                                    />
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-lg font-semibold mb-1">{promo.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2">{promo.description}</p>
                                        <div className="text-sm mb-1"><span className="font-bold">Promo Code:</span> {promo.promo_code}</div>
                                        <div className="text-sm mb-1"><span className="font-bold">Discount Price:</span> {promo.promo_discount_price}</div>
                                        <div className="flex flex-row gap-2 mt-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openModal("update", promo)}>Update</button>
                                            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(promo.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md flex flex-col gap-4 shadow-lg">
                        <h2 className="font-bold text-xl mb-2">{modalMode === "create" ? "Create Promo" : "Update Promo"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="border p-2 rounded"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                className="border p-2 rounded"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                className="border p-2 rounded"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Terms & Condition"
                                className="border p-2 rounded"
                                value={formData.terms_condition}
                                onChange={e => setFormData({ ...formData, terms_condition: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Promo Code"
                                className="border p-2 rounded"
                                value={formData.promo_code}
                                onChange={e => setFormData({ ...formData, promo_code: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Discount Price"
                                className="border p-2 rounded"
                                value={formData.promo_discount_price}
                                onChange={e => setFormData({ ...formData, promo_discount_price: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Minimum Claim Price"
                                className="border p-2 rounded"
                                value={formData.minimum_claim_price}
                                onChange={e => setFormData({ ...formData, minimum_claim_price: e.target.value })}
                                required
                            />
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded border" />
                            )}
                            <div className="flex flex-row gap-2 justify-end">
                                <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
                                    {modalMode === "create" ? "Create" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoManagement;