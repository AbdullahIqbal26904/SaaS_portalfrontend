import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "@/redux/slices/authSlice";

function ProfileUpdate() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  
  useEffect(() => {
    if (user) {
      setName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);
  
  // Get user type label
  const getUserTypeLabel = () => {
    if (!user) return "";
    if (user.is_root_admin) return "Root Administrator";
    if (user.is_reseller_admin) return "Reseller Administrator";
    if (user.user_type === "reseller") return "Reseller User";
    return "Direct Customer";
  };

  return (
    <div className="absolute left-[257px] top-20 w-[82%] h-[85%] bg-gray-100 flex flex-col items-center py-10">
      {/* Heading Section */}
      <div className="w-[60%]">
        <h2 className="text-gray-500 text-lg font-semibold">Profile Management</h2>
        <h1 className="text-3xl font-bold mt-2">Update Information</h1>
      </div>

      {/* Profile Picture Section */}
      <div className="w-[60%] flex items-center space-x-6 mt-6">
        <div className="w-16 h-16 bg-green-700 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
          A
        </div>
        <button className="bg-green-700 text-white px-6 py-2 rounded-md text-lg font-medium">
          Select a Photo
        </button>
      </div>

      {/* Contact Information Section */}
      <div className="w-[60%] bg-white shadow-md p-6 rounded-lg mt-8">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Account Type</label>
          <div className="w-full border border-gray-300 rounded p-2 bg-gray-50">
            {getUserTypeLabel()}
            {user?.is_reseller_admin && user?.reseller_name && (
              <span className="ml-2 text-gray-500">({user.reseller_name})</span>
            )}
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold">
          Update
        </button>
      </div>

      {/* Deactivate Account Button */}
      <button className="mt-6 text-red-600 border border-red-600 px-6 py-2 rounded-md font-semibold">
        Deactivate Account
      </button>
    </div>
  );
}

export default ProfileUpdate;
