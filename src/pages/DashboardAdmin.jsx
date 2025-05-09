import React, { useState, useEffect } from "react";
import { Tabs, Tab, Typography } from "@mui/material";
import BannerManagement from "../components/BannerManagement";
import CategoryManagement from "../components/CategoryManagement";
import PromoManagement from "../components/PromoManagement";
import PaymentMethodManagement from "../components/PaymentMethodManagement";
import ActivityManagement from "../components/ActivityManagement";
import UserManagement from "../components/UserManagement";
import TransactionManagement from "../components/TransactionManagement";
import { useAuth } from "../contexts/AuthContext";

const DashboardAdmin = () => {
  const [tab, setTab] = useState(0);
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth?.isLoggedIn || auth?.user?.role !== "admin") {
      window.location.href = "/";
    }
  }, [auth]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className="m-0 p-0 box-border font-primary">
      <div className="px-6 py-20 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 flex flex-col gap-10">
        <Typography variant="h4" className="font-bold text-2xl text-primary">
          Admin Dashboard
        </Typography>

        <div className="flex flex-row flex-wrap gap-2">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { background: "#F8616C" } }}
            textColor="inherit"
          >
            <Tab label="Banner" />
            <Tab label="Category" />
            <Tab label="Promo" />
            <Tab label="Payment Method" />
            <Tab label="Activity" />
            <Tab label="User" />
            <Tab label="User Transaction" />
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col w-full">
          {tab === 0 && <BannerManagement />}
          {tab === 1 && <CategoryManagement />}
          {tab === 2 && <PromoManagement />}
          {tab === 3 && <PaymentMethodManagement />}
          {tab === 4 && <ActivityManagement />}
          {tab === 5 && <UserManagement />}
          {tab === 6 && <TransactionManagement />}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;