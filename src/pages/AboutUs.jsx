import React from "react";
import { FaUsers, FaSuitcaseRolling, FaExchangeAlt, FaGlobeAsia } from "react-icons/fa";
import { MdGroups, MdTravelExplore, MdTrendingUp } from "react-icons/md";

// Ganti dengan path gambar yang sesuai di assets kamu
import AboutImg from "../assets/images/aboutus-hero.jpg";
import Logo from "../assets/images/travelease-redlogo.png";
import EcosystemImg from "../assets/images/hero-bg.png";

const AboutUs = () => {
    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="relative w-full h-[15rem]">
                    <img
                        src={AboutImg}
                        alt="About Travelease"
                        className="w-full h-full object-cover rounded-none"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/35 flex items-center justify-center">
                        <h1 className="text-white font-light text-3xl md:text-4xl text-center drop-shadow-lg px-6">
                            Discover the World with Travelease
                        </h1>
                    </div>
            </div>

            <div className="px-6 py-20 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex flex-col gap-20 xl:gap-25">
                <div className="xl:w-full mx-auto flex flex-col md:flex-row items-center gap-10 w-full">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src={Logo}
                            alt="Travelease Logo"
                            className="w-4/5 max-w-[320px] block mx-auto"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <h2 className="font-bold text-3xl mb-5 text-center xl:text-left">Apa itu Travelease?</h2>
                        <p className="text-gray-600 mb-2 text-center xl:text-left xl:text-xl">
                            Travelease adalah platform pemesanan perjalanan dan aktivitas yang memudahkan pengguna untuk menemukan, merencanakan, dan memesan pengalaman terbaik di berbagai destinasi. Kami hadir untuk menyederhanakan perjalanan Anda, mulai dari inspirasi hingga pengalaman nyata di lapangan.
                        </p>
                        <p className="text-gray-500 text-sm text-center xl:text-left xl:text-lg">
                            Dengan jaringan mitra lokal dan teknologi terkini, Travelease memastikan setiap perjalanan menjadi lebih mudah, aman, dan berkesan.
                        </p>
                    </div>
                </div>

                <div className="xl:w-full mx-auto flex flex-col gap-5 ">
                    <h2 className="text-center font-bold text-3xl mb-4">Our Product</h2>
                    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4">
                        <div className="flex-1 min-w-[220px] bg-white rounded-lg border-[0.03rem] border-black/7 p-10 text-center flex flex-col items-center">
                            <MdTravelExplore size={40} color="#F8616C" />
                            <h3 className="font-bold text-xl mt-2">120+</h3>
                            <p className="text-gray-500 font-light xl:text-lg">Activities</p>
                        </div>
                        <div className="flex-1 min-w-[220px] bg-white rounded-lg border-[0.03rem] border-black/7 p-10 text-center flex flex-col items-center">
                            <FaExchangeAlt size={40} color="#F8616C" />
                            <h3 className="font-bold text-xl mt-2">8,500+</h3>
                            <p className="text-gray-500 font-light xl:text-lg">Transactions</p>
                        </div>
                        <div className="flex-1 min-w-[220px] bg-white rounded-lg border-[0.03rem] border-black/7 p-10 text-center flex flex-col items-center">
                            <FaUsers size={40} color="#F8616C" />
                            <h3 className="font-bold text-xl mt-2">3,200+</h3>
                            <p className="text-gray-500 font-light xl:text-lg">Users</p>
                        </div>
                        <div className="flex-1 min-w-[220px] bg-white rounded-lg border-[0.03rem] border-black/7 p-10 text-center flex flex-col items-center">
                            <FaGlobeAsia size={40} color="#F8616C" />
                            <h3 className="font-bold text-xl mt-2">15+</h3>
                            <p className="text-gray-500 font-light xl:text-lg">Destinations</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1100px] mx-auto flex flex-col gap-5">
                    <h2 className="text-center font-bold text-3xl mb-4">Empowering the Travel Ecosystem</h2>
                    <div className="flex flex-col md:flex-row items-center gap-8 xl:gap-12">
                        <div className="w-full md:w-1/2">
                            <img
                                src={EcosystemImg}
                                alt="Empowering Ecosystem"
                                className="w-full rounded-xl min-h-[220px] object-cover"
                            />
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <div className="flex flex-col justify-center items-center xl:items-start gap-3">
                                <MdGroups size={50} color="#F8616C" />
                                <div>
                                    <h4 className="font-bold text-lg text-center xl:text-start">Enabling Customers</h4>
                                    <p className="text-gray-500 text-sm xl:text-lg text-center xl:text-start">
                                        Memberikan kemudahan akses, transparansi harga, dan pengalaman pemesanan yang seamless bagi pelanggan.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center xl:items-start gap-3">
                                <MdTrendingUp size={50} color="#F8616C" />
                                <div>
                                    <h4 className="font-bold text-lg text-center xl:text-start">Empowering Communities</h4>
                                    <p className="text-gray-500 text-sm xl:text-lg text-center xl:text-start">
                                        Mendukung pelaku usaha lokal dan komunitas pariwisata untuk berkembang melalui kolaborasi dan teknologi.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center xl:items-start gap-3">
                                <MdTravelExplore size={50} color="#F8616C" />
                                <div>
                                    <h4 className="font-bold text-lg text-center xl:text-start">Sustainable Tourism</h4>
                                    <p className="text-gray-500 text-sm xl:text-lg text-center xl:text-start">
                                        Berkomitmen pada pariwisata berkelanjutan yang berdampak positif bagi lingkungan dan masyarakat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default AboutUs;