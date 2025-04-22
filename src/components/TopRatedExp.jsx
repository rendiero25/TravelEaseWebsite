import { useState, useEffect } from "react";
import axios from "axios";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { Pagination } from 'swiper/modules';

import TopRatedExpBg from "../assets/images/TopRatedExp-bg.jpg";
import {SwiperSlide} from "swiper/react";

const TopRatedExp = () => {

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
        <div style={{backgroundImage: `url(${TopRatedExpBg})`, backgroundSize: "cover"}}>
            <div className="bg-black/65 flex flex-col justify-between items-start gap-4 px-6 py-30">
                <h2 className="font-bold text-6xl text-white">Top-rated Experiences</h2>
                <div className="border-1 border-gray w-[2rem]"></div>
                <p className="text-xl font-light text-gray">Sed egestas, ante el vulpulate volutpat, eros pede semper est</p>
            </div>

            <div>
                <Swiper
                    modules={[Pagination]}
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
                            <div className="bg-blue-500 shadow-md overflow-hidden">
                                <img src={activitydata.imageUrl} alt="image"/>
                                <h3 className="text-black font-bold">{activitydata.title}</h3>
                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </div>
    )
}

export default TopRatedExp;
