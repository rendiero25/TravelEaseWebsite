import React, { useEffect, useState } from "react";
import axios from "axios";
import {BiCommentDots, BiSearchAlt, BiStar} from "react-icons/bi";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

const Activities = () => {
    const navigate = useNavigate();
    
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

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                <div>
                    <div className="py-10 flex flex-col xl:flex-row justify-between items-center xl:items-start">
                        <div>
                            {loading && <div className="text-center py-16">Loading activities...</div>}
                            {error && !loading && (<div className="text-center py-4 text-red-600">{error}</div>)}

                            {!loading && !error && (
                                <div className="w-full max-w-4xl">
                                    {activities.length === 0 ? (
                                        <div className="text-center py-16">No activities found.</div>
                                    ) : (
                                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {activities.map(act => (
                                                <li 
                                                    key={act.id} 
                                                    className="group bg-white rounded-xl p-4 flex flex-col justify-between gap-2 cursor-pointer"
                                                    onClick={() => goToActivityDetails(act.id)}
                                                >
                                                    <div className="flex flex-col xl:flex-row justify-center items-start">
                                                        <div className="flex flex-col justify-between items-start gap-2 w-full h-full">
                                                            <img
                                                                src={act.imageUrls?.[0]}
                                                                alt={act.title}
                                                                className="w-full h-48 object-cover mb-3 transition-transform duration-300 ease-in-out group-hover:scale-110"
                                                                onError={event => {
                                                                    event.target.onerror = null;
                                                                    event.target.src = "https://media.universalparksusa.com/wp-content/uploads/2024/02/Universal-Studios-Hollywood-globe-entrance-scaled.jpg";
                                                                }}
                                                            />
                                                            <div className="w-full flex flex-col justify-between items-start gap-2">
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
                                                        </div>
                                                    </div>

                                                    <div className="text-gray text-sm font-light mt-4 italic">{act.category?.name}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="min-h-full w-2 border-[0.03rem] border-black/25"></div>

                        <div>
                            <form onSubmit={handleSearch} className="w-full bg-white shadow p-6 rounded flex flex-col gap-6 mb-10">
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
                                        className={`w-full border p-2 rounded-md outline-none ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}>
                                            <option value="">{error ? "THIS FIELD IS REQUIRED!" : "Choose category"}</option>
                                                {categories.map(cat => (
                                                    <option value={cat.id} key={cat.id}>{cat.name}</option>
                                                ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
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
        </div>
    )
}

export default Activities;