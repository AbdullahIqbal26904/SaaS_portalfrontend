import Navbar from "@/components/Navbarcomponent/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import Footer from "@/components/footer/Footer";
import SecurityDashboard from "@/components/dashboard/Securitydashboard";
function Security() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-[80px] h-[calc(100vh-80px)] overflow-hidden">
        <Dashboard />
        <div className="flex-1 ml-[18%] p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <SecurityDashboard />
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  )
}

export default Security;