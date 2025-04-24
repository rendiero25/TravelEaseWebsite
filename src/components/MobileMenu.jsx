import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';

import { BiRightArrowCircle } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import { BiCollapse } from "react-icons/bi";

const MobileMenu = ({toogleCloseMenu}) => {

    const navigate = useNavigate();
    const toHome = () => {navigate("/")};
    const toActivities = () => {navigate("/activities")};
    const toPromotions = () => {navigate("/promotions")};
    const toLogin = () => {navigate("/login")};
    const toRegister = () => {navigate("/register")};

    return(
        <div className="bg-primary/97 px-6 py-6 flex flex-col justify-between items-start gap-8 shadow-2xl">
            <div className="flex flex-row w-full justify-between items-center">
                <h4 className="font-normal text-2xl text-white pl-2">travelease</h4>
                <Button className="bg-blue-500">
                    <BiCollapse onClick={toogleCloseMenu} className="size-8 text-white"/>
                </Button>
            </div>

            <div className="flex flex-col justify-between items-start">
                <Button onClick={toHome} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>Home</Button>
                <Button onClick={toActivities} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>Activities</Button>
                <Button onClick={toPromotions} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>Promotions</Button>
            </div>

            <div className="flex flex-row justify-between items-center gap-6">
                <Button onClick={toLogin} variant="text" size="large" startIcon={<BiRightArrowCircle/>} style={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"16px"}}>Sign In</Button>
                <Button onClick={toRegister} variant="text" size="large" startIcon={<BiUser/>} style={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"16px"}}>Register</Button>
            </div>
        </div>
    )
}

export default MobileMenu;