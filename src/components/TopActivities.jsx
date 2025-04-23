import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/pagination';

import { BiCommentDots } from "react-icons/bi";
import { BiStar } from "react-icons/bi";

const TopActivities = () => {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataActivities = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };

                const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", config);
                const dataFromApi = response.data.data.slice(0, 10);

                setActivities(dataFromApi);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch banners data from API", err);

                if (err.response && err.response.status === 401) {
                    setError('Authentication failed. Please check your API credentials.');
                } else {
                    setError('Failed to fetch banners');
                }

                setLoading(false);
            }
        };

        fetchDataActivities();
    }, [])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 h-[42rem] sm:h-[41rem] xl:h-[40rem] 4xl:h-[47rem]">
            <div className="flex flex-col justify-between items-start gap-4 4xl:px-38">
                <h2 className="font-medium leading-normal text-4xl text-black">Top Trending Events</h2>
                <div className="border-1 border-gray w-[2rem]"></div>
                <p className="text-lg font-light text-gray">Discover unforgettable adventures with our exclusive offers!</p>
            </div>

            <div className="w-full">
                <div className="w-full">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        loop={true}
                        autoplay={{delay: 5000}}
                        spaceBetween={25}
                        slidesPerView={1}
                        centeredSlides={true}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            1280: {
                                slidesPerView: 5,
                                spaceBetween: 35
                            },
                        }}>

                        {activities.map((activitiesdata) => (
                            <SwiperSlide key={activitiesdata.id}>
                                <div className="mt-10 px-6 pb-15 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex flex-col xl:flex-row justify-center items-start">
                                    <div className="flex flex-col justify-between items-start gap-2">
                                        <img src={activitiesdata.imageUrls[0]} alt="activities-image" className="w-full h-full object-cover"/>
                                        <div className="w-full flex flex-col justify-between items-start gap-2">
                                            <div className="flex flex-row justify-between items-center gap-1">
                                                <BiStar className="size-4 text-yellow-500" />
                                                <h4>{activitiesdata.rating}</h4>
                                                <h4 className="text-md font-light text-black">Stars</h4>
                                            </div>

                                            <h3 className="font-normal text-3xl">{activitiesdata.title}</h3>

                                            <div className="flex flex-row justify-between items-end w-full">
                                                <div className="flex flex-col justify-between items-start">
                                                    <div className="text-md font-light text-black">{activitiesdata.city}</div>
                                                    <div className="text-md font-light text-gray">{activitiesdata.province}</div>
                                                </div>
                                                <div className="flex flex-row justify-between items-center gap-1">
                                                    <BiCommentDots className="size-4 text-gray" />
                                                    <div className="text-md font-light text-black">{activitiesdata.total_reviews}</div>
                                                    <h4 className="text-md font-light text-black">Reviews</h4>
                                                </div>
                                            </div>

                                            <div className="border-b-[0.03rem] border-black/10 w-full"></div>

                                            <div className="flex flex-col justify-between items-start">
                                                <div className="flex flex-row justify-between items-center gap-1">
                                                    <h4 className="text-md font-light text-gray">Price</h4>
                                                    <h4 className="text-md font-medium text-black">{activitiesdata.price}</h4>
                                                </div>

                                                <p className="text-md font-light text-gray overflow-hidden text-ellipsis line-clamp-3">{activitiesdata.description}</p>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default TopActivities;