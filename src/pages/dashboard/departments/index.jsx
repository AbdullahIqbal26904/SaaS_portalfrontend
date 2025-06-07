import Navbar from "@/components/Navbarcomponent/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import DepartmentsDashboard from "@/components/dashboard/DepartmentsDashboard";
import Footer from "@/components/footer/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchUserProfile } from "@/redux/slices/authSlice";

function DepartmentsManagement() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // If not authenticated, redirect to home page
    if (!isAuthenticated) {
      router.push('/?login=true');
      return;
    }
    
    // Fetch user profile to ensure we have the latest data
    dispatch(fetchUserProfile());
  }, [isAuthenticated, dispatch, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-[80px] h-[calc(100vh-80px)] overflow-hidden">
        <Dashboard />
        <div className="flex-1 ml-[18%] p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <DepartmentsDashboard />
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}

export default DepartmentsManagement;
