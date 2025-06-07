import React from 'react';
import Navbar from "@/components/Navbarcomponent/Navbar";
import Footer from "@/components/footer/Footer";
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import Dashboard from '@/components/dashboard/Dashboard';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-[80px] h-[calc(100vh-80px)] overflow-hidden">
        <Dashboard />
        <div className="flex-1 ml-[18%] p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <DashboardAnalytics />
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default AnalyticsPage;
