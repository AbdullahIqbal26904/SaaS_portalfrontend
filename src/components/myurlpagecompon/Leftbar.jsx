import { IoHomeOutline } from "react-icons/io5";
import { FaUsers, FaBuilding, FaBoxOpen, FaCreditCard, FaUserShield, FaChartLine, FaGlobe, FaPlus } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa"; // Font Awesome 5

import { IoSettingsSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

function Leftbar() {
    const { openleftbar } = useSelector(state => state.allCart);
    const { user } = useSelector(state => state.auth);
    const router = useRouter();
    const isRootAdmin = user?.is_root_admin || false;
    
    let buttons = [
        { name: "Dashboard", icon: <IoHomeOutline />, tab: "" },
        { name: "User Management", icon: <FaUsers />, tab: "users", admin: true },
        { name: "Departments", icon: <FaBuilding />, tab: "departments" },
        { name: "Service Packages", icon: <FaBoxOpen />, tab: "packages" },
        { name: "Subscriptions", icon: <FaCreditCard />, tab: "subscriptions" },
        { name: "Access Control", icon: <FaUserShield />, tab: "accessControl", admin: true },
        { name: "Analytics", icon: <FaChartLine />, tab: "analytics" },
        { name: "Transactions", icon: <FaHistory />, tab: "transactions" },
    ];

    function handleNav(button) {
        if (button.tab === "") {
            // Dashboard - default view
            window.location.href = '/Myurls';
            return;
        }
        
        // For sections that need to handle specific tabs
        const event = new CustomEvent('changeTab', { 
            detail: { tab: button.tab } 
        });
        window.dispatchEvent(event);
    }

    return (
        <div className={`fixed flex items-center justify-center flex-col h-full bg-white border-r-2 ${openleftbar ? 'w-1/6' : 'w-16'}`}>
            {/* Logo */}
            <div className={`absolute left-3 top-3 flex items-center ${openleftbar ? 'h-12' : "h-8"}`}>
                <span className="text-blue-700 font-bold text-xl">SaaS</span>
                <span className="text-gray-800 font-bold text-xl">Portal</span>
            </div>
            
            {/* Create New Button */}
            <div className={`absolute top-20 w-[90%] flex justify-center`}>
                <button 
                className={`bg-[#022d94] font-medium text-white rounded-md flex items-center justify-center gap-2
                    ${openleftbar ? 'w-full h-[40px]' : "h-10 w-10"}`}
                onClick={() => {
                    // Open create new dropdown or modal
                    const event = new CustomEvent('openCreateModal');
                    window.dispatchEvent(event);
                }}>
                    <FaPlus /> 
                    {openleftbar && <span className="font-semibold">Create new</span>}
                </button>
            </div>

            <hr className="w-full absolute top-[135px] border-gray-300" />

            {/* Sidebar Buttons */}
            <div className="w-full absolute top-[150px]">
                {buttons.map((button, index) => {
                    // Skip admin-only buttons for non-admin users
                    if (button.admin && !isRootAdmin) return null;
                    
                    return (
                        <button
                            key={index}
                            className="w-full h-12 flex items-center justify-start pl-5 hover:bg-gray-100 gap-3"
                            onClick={() => handleNav(button)}
                        >
                            {button.icon}
                            {openleftbar && <span className="font-montserrat font-medium">{button.name}</span>}
                        </button>
                    );
                })}
            </div>
            
            <hr className="w-full absolute top-[510px] border-gray-300" />
            <div className="w-full absolute top-[520px]">
                <button
                    className="w-full h-12 flex items-center justify-start pl-5 hover:bg-gray-100 gap-3"
                    onClick={() => router.push('/dashboard/profile')}
                >
                    <IoSettingsSharp />
                    {openleftbar && <span className="font-montserrat font-medium">Settings</span>}
                </button>
            </div>
        </div>
    );
}

export default Leftbar;
