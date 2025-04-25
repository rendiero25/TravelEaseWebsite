import {BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Index from "./pages/Index.jsx";
import Activities from "./pages/Activities.jsx";
import SearchedActivities from "./pages/SearchedActivities.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProfileUser from "./pages/ProfileUser.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import PurchaseList from "./pages/PurchaseList.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

const App = () => {



    return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/search-results" element={<SearchedActivities />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile-user" element={<ProfileUser />} />
                    <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                    <Route path="/purchase-list" element={<PurchaseList />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;