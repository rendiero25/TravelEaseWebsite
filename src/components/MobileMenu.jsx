import {useNavigate, useLocation} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { BiRightArrowCircle } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import { BiCollapse } from "react-icons/bi";

const MobileMenu = ({toogleCloseMenu}) => {

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const navigate = useNavigate();
    const toHome = () => {navigate("/")};
    const toActivities = () => {navigate("/activities")};
    const toPromotions = () => {navigate("/promotions")};
    const toAboutUs = () => {navigate("/about-us")};
    const toContact = () => {navigate("/contact")};
    const toLogin = () => {navigate("/login")};
    const toRegister = () => {navigate("/register")};

    const { auth, logout } = useAuth();
    const { cartCount } = useCart();
    const UserName = auth.user?.name || "";
    const showCartBadge = typeof cartCount === "number" && cartCount > 0;

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
                    <BiCollapse onClick={toogleCloseMenu} className={`size-8 text-white ${isHomePage ? "" : "text-primary"}`}/>
                </Button>
            </div>

            <div className="flex flex-col justify-between items-start">
                <Button onClick={toHome} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>Home</Button>
                <Button onClick={toActivities} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>Activities</Button>
                <Button onClick={toPromotions} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>Promotions</Button>
                <Button onClick={toAboutUs} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>About Us</Button>
                <Button onClick={toContact} variant="text" sx={{color:"white", textTransform:"none", fontWeight:"300", fontSize:"35px"}}>Contact</Button>
            </div>

            {/* Auth & Cart Section */}
            <div className="flex flex-row justify-between items-center gap-6 w-full mt-4">
                {(!auth.isLoggedIn) && (
                    <>
                        <Button onClick={toLogin} variant="text" size="large" startIcon={<BiRightArrowCircle/>} style={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"16px"}}>Sign In</Button>
                        <Button onClick={toRegister} variant="text" size="large" startIcon={<BiUser/>} style={{color:"white", fontWeight:"400", textTransform:"none", fontSize:"16px"}}>Register</Button>
                    </>
                )}
                {auth.isLoggedIn && auth.user?.role === "user" && (
                    <div id="dropdown-menu-user">
                        <Button id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}
                            style={{color: "white", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                            <div className="flex flex-row gap-2 items-center"><BiUser />{UserName || "User"}</div>
                        </Button>
                        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}} style={{color:"#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                            <MenuItem onClick={() => {handleClose(); navigate('/profile-user')}}>Profile</MenuItem>
                            <MenuItem onClick={() => {handleClose(); navigate('/purchase-list')}}>Purchase List</MenuItem>
                            <MenuItem onClick={() => {handleClose(); logout();}}>Logout</MenuItem>
                        </Menu>
                    </div>
                )}
                {auth.isLoggedIn && auth.user?.role === "admin" && (
                    <div id="dropdown-menu-admin">
                        <Button id="basic-button-admin" aria-controls={openAdmin ? 'basic-menu-admin' : undefined} aria-haspopup="true" aria-expanded={openAdmin ? 'true' : undefined} onClick={handleClickAdmin}
                            style={{color: "white", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                            {UserName || "Admin"}
                        </Button>
                        <Menu id="basic-menu-admin" anchorEl={anchorElAdmin} open={openAdmin} onClose={handleCloseAdmin} MenuListProps={{'aria-labelledby': 'basic-button-admin',}} style={{color:"#F8616C", fontWeight:"400", textTransform:"none", fontSize:"14px"}}>
                            <MenuItem onClick={() => {handleCloseAdmin(); navigate('/profile-admin')}}>Profile</MenuItem>
                            <MenuItem onClick={() => {handleCloseAdmin(); navigate('/dashboard-admin')}}>Dashboard</MenuItem>
                            <MenuItem onClick={() => {handleCloseAdmin(); logout();}}>Logout</MenuItem>
                        </Menu>
                    </div>
                )}
                <IconButton onClick={() => navigate("/cart")} aria-label="cart">
                    <ShoppingCartIcon fontSize="small" sx={{color: "white"}}/>
                    {showCartBadge && (
                        <Badge badgeContent={cartCount} color="error" overlap="circular" />
                    )}
                </IconButton>
            </div>
        </div>
    )
}

export default MobileMenu;