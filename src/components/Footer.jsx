import {useNavigate, useLocation } from "react-router-dom";

import Logo from "../assets/images/travelease-redlogo.png";
import Button from "@mui/material/Button";

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const navigate = useNavigate();
    const toHome = () => {navigate("/")};
    const toActivities = () => {navigate("/activities")};
    const toPromotions = () => {navigate("/promotions")};

    return(
        <div className={`px-6 pt-20 pb-5 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 w-full ${isHomePage ? "bg-white" : "bg-blacksecond"} flex flex-col gap-4 xl:gap-14 justify-between items-center`}>
            <div className="flex flex-col xl:flex-row justify-between xl:justify-center items-start xl:items-center gap-8 w-full">
                <div className="flex flex-col justify-center items-start gap-2">
                    <img src={Logo} alt="travelease-logo" className="w-50 xl:w-45"/>
                    <p className="text-md font-light text-gray">A comprehensive travel and activity booking platform that simplifies
                        your journey from planning to experience.
                    </p>
                </div>

                <div className="w-full flex justify-start xl:justify-center items-center">
                    <div className="flex flex-wrap xl:flex-nowrap xl:flex-col justify-between items-start">
                        <Button onClick={toHome} variant="text" sx={{color: isHomePage ? "black" : "white", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Home</Button>
                        <Button onClick={toActivities} variant="text" sx={{color: isHomePage ? "black" : "white", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Activities</Button>
                        <Button onClick={toPromotions} variant="text" sx={{color: isHomePage ? "black" : "white", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Promotions</Button>
                    </div>
                </div>

                <div className="flex flex-col justify-between items-start gap-2">
                    <h4 className={`text-sm ${isHomePage ? "text-black" : "text-white"} font-medium`}>Contact Info</h4>
                    <p className="text-md text-gray font-light">1000 5th Ave to Bumi Anggrek, Bekasi <br/> +62 812 9879 0058 <br/> workspace.rendy@gmail.com</p>
                </div>
            </div>

            <div className="border-[0.03rem] border-black/5 w-full"></div>

            <div className="w-full flex flex-col-reverse xl:flex-row justify-between items-start xl:items-center gap-6 xl:-mt-9">
                <p className="text-sm text-gray font-light">&copy; Copyright 2025 - All Rights Reserved</p>
                <div className="flex flex-row justify-between items-center gap-4">
                    <FaFacebookF className="size-5 text-primary"/>
                    <FaInstagram className="size-5 text-primary"/>
                    <FaXTwitter className="size-5 text-primary"/>
                    <FaLinkedinIn className="size-5 text-primary"/>
                    <FaYoutube className="size-5 text-primary"/>
                </div>
            </div>

        </div>
    )
}

export default Footer;