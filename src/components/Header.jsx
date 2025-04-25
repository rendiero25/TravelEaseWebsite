import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MobileMenu from "../components/MobileMenu.jsx";

import Logo from "../assets/images/travelease-logo.png";
import RedLogo from "../assets/images/travelease-redlogo.png";
import { BiMenuAltRight } from "react-icons/bi";
import { BiRightArrowCircle } from "react-icons/bi";
// import { BiUser } from "react-icons/bi";
// import { BiSolidDashboard } from "react-icons/bi";
import { BiHappy } from "react-icons/bi";

const Header = () => {

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const navigate = useNavigate();
    const toHome = () => {navigate("/")};
    const toActivities = () => {navigate("/activities")};
    const toPromotions = () => {navigate("/promotions")};
    const toLogin = () => {navigate("/login")};
    const toRegister = () => {navigate("/register")};

    const [mobileMenu, setMobileMenu] = useState(false);
    const toggleMobileMenu = () => {setMobileMenu(true)};

    //DROPDOWN MENU FOR USER
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //DROPDOWN MENU FOR ADMIN
    const [anchorElAdmin, setAnchorElAdmin] = React.useState(null);
    const openAdmin = Boolean(anchorElAdmin);
    const handleClickAdmin = (event) => {
        setAnchorElAdmin(event.currentTarget);
    };
    const handleCloseAdmin = () => {
        setAnchorElAdmin(null);
    };

    return(
        <div className={`px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 py-2 w-full ${isHomePage ? "bg-transparent" : "bg-white"} ${isHomePage ? "absolute" : "relative"} top-0 border-b-[0.03rem] border-white/25 flex justify-between items-center ${isHomePage ? "shadow-none" : "shadow-2xl/10"}`}>
            <div className="w-50vw flex flex-row justify-between items-center gap-18">
                <div className="">
                    <img src={isHomePage ? Logo : RedLogo} alt="logo-travelease" className="w-1/2 sm:w-1/3 xl:w-[9rem]"/>
                </div>

                <div className="hidden xl:flex w-40vw flex-row justify-between items-center gap-8">
                    <Button onClick={toHome} variant="text" sx={{color: isHomePage ? "white" : "#1E1E1E", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Home</Button>
                    <Button onClick={toActivities} variant="text" sx={{color: isHomePage ? "white" : "#1E1E1E", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Activities</Button>
                    <Button onClick={toPromotions} variant="text" sx={{color: isHomePage ? "white" : "#1E1E1E", textTransform:"none", fontWeight:"400", fontSize:"14px"}}>Promotions</Button>
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
                    <Button onClick={toLogin} variant="text" startIcon={<BiRightArrowCircle/>} style={{color: isHomePage ? "white" : "#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>Sign In</Button>
                    <Button onClick={toRegister} variant="text" startIcon={<BiHappy/>} style={{color: isHomePage ? "white" : "#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>Register</Button>
                </div>


                {/* DROPPDOWN MENU FOR USER */}
                <div className="" id="dropdown-menu-user">
                    <Button id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}
                        style={{color: isHomePage ? "white" : "#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                            nama-User
                    </Button>
                    <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}}
                        style={{color:"#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Purchase List</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </div>

                {/* DROPPDOWN MENU FOR ADMIN */}
                <div className="" id="dropdown-menu-admin">
                    <Button id="basic-button" aria-controls={openAdmin ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClickAdmin}
                            style={{color: isHomePage ? "white" : "#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                        nama-admin
                    </Button>

                    <Menu id="basic-menu" anchorEl={anchorElAdmin} open={openAdmin} onClose={handleCloseAdmin} MenuListProps={{'aria-labelledby': 'basic-button',}}
                          style={{color:"#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default Header;