import { useNavigate } from "react-router-dom";

import { BiHappy } from "react-icons/bi";
import Button from "@mui/material/Button";
import HowItWorksBg from "../assets/images/howitworks-bg2.jpg";

import BannerForRegisterBg from "../assets/images/bannerforregister-bg.jpg";

const BannerForRegister = () => {

    const navigate = useNavigate();
    const toRegister = () => {navigate("/register")};

    return (
        <div style={{backgroundImage: `url(${BannerForRegisterBg})`, backgroundSize:"contain"}} className="w-full px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
            <div className="py-20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div className="flex flex-col justify-between items-start gap-4">
                    <h2 className="font-medium leading-normal text-4xl text-white">Join Our Amazing Community</h2>
                    <div className="border-1 border-gray w-[2rem]"></div>
                    <p className="text-lg font-light text-white xl:max-w-2xl">Become part of our vibrant travel family where adventures are shared, connections are made, and unforgettable experiences await at every destination.</p>
                </div>

                <Button onClick={toRegister} variant="outlined" startIcon={<BiHappy/>} sx={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"14px", borderColor: "white", borderRadius:"50px", padding:"12px 50px"}}>Register Now</Button>
            </div>
        </div>
    )
}

export default BannerForRegister;