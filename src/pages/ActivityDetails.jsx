import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";

import Button from "@mui/material/Button";
import { BiCommentDots, BiMap, BiStar } from "react-icons/bi";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { BiShareAlt } from "react-icons/bi";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import PromoDisc from "../components/PromoDisc.jsx";

import { MdOutlineFastfood } from "react-icons/md";
import { LuCircleParking } from "react-icons/lu";
import { IoIosWifi } from "react-icons/io";
import { GrRestroom } from "react-icons/gr";
import { RiCustomerService2Line } from "react-icons/ri";
import { BiPhone } from "react-icons/bi";
import { BiLink } from "react-icons/bi";
import { BiTime } from "react-icons/bi";

const ActivityDetails = () => {

    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);

    const navigate = useNavigate();
    const { auth } = useAuth();
    const [addingToCart, setAddingToCart] = useState(false);

    const { addToCart } = useCart();
    const [addSuccess, setAddSuccess] = useState(false);

    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                setLoading(true);
                
                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };

                const response = await axios.get(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`, 
                    config
                );
                
                setActivity(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch activity details", err);
                setError('Failed to load activity details');
                setLoading(false);
            }
        };

        if (id) {
            fetchActivityDetails();
        }
    }, [id]);

    const handleAddToCart = async () => {
        // Check if user is logged in
        if (!auth.isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            setAddingToCart(true);

            // Gunakan API add-cart langsung, bukan melalui CartContext
            const config = {
                headers: {
                    'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                    'Authorization': `Bearer ${auth.token}`
                }
            };

            const data = {
                activityId: id
            };

            // Panggil API add-cart
            const response = await axios.post(
                'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart',
                data,
                config
            );

            if (response.data && response.data.status === 'OK') {
                // Show success notification
                setAddSuccess(true);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setAddSuccess(false);
                }, 3000);

                // Jika masih menggunakan context untuk cart count, perbarui cartCount
                // Ini opsional, tergantung implementasi CartContext Anda
                if (addToCart && typeof addToCart === 'function') {
                    addToCart(id, false); // parameter kedua false agar tidak memanggil API lagi
                }
            } else {
                throw new Error(response.data?.message || 'Failed to add to cart');
            }
        } catch (err) {
            console.error("Failed to add activity to cart", err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to add activity to cart';
            alert(errorMsg);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl text-red-500">Error: {error}</div>
            </div>
            <Footer />
        </div>
    );

    if (!activity) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl">Activity not found</div>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="px-6 py-10 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                <div className="w-full flex-col justify-between items-start gap-4">
                    <div className="pb-5 xl:pb-7 flex flex-col justify-between center gap-2 w-full">
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-2">
                            <h3 className="text-black font-bold text-4xl">{activity.title}</h3>
                            <div className="flex flex-row justify-between items-center gap-4">
                                <div className="flex flex-row justify-center items-center gap-1">
                                    <BiStar className="size-4 text-yellow-500" />
                                    <h4 className="text-md font-light">{activity.rating}</h4>
                                    <h4 className="text-md font-light text-black">Stars</h4>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-1">
                                    <BiCommentDots className="size-4 text-gray" />
                                    <div className="text-md font-light text-black">{activity.total_reviews}</div>
                                    <h4 className="text-md font-light text-black">Reviews</h4>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
                            <div className="flex flex-row justify-between items-center gap-2">
                                <BiMap className="size-4 text-gray" />
                                <div className="text-md xl:text-sm font-light text-gray">{`${activity.city}` + "," + " "}</div>
                                <div className="text-md xl:text-sm font-light text-gray">{activity.province}</div>
                            </div>
                            <div className="flex flex-row justify-between items-center xl:items-start gap-4">
                                <button onClick={() => setLiked(!liked)}>
                                    <div>{liked ? <FcLike className="size-7 xl:size-5" /> : <FcLikePlaceholder className="size-7 xl:size-5" />}</div>
                                </button>
                                <BiShareAlt className="size-7 xl:size-5"/>
                            </div>
                        </div>
                    </div>

                    <div className="border-b-[0.03rem] border-black/7 w-full"></div>

                    <div className="pt-5 xl:pt-7 flex flex-col xl:flex-row justify-between gap-2">
                        <div className="w-80vw flex flex-col items-start gap-8 w-full">
                            <div className="flex flex-col justify-between items-start gap-4 w-full">
                                <div className="w-full xl:h-[20rem] flex flex-col justify-between items-start gap-4">
                                    <img
                                        src={activity.imageUrls[0]}
                                        alt="activity-image"
                                        className="w-full h-full object-cover"
                                        onError={event => {
                                            event.target.onerror = null;
                                            event.target.src = "https://media.universalparksusa.com/wp-content/uploads/2024/02/Universal-Studios-Hollywood-globe-entrance-scaled.jpg";
                                        }}/>
                                    <h4 className="font-normal text-xl text-black">Overview</h4>
                                    <p className="font-light text-md text-black">{activity.description}</p>
                                    <div className="w-full flex flex-col justify-between items-start gap-4 border-[0.03rem] border-black/15 p-4 rounded-lg">
                                        <h4 className="font-normal text-xl text-black">Facilities</h4>
                                        <div className="flex flex-row justify-center items-start gap-8">
                                            <div className="flex flex-col xl:flex-row justify-start items-start gap-4">
                                                <div className="flex flex-row justify-center items-center gap-2">
                                                    <MdOutlineFastfood className="text-primary size-6"/>
                                                    <h4 className="text-black font-normal text-md">Restaurant</h4>
                                                </div>
                                                <div className="flex flex-row justify-center items-center gap-2">
                                                    <LuCircleParking className="text-primary size-6"/>
                                                    <h4 className="text-black font-normal text-md">Parking</h4>
                                                </div>
                                                <div className="flex flex-row justify-center items-center gap-2">
                                                    <IoIosWifi className="text-primary size-6"/>
                                                    <h4 className="text-black font-normal text-md">Wifi</h4>
                                                </div>
                                            </div>
                                            <div className="flex flex-col xl:flex-row justify-center items-start gap-4">
                                                <div className="flex flex-row justify-center items-center gap-2">
                                                    <GrRestroom className="text-primary size-6"/>
                                                    <h4 className="text-black font-normal text-md">Restroom</h4>
                                                </div>
                                                <div className="flex flex-row justify-center items-center gap-2">
                                                    <RiCustomerService2Line className="text-primary size-6"/>
                                                    <h4 className="text-black font-normal text-md">12-Hour Front Desk</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden w-full xl:flex flex-col xl:flex-row justify-center xl:justify-end items-center gap-1 xl:gap-4">
                                        <div className="flex flex-col justify-center items-end">
                                            <h4 className="text-md font-light text-lg text-gray">Price</h4>
                                            <div className="flex flex-row items-center gap-2">
                                                <h4 className="text-md font-bold text-2xl text-primary mb-4 xl:mb-0">Rp</h4>
                                                <h4 className="text-md font-bold text-2xl text-primary mb-4 xl:mb-0">{activity.price}</h4>
                                            </div>

                                        </div>

                                        <Button
                                            variant="contained"
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            sx={{backgroundColor:"#F8616C", color:"white", fontWeight:"400", textTransform:"none", fontSize:"14px", borderRadius:"50px", padding:"14px 50px"}}
                                                >Add to Cart
                                        </Button>

                                        {addSuccess && (
                                            <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
                                                Item added to cart successfully!
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-full border-[0.03rem] border-black/7 self-stretch ml-6 mr-6"></div>

                        <div className="w-10vw pb-10 flex flex-col justify-between items-start gap-12">
                            <div className="flex flex-col justify-between items-start gap-4 w-full">
                                <div className="hidden xl:flex flex-col justify-between items-start gap-4">
                                    <h4 className="font-normal text-xl text-black">Location</h4>
                                    <div className="size-80 overflow-hidden">
                                        <div dangerouslySetInnerHTML={{ __html: activity.location_maps?.replace(/width="\d+"/, 'width="100%"')}} className="size-6"></div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between items-start gap-4">
                                    <h4 className="font-normal text-xl text-black">Details</h4>

                                    <div className="border-b-[0.03rem] border-black/25 w-full"></div>

                                    <div className="flex flex-col justify-between items-start gap-2 max-w-sm">
                                        <div className="flex flex-row items-center gap-3 w-full">
                                            <BiMap className="size-5 text-gray" />

                                            <div className="flex flex-col justify-between items-start w-full">
                                                <div className="text-md xl:text-sm font-normal text-gray">{activity.address}</div>

                                                <div className="flex flex-row justify-between items-start gap-1">
                                                    <div className="text-md xl:text-sm font-light text-gray italic">{`${activity.city}` + "," + " "}</div>
                                                    <div className="text-md xl:text-sm font-light text-gray italic">{activity.province}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row items-center gap-3 w-full">
                                            <BiPhone className="size-4 text-gray" />
                                            <h4 className="text-md xl:text-sm font-normal text-gray">+6221-88439641</h4>
                                        </div>

                                        <div className="flex flex-row items-center gap-3 w-full">
                                            <BiLink className="size-4 text-gray" />
                                            <a href="https://activityname.com" className="text-md xl:text-sm font-normal text-gray">https://activityname.com</a>
                                        </div>

                                        <div className="flex flex-row justify-between items-center gap-3">
                                            <BiTime className="size-4 text-gray" />

                                            <div className="flex flex-col justify-between items-start gap-1">
                                                <h4 className="text-md xl:text-sm font-normal text-gray">Closed Until Noon</h4>

                                                <div className="flex flex-col justify-between items-start gap-1 w-full">
                                                    <div className="flex flex-row justify-between items-start">
                                                        <h4 className="text-md xl:text-sm font-normal text-gray">Mon-Thu, Sun</h4>
                                                        <h4 className="text-md xl:text-sm font-normal text-gray">Noon-Midnight</h4>
                                                    </div>
                                                   <div className="flex flex-row justify-between items-start">
                                                        <h4 className="text-md xl:text-sm font-normal text-gray">Fri-Sat</h4>
                                                        <h4 className="text-md xl:text-sm font-normal text-gray">Noon-1.00 AM</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="xl:hidden w-full flex flex-col justify-center items-center gap-1">
                                <h4 className="text-md font-light text-xl text-gray">Price</h4>
                                <h4 className="text-md font-bold text-2xl text-primary mb-4">{activity.price}</h4>

                                <Button
                                    variant="contained"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    sx={{backgroundColor:"#F8616C", color:"white", fontWeight:"400", textTransform:"none", fontSize:"14px", borderRadius:"50px", padding:"14px 50px"}}
                                        >Add to Cart
                                </Button>

                                {addSuccess && (
                                    <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
                                        Item added to cart successfully!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;
