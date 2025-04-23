import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/pagination';

const Banner = () => {

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataBanners = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };

                const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners", config);
                const dataFromApi = response.data.data || [];

                setBanners(dataFromApi);
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

        fetchDataBanners();
    }, [])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 h-[42rem] sm:h-[41rem] xl:h-[40rem] 4xl:h-[47rem]">
            <div className="flex flex-col justify-between items-start gap-4">
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
                                slidesPerView: 3,
                                spaceBetween: 35
                            },
                        }}>

                        {banners.map((bannersdata) => (
                            <SwiperSlide key={bannersdata.id}>
                                <div className="py-10 pb-15 4xl:pb-20 justify-center items-center w-full">
                                    <div className="relative flex justify-center items-center h-[27rem] 4xl:h-[30rem]">
                                        <img src={bannersdata.imageUrl} alt="image" className="w-full h-full object-cover"/>
                                        <div className="absolute z-10 w-full h-full flex flex-col gap-2 px-6 py-6 justify-end bg-black/55">
                                            <h3 className="text-white font-normal text-3xl">{bannersdata.name}</h3>
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

export default Banner;