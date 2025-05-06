// import React, { useEffect, useState} from "react";
// import axios from "axios";

import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import PromoDisc from "../components/PromoDisc.jsx";
import Banner from "../components/Banner.jsx";
import TopCategories from "../components/TopCategories.jsx";
import TopActivities from "../components/TopActivities.jsx";
import BannerForRegister from "../components/BannerForRegister.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Testimonial from "../components/Testimonial.jsx";
import Footer from "../components/Footer.jsx";

const Index = ({ categoriesFromApp }) => {

    // const [categories, setCategories] = useState([]);
    //
    // useEffect(() => {
    //     axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
    //         {
    //             headers: {
    //                 apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c"
    //         }
    //     })
    //         .then(res => setCategories(res.data.data))
    //         .catch(err => {
    //             console.error("Error fetching categories: ", err);
    //             setCategories([]);
    //         });
    // }, []);


    return(

        <div className="p-0 m-0 box-border font-primary">
            <div className="min-h-screen flex">
                <Hero categoriesFromIndex={categoriesFromApp}/>
            </div>

            <div className="flex flex-col gap-50 4xl:gap-56">
                <PromoDisc />
                <Banner />
                <div className="flex flex-col gap-25 -mt-32 sm:-mt-42 xl:-mt-28 4xl:-mt-46 5xl:-mt-48">
                    <TopCategories />
                    <TopActivities />
                    <BannerForRegister />
                    <HowItWorks />
                    <Testimonial />
                </div>
            </div>
        </div>
    )
}

export default Index;