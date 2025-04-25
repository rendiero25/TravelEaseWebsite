import {BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Activities from "./pages/Activities.jsx";
import Categories from "./pages/Categories.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProfileUser from "./pages/ProfileUser.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import PurchaseList from "./pages/PurchaseList.jsx";

const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile-user" element={<ProfileUser />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                <Route path="/purchase-list" element={<PurchaseList />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;