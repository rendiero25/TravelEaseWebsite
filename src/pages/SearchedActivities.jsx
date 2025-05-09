// SearchedActivities.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import {BiCommentDots, BiStar} from "react-icons/bi";

const SearchedActivities = ({ categoriesFromApp }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Ambil params dari query string
    const searchParams = new URLSearchParams(location.search);
    const title = searchParams.get("title") || "";
    const categoryId = searchParams.get("categoryId") || "";

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    const [searchTitle, setSearchTitle] = useState(title);
    const [searchCategory, setSearchCategory] = useState(categoryId);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);

    const goToActivityDetails = (activityId) => {
        navigate(`/activity/${activityId}`);
    };

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                // Fetch semua activity dulu
                const res = await axios.get(
                    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "apiKey": '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                        }
                    }
                );
                let results = res.data.data;

                // Filter by title and categoryId (hanya filter lokal, jika API mendukung query params gunakan itu)
                if (title) {
                    results = results.filter(act =>
                        act.title.toLowerCase().includes(title.toLowerCase())
                    );
                }
                if (categoryId) {
                    results = results.filter(act => act.categoryId === categoryId);
                }
                setActivities(results);
            } catch (err) {
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [title, categoryId]);

    // Fetch categories untuk dropdown
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await axios.get(
                    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
                    { headers: { 'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c' } }
                );
                setCategories(res.data.data || []);
            } catch {
                setCategories([]);
            }
        }
        fetchCategories();
    }, []);

    // Handler pencarian/filter lokal
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTitle && !searchCategory) {
            setError(true);
            return;
        }
        setError(false);
        let filtered = activities;
        if (searchTitle) {
            filtered = filtered.filter(act => act.title.toLowerCase().includes(searchTitle.toLowerCase()));
        }
        if (searchCategory) {
            filtered = filtered.filter(act => act.category && act.category.id === searchCategory);
        }
        setPage(1);
        setActivities(filtered);
    };

    // Reset filter
    const handleReset = () => {
        setSearchTitle("");
        setSearchCategory("");
        setError(false);
        // Refetch original activities from API (pakai useEffect)
        window.location.reload();
    };

    // Pagination logic
    const paginatedActivities = activities.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="flex flex-col justify-between">
                <div className="pt-20 pb-10 flex flex-col xl:flex-row items-start justify-between px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                    <div className="flex-1 w-full">
                        <h1 className="font-light text-black text-2xl mb-4">Search Results</h1>
                        {loading ? (<div>Loading...</div>) : activities.length === 0 ? (<div>No activities found.</div>) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                                    {paginatedActivities.map(act => (
                                        <li 
                                            key={act.id} 
                                            className="bg-red-500 bg-white rounded-lg flex flex-col xl:flex-row justify-between gap-4 cursor-pointer border-[0.03rem] border-black/10 w-full" 
                                            onClick={() => goToActivityDetails(act.id)}
                                        >
                                            <div className="flex flex-wrap justify-center items-start w-full h-full hover:shadow-2xl/15">
                                                <div className="flex flex-col justify-between items-start gap-2 h-full w-full">
                                                    <img 
                                                        src={act.imageUrls[0]} 
                                                        alt="activities-image" 
                                                        className="w-full h-75 xl:h-48 object-cover mb-3 rounded-t-lg"
                                                        onError={event => {
                                                                    event.target.onerror = null;
                                                                    event.target.src = "https://media.universalparksusa.com/wp-content/uploads/2024/02/Universal-Studios-Hollywood-globe-entrance-scaled.jpg";
                                                        }}/>
                                                    
                                                    <div className="w-full flex flex-col justify-between items-start gap-2 px-4 pb-4">
                                                        <div className="flex flex-row justify-between items-center gap-1">
                                                            <BiStar className="size-4 text-yellow-500" />
                                                            <h4>{act.rating}</h4>
                                                            <h4 className="text-md font-light text-black">Stars</h4>
                                                        </div>

                                                        <h3 className="font-normal text-3xl">{act.title}</h3>

                                                        <div className="flex flex-row justify-between items-end w-full">
                                                            <div className="flex flex-col justify-between items-start">
                                                                <div className="text-md font-light text-black">{act.city}</div>
                                                                <div className="text-md xl:text-sm font-light text-gray">{act.province}</div>
                                                            </div>
                                                            {/* Perbaiki agar Reviews tidak overflow */}
                                                            <div className="flex flex-row justify-end items-center gap-1 min-w-[90px]">
                                                                <BiCommentDots className="size-4 text-gray" />
                                                                <div className="text-md font-light text-black">{act.total_reviews}</div>
                                                                <h4 className="text-md font-light text-black">Reviews</h4>
                                                            </div>
                                                        </div>

                                                        <div className="border-b-[0.03rem] border-black/10 w-full"></div>

                                                        <div className="flex flex-col justify-between items-start">
                                                            <div className="flex flex-row justify-between items-center gap-1">
                                                                <h4 className="text-md font-light text-gray">Price</h4>
                                                                <h4 className="text-md font-medium text-black">{act.price}</h4>
                                                            </div>

                                                            <p className="text-md font-light text-gray overflow-hidden text-ellipsis line-clamp-3">{act.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </div>
                                <div className="flex justify-center pt-20 pb-10">
                                    <Pagination
                                        count={Math.ceil(activities.length / rowsPerPage)}
                                        page={page}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                    />
                                </div>
                            </>
                        )} 
                    </div>

                    <div className="min-h-full border-[0.03rem] border-black/7 self-stretch ml-9"></div>

                    {/* Section pencarian/filter di kanan */}
                    <div className="w-full xl:w-1/4 xl:pl-10 mt-10 xl:mt-0">
                        <div className="bg-white p-6 rounded shadow flex flex-col gap-6 mb-10 border border-gray-100">
                            <h3 className="text-xl text-black font-normal mb-2">Filter Activities</h3>
                            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Search Title</label>
                                    <input
                                        type="text"
                                        placeholder={error ? "THIS FIELD IS REQUIRED!" : "Where do you want to go?"}
                                        className={`w-full border p-2 rounded-md outline-none ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}
                                        value={searchTitle}
                                        onChange={e => {
                                            setSearchTitle(e.target.value);
                                            if (error) setError(false);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Category</label>
                                    <select
                                        value={searchCategory}
                                        onChange={e => {
                                            setSearchCategory(e.target.value);
                                            if (error) setError(false);
                                        }}
                                        className={`w-full border p-2 rounded-md outline-none text-black/60 ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}>
                                        <option value="">{error ? "THIS FIELD IS REQUIRED!" : "Choose category"}</option>
                                        {categories.map(cat => (
                                            <option value={cat.id} key={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2 w-full justify-center">
                                    <Button type="submit" variant="outlined" sx={{color: "#FF948D", fontWeight: 600, textTransform: "none", fontSize: "15px", borderWidth: "2px", borderColor: "#FF948D", borderRadius: "50px", px: 4, py: 1.5}}>
                                        Search
                                    </Button>
                                    <Button type="button" variant="text" onClick={handleReset} sx={{color: "#777", textTransform: "none", fontSize: "15px", px: 2, py: 1.5}}>
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchedActivities;