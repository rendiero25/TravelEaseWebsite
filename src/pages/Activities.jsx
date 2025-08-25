import React, { useEffect, useState } from "react";
import axios from "axios";
import {BiCommentDots, BiSearchAlt, BiStar} from "react-icons/bi";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import OnErrorImage from '../assets/images/onerrorimage.jpg';

import Header from "../components/Header";
import Footer from "../components/Footer";

const Activities = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const goToActivityDetails = (activityId) => {
        navigate(`/activity/${activityId}`);
    };
    const [allActivities, setAllActivities] = useState([]); // simpan semua data awal
    const [activities, setActivities] = useState([]); // data yg ditampilkan
    const [categories, setCategories] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    // Fetch all categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const configCat = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };
                const res = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", configCat);
                setCategories(res.data.data || []);
            } catch {
                setCategories([]);
            }
        }
        fetchCategories();
    }, []);

    // Fetch all activities saat pertama kali mount
    useEffect(() => {
        fetchAllActivities();
    }, []);

    // Mendapatkan seluruh activities dari API
    const fetchAllActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
                {
                    headers: { 'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c' }
                }
            );
            setAllActivities(res.data.data || []);
            setActivities(res.data.data || []);
        } catch {
            setError("Failed to load activities");
            setAllActivities([]);
            setActivities([]);
        }
        setLoading(false);
    };

    // Ambil categoryId dari query string jika ada
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryIdFromQuery = params.get("categoryId");
        if (categoryIdFromQuery && allActivities.length > 0) {
            setSearchCategory(categoryIdFromQuery);
            // Filter activities sesuai categoryId dari query
            setActivities(allActivities.filter(act => act.category && act.category.id === categoryIdFromQuery));
        }
        // eslint-disable-next-line
    }, [location.search, allActivities]);

    // Handle search form submit (local filtering)
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTitle && !searchCategory) {
            setError(true);
            return;
        }
        setError(false);
        let filtered = allActivities;
        if (searchTitle) {
            filtered = filtered.filter(act => act.title.toLowerCase().includes(searchTitle.toLowerCase()));
        }
        if (searchCategory) {
            filtered = filtered.filter(act => act.category && act.category.id === searchCategory);
        }
        setActivities(filtered);
    };

    // Reset behavior, jika user klik Reset
    const handleReset = () => {
        setSearchTitle("");
        setSearchCategory("");
        setError(false);
        setActivities(allActivities);
    };

    // Pagination logic
    const paginatedActivities = activities.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                <div className="w-full py-20 flex flex-col-reverse xl:flex-row justify-between items-center xl:items-start">
                    <div className="w-75vw">
                        {loading && (
                            <div className="text-center py-16">
                                <Skeleton variant="rectangular" width="100%" height={220} sx={{ mb: 2, borderRadius: 2 }} />
                                <Skeleton variant="text" width="60%" sx={{ mx: "auto", mb: 1 }} />
                                <Skeleton variant="text" width="40%" sx={{ mx: "auto", mb: 1 }} />
                                <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2, borderRadius: 2 }} />
                                <Skeleton variant="rectangular" width="100%" height={220} sx={{ mb: 2, borderRadius: 2 }} />
                            </div>
                        )}
                        {error && !loading && (<div className="text-center py-4 text-red-600">{error}</div>)}

                        {!loading && !error && (
                            <div className="w-full max-w-4xl">
                                {activities.length === 0 ? (
                                    <div className="text-center py-16">No activities found.</div>
                                ) : (
                                    <>
                                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-4">
                                            {paginatedActivities.map(act => (
                                                <li 
                                                    key={act.id} 
                                                    className="group bg-white rounded-lg flex flex-col justify-between gap-4 cursor-pointer border-[0.03rem] border-black/10"
                                                    onClick={() => goToActivityDetails(act.id)}>

                                                    <div className="flex flex-wrap justify-center items-start h-full hover:shadow-2xl/15">
                                                        <div className="flex flex-col justify-between items-start gap-2 w-full h-full">
                                                            <img
                                                                src={act.imageUrls?.[0]}
                                                                alt={act.title}
                                                                className="w-full h-75 xl:h-48 object-cover mb-3 rounded-t-lg"
                                                                onError={event => {
                                                                    event.target.onerror = null;
                                                                    event.target.src = OnErrorImage;
                                                                }}
                                                            />
                                                            <div className="w-full flex flex-col justify-between items-start gap-2 px-4">
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
                                                                    <div className="flex flex-row justify-between items-center gap-1">
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

                                                            <div className="text-gray text-sm font-light mt-2 italic px-4 pb-4">{act.category?.name}</div>
                                                        </div>

                                                        
                                                    </div>

                                                    
                                                </li>
                                            ))}
                                        </ul>
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
                        )}
                    </div>

                    <div className="min-h-full border-[0.03rem] border-black/7 self-stretch ml-6"></div>

                    <div className="w-20vw sticky top-23">
                        <h3 className="pl-6 text-xl text-black font-normal">Filter Activites</h3>

                        <form onSubmit={handleSearch} className="w-full bg-white p-6 rounded flex flex-col gap-6 mb-10">
                            <div className="flex-1">
                                <label className="block text-gray-700 mb-2">Search Title</label>
                                <input type="text" placeholder={error ? "THIS FIELD IS REQUIRED!" : "Where do you want to go?"}
                                    className={`w-full border p-2 rounded-md outline-none ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}
                                    value={searchTitle}
                                    onChange={e => {
                                        setSearchTitle(e.target.value);
                                        if (error) setError(null);
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-700 mb-2">Category</label>
                                <select
                                    value={searchCategory}
                                    onChange={e => {
                                        setSearchCategory(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    className={`w-full border p-2 rounded-md outline-none text-black/60 ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}>
                                    <option value="">{error ? "THIS FIELD IS REQUIRED!" : "Choose category"}</option>
                                        {categories.map(cat => (
                                            <option value={cat.id} key={cat.id}>{cat.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="flex gap-2 w-full justify-center">
                                <Button type="submit" variant="outlined" startIcon={<BiSearchAlt />}
                                    sx={{color: "#FF948D", fontWeight: 600, textTransform: "none", fontSize: "15px", borderWidth: "2px", borderColor: "#FF948D", borderRadius: "50px", px: 4, py: 1.5,}}>
                                        Search
                                </Button>

                                <Button type="button" variant="text" onClick={handleReset} sx={{color: "#777", textTransform: "none", fontSize: "15px", px: 2, py: 1.5,}}>
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Activities;