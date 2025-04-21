import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
    const location = useLocation();
    const { searchParams, apiHeaders } = location.state || { searchParams: {}, apiHeaders: {} };

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);

            // Membuat instance axios dengan konfigurasi default
            const api = axios.create({
                baseURL: "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1",
                headers: apiHeaders
            });

            // Menyiapkan parameter query
            const params = {};
            
            if (searchParams.text) {
                params.q = searchParams.text;
            }
            
            if (searchParams.categoryId) {
                params.categoryId = searchParams.categoryId;
            }
            
            if (searchParams.activityId) {
                params.activityId = searchParams.activityId;
            }

            try {
                // Fetch data dari API menggunakan axios
                const response = await api.get('/search', { params });
                
                console.log("Search API response:", response.data);
                
                if (response.data.status === "success") {
                    setResults(response.data.data || []);
                } else {
                    setError(response.data.message || "Terjadi kesalahan saat mencari data");
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                
                if (error.response) {
                    // Error dari response API (status code bukan 2xx)
                    setError(`Error ${error.response.status}: ${error.response.data.message || "Terjadi kesalahan pada server"}`);
                } else if (error.request) {
                    // Error karena tidak ada response (network error)
                    setError("Tidak dapat terhubung ke server. Silakan periksa koneksi Anda.");
                } else {
                    // Error pada setup request
                    setError("Terjadi kesalahan: " + error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchParams, apiHeaders]);

    return(
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Hasil Pencarian</h2>

            {/* Menampilkan parameter pencarian */}
            <div className="mb-6 p-4 bg-gray-100 rounded">
                <p>
                    {searchParams.text ? `Pencarian: "${searchParams.text}"` : "Semua hasil"}
                    {searchParams.categoryId ? ` dalam kategori ID: ${searchParams.categoryId}` : ""}
                    {searchParams.activityId ? ` dengan aktivitas ID: ${searchParams.activityId}` : ""}
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-4">
                    <p>Mencari data...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded">
                    <p>{error}</p>
                    <div className="mt-4">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">
                            ← Kembali ke halaman pencarian
                        </Link>
                    </div>
                </div>
            ) : results.length === 0 ? (
                <div className="p-4 bg-yellow-100 rounded">
                    <p>Tidak ada hasil yang ditemukan. Silakan coba dengan kata kunci lain.</p>
                    <div className="mt-4">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">
                            ← Kembali ke halaman pencarian
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Ditemukan {results.length} hasil</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((item) => (
                            <div key={item.id} className="border rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name || "Travel image"}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/600x400?text=No+Image';
                                        }}
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{item.name || item.title}</h3>
                                    {item.category && (
                                        <p className="text-sm text-gray-600 mb-1">
                                            Kategori: {item.category.name}
                                        </p>
                                    )}
                                    {item.activity && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            Aktivitas: {item.activity.name}
                                        </p>
                                    )}
                                    <p className="text-sm line-clamp-3">{item.description || "Tidak ada deskripsi"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">
                            ← Kembali ke halaman pencarian
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default SearchResults;