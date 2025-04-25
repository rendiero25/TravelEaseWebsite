import {useNavigate} from "react-router-dom";

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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

            <div className="flex flex-row justify-start items-center gap-12">
                {/* DROPPDOWN MENU FOR USER */}
                <div className="" id="dropdown-menu-user">
                    <Button id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}
                            style={{color: "white", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
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
                            style={{color: "white", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
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

export default MobileMenu;