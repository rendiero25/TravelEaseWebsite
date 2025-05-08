import React, { useEffect, useState} from "react";
import axios from "axios";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from './contexts/CartContext';

import Index from "./pages/Index.jsx";
import Activities from "./pages/Activities.jsx";
import SearchedActivities from "./pages/SearchedActivities.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProfileUser from "./pages/ProfileUser.jsx";
import ProfileAdmin from "./pages/ProfileAdmin.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import PurchaseList from "./pages/PurchaseList.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Contact from "./pages/Contact.jsx";
import ActivityDetails from "./pages/ActivityDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Checkout from "./pages/Checkout.jsx";
import Promotions from "./pages/Promotions.jsx";
import TransactionDetails from "./pages/TransactionDetails.jsx";

const App = () => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
            {
                headers: {
                    apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c"
                }
            })
            .then(res => setCategories(res.data.data))
            .catch(err => {
                console.error("Error fetching categories: ", err);
                setCategories([]);
            });
    }, []);

    return(
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Index categoriesFromApp={categories} />} />
                        <Route path="/activities" element={<Activities />} />
                        <Route path="/activity/:id" element={<ActivityDetails />} />
                        <Route path="/search-results" element={<SearchedActivities categoriesFromApp={categories} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile-user" element={<ProfileUser />} />
                        <Route path="/profile-admin" element={<ProfileAdmin />} />
                        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                        <Route path="/purchase-list" element={<PurchaseList />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/promotions" element={<Promotions />} />
                        <Route path="/transactions-details/:id" element={<TransactionDetails />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    )
}

export default App;