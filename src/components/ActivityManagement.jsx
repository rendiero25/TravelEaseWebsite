import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const initialForm = {
    title: "",
    description: "",
    price: "",
    city: "",
    province: "",
    address: "",
    imageUrls: "",
    categoryId: ""
};

const ActivityManagement = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // create/update
    const [formData, setFormData] = useState(initialForm);
    const [selectedId, setSelectedId] = useState(null);

    // Fetch all activities
    const fetchActivities = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
                { headers: { apiKey: API_KEY } }
            );
            setActivities(res.data.data || []);
            setFiltered(res.data.data || []);
        } catch {
            setError("Failed to fetch activities");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // Search by ID (API) or by name (local)
    const handleSearch = async () => {
        if (!search.trim()) {
            setFiltered(activities);
            return;
        }
        // Local filter by name
        const local = activities.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
        if (local.length > 0) {
            setFiltered(local);
        } else {
            // Try fetch by ID
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${search}`,
                    { headers: { apiKey: API_KEY } }
                );
                setFiltered(res.data.data ? [res.data.data] : []);
            } catch {
                setFiltered([]);
                setError("Activity not found");
            }
            setLoading(false);
        }
    };

    // Open modal for create/update
    const openModal = (mode, activity = null) => {
        setModalMode(mode);
        setFormData(
            activity
                ? {
                    title: activity.title,
                    description: activity.description,
                    price: activity.price,
                    city: activity.city,
                    province: activity.province,
                    address: activity.address,
                    imageUrls: (activity.imageUrls || []).join(","),
                    categoryId: activity.categoryId || ""
                }
                : initialForm
        );
        setSelectedId(activity ? activity.id : null);
        setModalOpen(true);
    };

    // Submit create/update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                imageUrls: formData.imageUrls.split(",").map(s => s.trim())
            };
            if (modalMode === "create") {
                await axios.post(
                    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity",
                    payload,
                    { headers: { apiKey: API_KEY, Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            } else {
                await axios.post(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${selectedId}`,
                    payload,
                    { headers: { apiKey: API_KEY, Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            }
            setModalOpen(false);
            fetchActivities();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit");
        }
        setLoading(false);
    };

    // Delete activity
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this activity?")) return;
        setLoading(true);
        setError("");
        try {
            await axios.delete(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${id}`,
                { headers: { apiKey: API_KEY, Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchActivities();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete");
        }
        setLoading(false);
    };

    // Split activities into rows of 5
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
                    <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setSearch(""); setFiltered(activities); }}>Show All</button>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => openModal("create")}>Create Activity</button>
            </div>

            {error && <div className="text-red-500 mb-2">{error}</div>}

            {loading ? (
                <div>Loading...</div>
            ) : rows.length === 0 ? (
                <div>No activities found.</div>
            ) : (
                <div className="flex flex-col gap-6">
                    {rows.map((row, idx) => (
                        <div key={idx} className="flex flex-row gap-4">
                            {row.map(activity => (
                                <div key={activity.id} className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 p-4 flex flex-col">
                                    <img
                                        src={activity.imageUrls?.[0] || "https://via.placeholder.com/400x180?text=No+Image"}
                                        alt={activity.title}
                                        className="h-32 w-full object-cover rounded mb-2"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x180?text=No+Image"; }}
                                    />
                                    <div className="font-bold text-lg mb-1">{activity.title}</div>
                                    <div className="text-gray-600 text-sm mb-1">{activity.city}, {activity.province}</div>
                                    <div className="text-gray-500 text-xs mb-1">{activity.address}</div>
                                    <div className="text-primary font-bold text-base mb-2">Rp {activity.price}</div>
                                    <div className="flex flex-row gap-2 mt-auto">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openModal("update", activity)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(activity.id)}>Delete</button>
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
                        <h2 className="font-bold text-xl mb-2">{modalMode === "create" ? "Create Activity" : "Update Activity"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="border p-2 rounded"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                className="border p-2 rounded"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                className="border p-2 rounded"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="City"
                                className="border p-2 rounded"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Province"
                                className="border p-2 rounded"
                                value={formData.province}
                                onChange={e => setFormData({ ...formData, province: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                className="border p-2 rounded"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Image URLs (comma separated)"
                                className="border p-2 rounded"
                                value={formData.imageUrls}
                                onChange={e => setFormData({ ...formData, imageUrls: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Category ID"
                                className="border p-2 rounded"
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            />
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

export default ActivityManagement;