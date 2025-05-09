import React, { useState } from "react";
import { Tabs, Tab, Typography } from "@mui/material";
import BannerManagement from "../components/BannerManagement";
import CategoryManagement from "../components/CategoryManagement";
import PromoManagement from "../components/PromoManagement";
import PaymentMethodManagement from "../components/PaymentMethodManagement";
import ActivityManagement from "../components/ActivityManagement";
import UserManagement from "../components/UserManagement";
import TransactionManagement from "../components/TransactionManagement";

const DashboardAdmin = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-8 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <Typography variant="h4" className="mb-6 font-bold text-2xl text-primary">
          Admin Dashboard
        </Typography>
        <div className="mb-6 flex flex-row flex-wrap gap-2">
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
            <Tab label="Transaction" />
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