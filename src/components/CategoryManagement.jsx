import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const CategoryManagement = () => {
    const { auth } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    // Form states
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState("create"); // create/update
    const [formData, setFormData] = useState({ name: "", imageUrl: "" });
    const [selectedId, setSelectedId] = useState(null);

    // Search
    const [searchId, setSearchId] = useState("");

    // Fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
                { headers: { apiKey: API_KEY } }
            );
            setCategories(res.data.data || []);
        } catch (err) {
            setError("Failed to fetch categories");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!auth.isLoggedIn || auth.user?.role !== "admin") {
            window.location.href = "/";
            return;
        }
        fetchCategories();
    }, []);

    // Search by ID
    const handleSearch = async () => {
        if (!searchId.trim()) {
            fetchCategories();
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/category/${searchId}`,
                { headers: { apiKey: API_KEY } }
            );
            setCategories(res.data.data ? [res.data.data] : []);
        } catch {
            setCategories([]);
            setError("Category not found");
        }
        setLoading(false);
    };

    // Open form for create/update
    const openForm = (mode, cat = null) => {
        setFormMode(mode);
        setFormData(cat ? { name: cat.name, imageUrl: cat.imageUrl } : { name: "", imageUrl: "" });
        setSelectedId(cat ? cat.id : null);
        setFormOpen(true);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (formMode === "create") {
                await axios.post(
                    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-category",
                    formData,
                    { headers: { apiKey: API_KEY, Authorization: `Bearer ${auth.token}` } }
                );
                setSuccess("Category created!");
            } else {
                await axios.post(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-category/${selectedId}`,
                    formData,
                    { headers: { apiKey: API_KEY, Authorization: `Bearer ${auth.token}` } }
                );
                setSuccess("Category updated!");
            }
            setFormOpen(false);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit");
        }
        setLoading(false);
    };

    // Delete category
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await axios.delete(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-category/${id}`,
                { headers: { apiKey: API_KEY, Authorization: `Bearer ${auth.token}` } }              
            );
            setSuccess("Category deleted!");
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete");
        }
        setLoading(false);
    };

    // Pagination
    const paginated = categories.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="w-full p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Search by ID"
                        className="border p-2 rounded"
                        value={searchId}
                        onChange={e => setSearchId(e.target.value)}
                    />
                    <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSearch}>Search</button>
                    <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setSearchId(""); fetchCategories(); }}>Show All</button>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => openForm("create")}>Create Category</button>
            </div>

            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}

            <div className="flex flex-col gap-4">
                {loading ? (
                    <div>Loading...</div>
                ) : paginated.length === 0 ? (
                    <div className="text-gray-400 italic">No categories found.</div>
                ) : (
                    paginated.map(cat => (
                        <div key={cat.id} className="flex flex-row items-center justify-between border p-4 rounded shadow bg-white">
                            <div className="flex flex-row items-center gap-4">
                                <img src={cat.imageUrl} alt={cat.name} className="w-20 h-20 object-cover rounded" />
                                <div>
                                    <div className="font-bold text-lg">{cat.name}</div>
                                    <div className="text-gray-500 text-sm">ID: {cat.id}</div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openForm("update", cat)}>Update</button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(cat.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-row justify-center mt-6 gap-2">
                {Array.from({ length: Math.ceil(categories.length / rowsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 rounded ${page === i + 1 ? "bg-primary text-white" : "bg-gray-200"}`}
                        onClick={() => setPage(i + 1)}
                    >{i + 1}</button>
                ))}
            </div>

            {/* Modal Form */}
            {formOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md flex flex-col gap-4 shadow-lg">
                        <h2 className="font-bold text-xl mb-2">{formMode === "create" ? "Create Category" : "Update Category"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Category Name"
                                className="border p-2 rounded"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded border" />
                            )}
                            <div className="flex flex-row gap-2 justify-end">
                                <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setFormOpen(false)}>Cancel</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
                                    {formMode === "create" ? "Create" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;