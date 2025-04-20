import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';

import MobileMenu from "../components/MobileMenu.jsx";

import Logo from "../assets/images/travelease-logo.png";
import { BiMenuAltRight } from "react-icons/bi";
import { BiRightArrowCircle } from "react-icons/bi";
import { BiUser } from "react-icons/bi";

const Header = () => {

    const navigate = useNavigate();
    const toHome = () => {navigate("/")};
    const toActivities = () => {navigate("/activities")};
    const toPromotions = () => {navigate("/promotions")};
    const toSignIn = () => {navigate("/sign-in")};
    const toRegister = () => {navigate("/register")};

    const [mobileMenu, setMobileMenu] = useState(false);
    const toggleMobileMenu = () => {setMobileMenu(true)};

    return(
        <div className="px-6 xl:px-22 3xl:px-42 4xl:px-80 py-2 w-full bg-transparent absolute top-0 border-b-[0.03rem] border-white/25 flex justify-between items-center">
            <div className="w-50vw flex flex-row justify-between items-center gap-18">
                <div className="">
                    <img src={Logo} alt="logo-travelease" className="w-1/2 sm:w-1/3 xl:w-[9rem]"/>
                </div>

                <div className="hidden xl:flex w-40vw flex-row justify-between items-center gap-8">
                    <Button onClick={toHome} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Home</Button>
                    <Button onClick={toActivities} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Activities</Button>
                    <Button onClick={toPromotions} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Promotions</Button>
                </div>
            </div>

            <div className="w-50vw xl:hidden">
                <Button onClick={toggleMobileMenu} className="flex">
                    <BiMenuAltRight className="size-8 text-white -mr-11"/>
                </Button>
            </div>

            {mobileMenu && (
                <div className="absolute top-0 right-0 z-50 w-full">
                    <MobileMenu toogleCloseMenu={() => setMobileMenu(false)}/>
                </div>
            )}

            <div className="hidden xl:flex flex-row justify-between items-center gap-4">
                <div className="flex flex-row justify-between items-center gap-2">
                    <Button onClick={toSignIn} variant="text" startIcon={<BiRightArrowCircle/>} style={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>Sign In</Button>
                    <Button onClick={toRegister} variant="text" startIcon={<BiUser/>} style={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>Register</Button>
                </div>
                <div></div>
            </div>
        </div>
    )
}

export default Header;