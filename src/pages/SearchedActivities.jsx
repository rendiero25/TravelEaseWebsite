// SearchedActivities.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import {BiCommentDots, BiStar} from "react-icons/bi";

const SearchedActivities = ({ categoriesFromApp }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const goToActivityDetails = (activityId) => {
        navigate(`/activity/${activityId}`);
    };

    // Ambil params dari query string
    const searchParams = new URLSearchParams(location.search);
    const title = searchParams.get("title") || "";
    const categoryId = searchParams.get("categoryId") || "";

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

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="flex flex-col justify-between">
                <div className="pt-20 pb-10 flex flex-col items-center xl:items-start justify-between px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                    <div>
                        <h1 className="font-light text-black text-2xl mb-4">Search Results</h1>
                        {loading ? (<div>Loading...</div>) : activities.length === 0 ? (<div>No activities found.</div>) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                                {activities.map(act => (
                                    <div 
                                        key={act.id} 
                                        className="group cursor-pointer" 
                                        onClick={() => goToActivityDetails(act.id)}
                                    >
                                        <div className="mt-10 pb-15 flex flex-col xl:flex-row justify-center items-start ">
                                            <div className="flex flex-col justify-between items-start gap-2">
                                                <img 
                                                    src={act.imageUrls[0]} 
                                                    alt="activities-image" 
                                                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                                                    onError={event => {
                                                                event.target.onerror = null;
                                                                event.target.src = "https://media.universalparksusa.com/wp-content/uploads/2024/02/Universal-Studios-Hollywood-globe-entrance-scaled.jpg";
                                                    }}/>
                                                
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchedActivities;