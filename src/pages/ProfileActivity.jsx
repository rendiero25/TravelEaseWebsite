import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import {BiCommentDots, BiMap} from "react-icons/bi";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { BiShareAlt } from "react-icons/bi";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {BiStar} from "react-icons/bi";

const ProfileActivity = () => {

    const [activitydetails, setActivityDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'}
                };

                const response = await axios.get("https://travel-ease-api.herokuapp.com/api/v1/activity", config);
                setActivityDetails(response.data.data);
                setLoading(false);

            } catch (error) {
                console.log("Failed to fetch data from API", error);

                if (error.response && error.response.status === 401) {
                    setError('Authentication failed. Please check your API credentials.');
                } else {
                    setError('Failed to fetch activities');
                }

                setLoading(false);
            }
        };

        fetchActivityDetails();
    }, [])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="m-0 p-0 box-border font-primary">
            <Header />

            <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                {activitydetails.map((activitydetails) => (
                    <div key={activitydetails.id}>
                        <div>
                            <div className="flex flex-col justify-between center gap-4 w-full">
                                <div className="flex flex-col justify-between items-start gap-2">
                                    <h3>{activitydetails.title}</h3>
                                    <div className="flex flex-row justify-between items-center gap-1">
                                        <BiStar className="size-4 text-yellow-500" />
                                        <div>
                                            <h4>{act.rating}</h4>
                                            <h4 className="text-md font-light text-black">Stars</h4>
                                        </div>
                                        <div className="flex flex-row justify-between items-center gap-1">
                                            <BiCommentDots className="size-4 text-gray" />
                                            <div className="text-md font-light text-black">{activitiesdata.total_reviews}</div>
                                            <h4 className="text-md font-light text-black">Reviews</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col xl:flex-row justify-between items-center gap-2">
                                    <div>
                                        <div className="flex flex-row justify-between items-start">
                                            <BiMap className="size-4 text-gray" />
                                            <div className="text-md font-light text-black">{activitydetails.address}</div>
                                        </div>
                                        <div className="flex flex-row justify-between items-center gap-2">
                                            <div className="text-md xl:text-sm font-light text-gray">{`${activitydetails.city}` + "," + " "}</div>
                                            <div className="text-md xl:text-sm font-light text-gray">{activitydetails.province}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => setLiked(!liked)}>
                                            <div>{liked ? <FcLike /> : <FcLikePlaceholder />}</div>
                                        </button>
                                        <BiShareAlt />
                                    </div>
                                </div>
                            </div>

                            <div className="border-b-[0.03rem] border-black/25 w-full"></div>

                            <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
                                <div>
                                    <h4>Overview</h4>
                                    <div>
                                        <div className="w-full">{activitydetails.imageUrls}</div>
                                        <p>{activitydetails.description}</p>

                                        <div>
                                            <h4>Facilities</h4>
                                            <div></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4>Location</h4>

                                    <div>
                                        <div>{activitydetails.location_maps}</div>
                                    </div>
                                    <div>

                                    </div>
                                </div>

                                <div>
                                    <Button variant="contained">Add to Cart</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))};
            </div>

            <Footer />
        </div>
    )
}

export default ProfileActivity;