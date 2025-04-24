import { useNavigate } from "react-router-dom";

import { BiHappy } from "react-icons/bi";
import Button from "@mui/material/Button";

const BannerForRegister = () => {

    const navigate = useNavigate();
    const toRegister = () => {navigate("/register")};

    return (
        <div className="bg-primary w-full px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
            <div className="py-10 flex flex-col xl:flex-row justify-between items-start gap-4">
                <div className="flex flex-col justify-between items-start gap-4">
                    <h2 className="font-medium leading-normal text-4xl text-white">Join Our Amazing Community</h2>
                    <div className="border-1 border-gray w-[2rem]"></div>
                    <p className="text-lg font-light text-white">Become part of our vibrant travel family where adventures are shared, connections are made, and unforgettable experiences await at every destination.</p>
                </div>

                <Button onClick={toRegister} variant="outlined" startIcon={<BiHappy/>} style={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"14px", borderColor: "white", borderRadius:"50px", padding:"8px 46px"}}>Register Now</Button>
            </div>
        </div>
    )
}

export default BannerForRegister;