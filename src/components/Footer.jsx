import {useNavigate} from "react-router-dom";

import Logo from "../assets/images/travelease-logo.png";
import Button from "@mui/material/Button";

const Footer = () => {

    const navigate = useNavigate();
    const toHome = () => {navigate("/")};
    const toActivities = () => {navigate("/activities")};
    const toPromotions = () => {navigate("/promotions")};

    return(
        <div className="px-6 py-10 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 py-2 w-full bg-white flex flex-col xl:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col justify-center items-start gap-2">
                <img src={Logo} alt="travelease-logo"/>
                <p className="text-lg font-light text-black">A comprehensive travel and activity booking platform that simplifies
                    your journey from planning to experience.
                </p>
            </div>

            <div className="flex flex-col xl:flex-row justify-between items-start gap-2 w-full">
                <Button onClick={toHome} variant="text" sx={{color:"black", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Home</Button>
                <Button onClick={toActivities} variant="text" sx={{color:"black", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Activities</Button>
                <Button onClick={toPromotions} variant="text" sx={{color:"black", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Promotions</Button>
            </div>
        </div>
    )
}

export default Footer;