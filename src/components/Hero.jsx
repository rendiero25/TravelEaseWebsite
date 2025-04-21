import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import HeroBg from "../assets/images/hero-bg.png";
import {BiRightArrowCircle, BiSearchAlt} from "react-icons/bi";
import Button from "@mui/material/Button";

const Hero = () => {
        // State untuk data dari API
        const [categories, setCategories] = useState([]);
        const [activities, setActivities] = useState([]);

        // State untuk nilai input
        const [searchText, setSearchText] = useState("");
        const [selectedCategory, setSelectedCategory] = useState("");
        const [selectedActivity, setSelectedActivity] = useState("");

        // State untuk loading
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);

        const navigate = useNavigate();

        const apiHeaders = {
            "Content-Type": "application/json",
            "apiKey": "24405e01-fbc1-45a5-9f5a-be13afcd757c", // Ganti dengan API key yang sebenarnya
            // Jika menggunakan token bearer, tambahkan:
            // "Authorization": "Bearer YOUR_TOKEN_HERE"
        };
        
        // Membuat instance axios dengan konfigurasi default
        const api = axios.create({
            baseURL: "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1",
            headers: apiHeaders
        });

        // Fungsi untuk mengambil data categories dari API dengan axios
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                
                console.log("Categories API response:", response.data);
                
                if (response.data.status === "success") {
                    setCategories(response.data.data);
                } else {
                    console.error("Error fetching categories:", response.data.message);
                    setError("Gagal memuat kategori: " + response.data.message);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                if (error.response) {
                    // Error dari response API (status code bukan 2xx)
                    setError(`Gagal memuat kategori: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
                } else if (error.request) {
                    // Error karena tidak ada response (network error)
                    setError("Gagal memuat kategori: Network error. Silakan periksa koneksi Anda.");
                } else {
                    // Error pada setup request
                    setError("Gagal memuat kategori: " + error.message);
                }
            }
        };

        // Fungsi untuk mengambil data activities dari API dengan axios
        const fetchActivities = async () => {
            try {
                const response = await api.get("/activities");
                
                console.log("Activities API response:", response.data);
                
                if (response.data.status === "success") {
                    setActivities(response.data.data);
                } else {
                    console.error("Error fetching activities:", response.data.message);
                    setError("Gagal memuat aktivitas: " + response.data.message);
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
                if (error.response) {
                    // Error dari response API (status code bukan 2xx)
                    setError(`Gagal memuat aktivitas: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
                } else if (error.request) {
                    // Error karena tidak ada response (network error)
                    setError("Gagal memuat aktivitas: Network error. Silakan periksa koneksi Anda.");
                } else {
                    // Error pada setup request
                    setError("Gagal memuat aktivitas: " + error.message);
                }
            }
        };

        // Memanggil API saat komponen di-mount
        useEffect(() => {
            setIsLoading(true);
            Promise.all([fetchCategories(), fetchActivities()])
                .finally(() => setIsLoading(false));
        }, []);

        // Fungsi untuk handle pencarian
        const handleSearch = (e) => {
            e.preventDefault();

            // Membuat objek parameter pencarian
            const searchParams = {
                text: searchText,
                categoryId: selectedCategory,
                activityId: selectedActivity
            };

            // Redirect ke halaman hasil pencarian dengan parameter
            navigate("/search-results", { 
                state: { 
                    searchParams, 
                    apiHeaders,
                    axiosInstance: true // Flag untuk menggunakan axios di SearchResults
                } 
            });
        };

    return(
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Pencarian Travel</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            )}

            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <form onSubmit={handleSearch}>
                    {/* Input Text */}
                    <div className="mb-4">
                        <label htmlFor="searchText" className="block mb-2 text-sm font-medium">
                            Cari berdasarkan nama
                        </label>
                        <input
                            type="text"
                            id="searchText"
                            className="w-full p-2 border rounded"
                            placeholder="Masukkan kata kunci..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    {/* Dropdown Categories */}
                    <div className="mb-4">
                        <label htmlFor="categories" className="block mb-2 text-sm font-medium">
                            Kategori
                        </label>
                        <select
                            id="categories"
                            className="w-full p-2 border rounded"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            disabled={categories.length === 0}
                        >
                            <option value="">Semua Kategori</option>
                            {categories && categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Tidak ada data kategori</option>
                            )}
                        </select>
                    </div>

                    {/* Dropdown Activities */}
                    <div className="mb-4">
                        <label htmlFor="activities" className="block mb-2 text-sm font-medium">
                            Aktivitas
                        </label>
                        <select
                            id="activities"
                            className="w-full p-2 border rounded"
                            value={selectedActivity}
                            onChange={(e) => setSelectedActivity(e.target.value)}
                            // disabled={activities.length === 0}
                        >
                            <option value="">Semua Aktivitas</option>
                            {activities && activities.length > 0 ? (
                                activities.map((activity) => (
                                    <option key={activity.id} value={activity.id}>
                                        {activity.title}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Tidak ada data aktivitas</option>
                            )}
                        </select>
                    </div>

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Cari
                    </button>
                </form>
            )}
        </div>


        // <div className="grow px-6 xl:px-22 3xl:px-42 4xl:px-80 py-2 flex justify-start items-center" style={{backgroundImage: `url(${HeroBg})`}}>
        //
        //
        //
        //     <div className="flex flex-col justify-between items-start gap-4">
        //         <h2 className="font-light text-md xl:text-xl text-white">Find out perfect place to hangout in your city</h2>
        //         <h1 className="font-bold text-4xl 3xl:text-7xl text-white">Discover great places.</h1>
        //
        //         <div className="flex flex-col justify-between items-start w-full">
        //             <div className="bg-white w-auto py-4 px-10 flex flex-row justify-between items-center gap-2 border-b-[0.03rem] border-white/25">
        //                 <BiSearchAlt className="size-4 text-black"/>
        //                 <h4 className="font-normal text-black text-sm">Search</h4>
        //             </div>
        //
        //             <div className="flex flex-col xl:flex-row justify-between items-start bg-white w-full px-6">
        //                 <div className="border-b-[0.03rem] border-black/25 pb-2 pt-10 px-6 w-full">
        //                     <input type="text" name="" id="" placeholder="What are you looking for?" className="placeholder:text-black placeholder:text-md outline-none w-full"/>
        //                 </div>
        //
        //                 <div className="border-b-[0.03rem] border-black/25 py-2 px-6 w-full">
        //                     <select className="w-full pt-6 pr-6 border-b-[0.03rem] border-white/25 flex justify-start items-center">
        //                         <option value="" disabled selected className="text-black text-xs outline-none">Categories?</option>
        //                     </select>
        //                 </div>
        //
        //
        //                 <div className="border-b-[0.03rem] border-black/25 py-2 px-6 w-full">
        //                     <select className="w-full pt-6 pr-6 border-b-[0.03rem] border-white/25 flex justify-start items-center">
        //                         <option value="" disabled selected className="text-black text-xs outline-none">Activities?</option>
        //                     </select>
        //                 </div>
        //
        //                 <div className="py-8 w-full">
        //                     <Button type="submit" variant="outlined" startIcon={<BiSearchAlt/>} style={{color:"#FF948D", fontWeight:"400", textTransform:"none", fontSize:"14px", borderWidth:"2px", borderColor:"#FF948D", borderRadius:"50px", padding:"8px 46px"}}>Search</Button>
        //                 </div>
        //             </div>
        //         </div>
        //
        //         <h2 className="font-light text-md text-white">Popular categories: #indonesia #japan #italy #sweden #southkorea</h2>
        //     </div>
        // </div>
    )
}

export default Hero;