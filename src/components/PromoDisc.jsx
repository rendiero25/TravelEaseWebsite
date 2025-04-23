import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import TopRatedExpBg from "../assets/images/PromoDisc-bg.png";

const PromoDisc = () => {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataTopActivities = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };

                const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", config);
                // Make sure we're accessing the data array correctly from the API response
                const topFiveActivities = response.data.data || [];

                setActivities(topFiveActivities);
                setLoading(false);

            } catch (err) {
                console.error("Failed to fetch activities data from API", err);

                if (err.response && err.response.status === 401) {
                    setError('Authentication failed. Please check your API credentials.');
                } else {
                    setError('Failed to fetch experiences');
                }

                setLoading(false);
            }
        };

        fetchDataTopActivities();
    }, [])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div>
            <div style={{backgroundImage: `url(${TopRatedExpBg})`}} className="relative pt-20 sm:pt-30 px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 h-[42rem] sm:h-[41rem] xl:h-[40rem] 4xl:h-[44rem]">
                <div className="flex flex-col justify-between items-start gap-4 4xl:gap-8">
                    <h2 className="font-bold font-medium leading-normal text-4xl text-white">Explore, Make Dreams Come True</h2>
                    <div className="border-1 border-gray w-[2rem]"></div>
                    <p className="text-lg font-light text-gray">Discover unforgettable adventures with our exclusive offers!</p>
                </div>

                <div className="absolute left-0 right-0 px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                    <div className="relative w-full">
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
                                    slidesPerView: 3,
                                    spaceBetween: 35
                                },
                            }}>

                            {activities.map((activitydata) => (
                                <SwiperSlide key={activitydata.id}>
                                    <div className="py-10 pb-15 4xl:pb-20 justify-center items-center">
                                        <div className="relative flex justify-center items-center h-[27rem] 4xl:h-[30rem]">
                                            <img src={activitydata.imageUrl} alt="image" className="w-full h-full object-cover"/>
                                            <div className="absolute z-10 w-full h-full flex flex-col gap-2 px-6 py-6 justify-end bg-black/55">
                                                <h3 className="text-white font-normal text-3xl">{activitydata.title}</h3>
                                                <div className="flex flex-row justify-start items-center gap-2">
                                                    <span className="size-1 bg-white rounded-full"></span>

                                                    <div className="flex flex-row justify-between items-center gap-1">
                                                        <h3 className="text-white font-light text-sm">Price</h3>
                                                        <h3 className="text-white font-bold text-sm">{activitydata.promo_discount_price}</h3>
                                                    </div>

                                                    <span className="size-1 bg-white rounded-full"></span>

                                                    <div className="flex flex-row justify-between items-center gap-1">
                                                        <h3 className="text-white font-light text-sm">Promo Code</h3>
                                                        <h3 className="text-white font-bold text-sm">{activitydata.promo_code}</h3>
                                                    </div>
                                                </div>

                                                <p className="text-white font-light text-xs leading-normal">{activitydata.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PromoDisc;
