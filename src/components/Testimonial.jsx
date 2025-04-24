import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/pagination';

import SarahJohnson from "../assets/images/sarahjohnson.jpg";

const Testimonial = () => {
    return(
        <div className="bg-gray/5 py-20 w-full px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 -mt-20 border-b-[0.03rem] border-black/10">
            <div className="flex flex-col justify-between items-start gap-8">
                <div className="flex flex-col justify-between items-start gap-4">
                    <h2 className="font-medium leading-normal text-4xl text-black max-w-xs xl:w-full">People Talking About Us</h2>
                    <div className="border-1 border-gray w-[2rem]"></div>
                    <p className="text-lg font-light text-gray xl:max-w-2xl">
                        Discover what our delighted travelers are saying about their transformative journeys and
                        exceptional experiences with our travel service.
                    </p>
                </div>

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

                        <SwiperSlide>
                            <div className="pb-35">
                                <div className="relative bg-white border-[0.03rem] border-black/15 px-8 pt-8 pb-16 flex flex-col justify-center items-center gap-8">
                                    <div className="flex flex-col justify-center items-center">
                                        <h5 className="text-8xl italic text-primary h-fit">"</h5>
                                        <p className="text-lg font-light text-center text-black italic -mt-9">
                                            My trip to Bali was absolutely perfect! The team organized everything
                                            down to the smallest detail, allowing me to focus on creating memories
                                            that will last a lifetime. The local experiences they arranged were
                                            authentic and off the beaten path. Couldn't recommend them more highly!
                                        </p>
                                    </div>

                                    <div className="absolute flex flex-col justify-center items-center gap-4 bottom-0 -mb-18">
                                        <img src={SarahJohnson} alt="sarahjohnson-image" className="size-14 object-cover rounded-full"/>
                                        <h5 className="text-lg font-normal text-center text-black">Sarah Johnson</h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="pb-35">
                                <div className="relative bg-white border-[0.03rem] border-black/15 px-8 pt-8 pb-16 flex flex-col justify-center items-center gap-8">
                                    <div className="flex flex-col justify-center items-center">
                                        <h5 className="text-8xl italic text-primary h-fit">"</h5>
                                        <p className="text-lg font-light text-center text-black italic -mt-9">
                                            My trip to Bali was absolutely perfect! The team organized everything
                                            down to the smallest detail, allowing me to focus on creating memories
                                            that will last a lifetime. The local experiences they arranged were
                                            authentic and off the beaten path. Couldn't recommend them more highly!
                                        </p>
                                    </div>

                                    <div className="absolute flex flex-col justify-center items-center gap-4 bottom-0 -mb-18">
                                        <img src={SarahJohnson} alt="sarahjohnson-image" className="size-14 object-cover rounded-full"/>
                                        <h5 className="text-lg font-normal text-center text-black">Sarah Johnson</h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="pb-35">
                                <div className="relative bg-white border-[0.03rem] border-black/15 px-8 pt-8 pb-16 flex flex-col justify-center items-center gap-8">
                                    <div className="flex flex-col justify-center items-center">
                                        <h5 className="text-8xl italic text-primary h-fit">"</h5>
                                        <p className="text-lg font-light text-center text-black italic -mt-9">
                                            My trip to Bali was absolutely perfect! The team organized everything
                                            down to the smallest detail, allowing me to focus on creating memories
                                            that will last a lifetime. The local experiences they arranged were
                                            authentic and off the beaten path. Couldn't recommend them more highly!
                                        </p>
                                    </div>

                                    <div className="absolute flex flex-col justify-center items-center gap-4 bottom-0 -mb-18">
                                        <img src={SarahJohnson} alt="sarahjohnson-image" className="size-14 object-cover rounded-full"/>
                                        <h5 className="text-lg font-normal text-center text-black">Sarah Johnson</h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="pb-35">
                                <div className="relative bg-white border-[0.03rem] border-black/15 px-8 pt-8 pb-16 flex flex-col justify-center items-center gap-8">
                                    <div className="flex flex-col justify-center items-center">
                                        <h5 className="text-8xl italic text-primary h-fit">"</h5>
                                        <p className="text-lg font-light text-center text-black italic -mt-9">
                                            My trip to Bali was absolutely perfect! The team organized everything
                                            down to the smallest detail, allowing me to focus on creating memories
                                            that will last a lifetime. The local experiences they arranged were
                                            authentic and off the beaten path. Couldn't recommend them more highly!
                                        </p>
                                    </div>

                                    <div className="absolute flex flex-col justify-center items-center gap-4 bottom-0 -mb-18">
                                        <img src={SarahJohnson} alt="sarahjohnson-image" className="size-14 object-cover rounded-full"/>
                                        <h5 className="text-lg font-normal text-center text-black">Sarah Johnson</h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="pb-35">
                                <div className="relative bg-white border-[0.03rem] border-black/15 px-8 pt-8 pb-16 flex flex-col justify-center items-center gap-8">
                                    <div className="flex flex-col justify-center items-center">
                                        <h5 className="text-8xl italic text-primary h-fit">"</h5>
                                        <p className="text-lg font-light text-center text-black italic -mt-9">
                                            My trip to Bali was absolutely perfect! The team organized everything
                                            down to the smallest detail, allowing me to focus on creating memories
                                            that will last a lifetime. The local experiences they arranged were
                                            authentic and off the beaten path. Couldn't recommend them more highly!
                                        </p>
                                    </div>

                                    <div className="absolute flex flex-col justify-center items-center gap-4 bottom-0 -mb-18">
                                        <img src={SarahJohnson} alt="sarahjohnson-image" className="size-14 object-cover rounded-full"/>
                                        <h5 className="text-lg font-normal text-center text-black">Sarah Johnson</h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

        </div>
    )
}

export default Testimonial;