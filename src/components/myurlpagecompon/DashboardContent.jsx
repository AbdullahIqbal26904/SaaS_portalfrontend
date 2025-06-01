import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUsers, FaBuilding, FaBoxOpen, FaCreditCard, FaCheck, FaSpinner, FaChartBar, FaUserShield } from "react-icons/fa6";
import { fetchDepartments, createNewDepartment, addAdminToDepartment, addUserToDepartment } from "@/redux/slices/departmentsSlice";
import { fetchServicePackages } from "@/redux/slices/packagesSlice";
import { fetchSubscriptions, createNewSubscription, grantUserServiceAccess } from "@/redux/slices/subscriptionsSlice";
import { fetchUsers } from "@/redux/slices/usersSlice";
import { FaTimes } from "react-icons/fa";
export default function DashboardContent() {
  const { openleftbar } = useSelector(state => state.allCart);
  const [activeTab, setActiveTab] = useState("departments");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get data from Redux store
  const dispatch = useDispatch();
  const { departments, loading: deptLoading, error: deptError } = useSelector(state => state.departments || { departments: [], loading: false, error: null });
  const { packages, loading: pkgLoading, error: pkgError } = useSelector(state => state.packages || { packages: [], loading: false, error: null });
  const { subscriptions, loading: subLoading, error: subError } = useSelector(state => state.subscriptions || { subscriptions: [], loading: false, error: null });
  const { users, loading: usersLoading, error: usersError } = useSelector(state => state.users || { users: [], loading: false, error: null });
  
  // Handle tab change events from sidebar
  useEffect(() => {
    const handleTabChange = (event) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    // Add event listener for custom tab change event
    window.addEventListener('changeTab', handleTabChange);
    
    // Add event listener for create modal
    window.addEventListener('openCreateModal', () => {
      // Choose modal based on active tab
      switch(activeTab) {
        case "departments":
          openModal("createDepartment");
          break;
        case "packages":
          openModal("createPackage");
          break;
        case "subscriptions":
          openModal("createSubscription");
          break;
        case "users":
          openModal("createUser");
          break;
        case "accessControl":
          openModal("grantServiceAccess");
          break;
        default:
          break;
      }
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('changeTab', handleTabChange);
      window.removeEventListener('openCreateModal', () => {});
    };
  }, [activeTab]);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchServicePackages());
    dispatch(fetchSubscriptions());
    dispatch(fetchUsers());
  }, [dispatch]);

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
    
    // Initialize form data based on modal type
    if (type === "createDepartment") {
      setFormData({ name: "", description: "" });
    } else if (type === "addDepartmentAdmin" || type === "addDepartmentUser") {
      setFormData({ email: "", fullName: "", password: "" });
    } else if (type === "createSubscription") {
      setFormData({ departmentId: "", packageId: "" });
    } else if (type === "grantServiceAccess") {
      setFormData({ userId: "", subscriptionId: "" });
    } else if (item) {
      setFormData(item);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      switch (modalType) {
        case "createDepartment":
          await dispatch(createNewDepartment(formData)).unwrap();
          break;
          
        case "createSubscription":
          // Format subscription data according to API requirements
          const subscriptionData = {
            department: formData.departmentId,
            service_package: formData.packageId,
            billing_cycle: formData.billingCycle || 'monthly',
            start_date: formData.startDate || new Date().toISOString().split('T')[0]
          };
          await dispatch(createNewSubscription(subscriptionData)).unwrap();
          break;
          
        case "addDepartmentAdmin":
          // Format admin data according to API requirements
          const adminData = {
            email: formData.email,
            full_name: formData.fullName,
            password: formData.password || undefined // Only include if provided
          };
          await dispatch(addAdminToDepartment({
            departmentId: formData.departmentId,
            adminData
          })).unwrap();
          break;
          
        case "addDepartmentUser":
          // Format user data according to API requirements
          const userData = {
            email: formData.email,
            full_name: formData.fullName,
            password: formData.password || undefined // Only include if provided
          };
          await dispatch(addUserToDepartment({
            departmentId: formData.departmentId,
            userData
          })).unwrap();
          break;

        case "createUser":
          // Prepare user data
          const newUserData = {
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            department_id: formData.departmentId || null,
            is_department_admin: formData.isDepartmentAdmin || false
          };
          // Import and use createUserThunk if it exists
          // Otherwise this would need to be implemented
          // await dispatch(createUser(userData)).unwrap();
          console.log("Creating user with data:", newUserData);
          // Show alert since this functionality is not implemented
          alert("User creation functionality will be implemented in the next phase.");
          break;
          
        case "grantServiceAccess":
          // Prepare access data
          const accessData = {
            subscriptionId: formData.subscriptionId,
            userId: formData.userId
          };
          await dispatch(grantUserServiceAccess(accessData)).unwrap();
          break;
          
        case "editDepartment":
          // This would need a departmentUpdate function implementation
          console.log("Updating department with data:", formData);
          // Show alert since this functionality is not implemented
          alert("Department update functionality will be implemented in the next phase.");
          break;
          
        default:
          console.log("Form submission not implemented for this modal type:", modalType);
      }
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case "departments":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-montserrat">Departments</h2>
              <button 
                onClick={() => openModal("createDepartment")} 
                className="px-4 py-2 bg-[#2a5bd7] hover:bg-[#022d94] text-white rounded-md"
              >
                Create Department
              </button>
            </div>
            
            {/* Search & Filters */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                placeholder="Search departments..."
                className="w-[280px] px-4 py-2 bg-white font-montserrat border rounded-sm border-1 focus outline-blue-700"
              />
              <button className="px-4 py-2 bg-white font-medium font-montserrat border rounded-sm hover:bg-gray-300">Filter by status</button>
              <button className="px-4 py-2 bg-white border rounded-sm font-medium font-montserrat hover:bg-gray-300">Add filters</button>
            </div>
            
            {deptLoading && <div className="flex justify-center"><FaSpinner className="animate-spin text-2xl" /></div>}
            {deptError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {deptError.message || 'Failed to load departments'}</span>
                <button 
                  className="underline ml-2"
                  onClick={() => dispatch(fetchDepartments())}
                >
                  Retry
                </button>
              </div>
            )}
            
            {!deptLoading && !deptError && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Department Name</th>
                      <th className="px-6 py-3 text-left">Admin</th>
                      <th className="px-6 py-3 text-left">Members</th>
                      <th className="px-6 py-3 text-left">Active Subscriptions</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {departments && departments.length > 0 ? (
                      departments.map(dept => (
                        <tr key={dept.department_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{dept.name}</td>
                          <td className="px-6 py-4">
                            {dept.admins && dept.admins.length > 0 
                              ? `${dept.admins[0].full_name}` 
                              : "No admin assigned"}
                          </td>
                          <td className="px-6 py-4">{dept.users ? dept.users.length : 0}</td>
                          <td className="px-6 py-4">
                            {/* This would need actual subscription data relation */}
                            {subscriptions.filter(sub => sub.department === dept.department_id).length}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openModal("viewDepartment", dept)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => openModal("editDepartment", dept)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => openModal("addDepartmentAdmin", { departmentId: dept.department_id })}
                                className="text-green-600 hover:text-green-900"
                              >
                                Add Admin
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">No departments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );
        
      case "packages":
        // Content for Service Packages tab
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-montserrat">Service Packages</h2>
              <button 
                onClick={() => openModal("createPackage")} 
                className="px-4 py-2 bg-[#2a5bd7] hover:bg-[#022d94] text-white rounded-md"
              >
                Create Package
              </button>
            </div>
            
            {/* Search & Filters */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                placeholder="Search packages..."
                className="w-[280px] px-4 py-2 bg-white font-montserrat border rounded-sm border-1 focus outline-blue-700"
              />
              <button className="px-4 py-2 bg-white font-medium font-montserrat border rounded-sm hover:bg-gray-300">Filter by status</button>
              <button className="px-4 py-2 bg-white border rounded-sm font-medium font-montserrat hover:bg-gray-300">Add filters</button>
            </div>
            
            {pkgLoading && <div className="flex justify-center"><FaSpinner className="animate-spin text-2xl" /></div>}
            {pkgError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {pkgError.message || 'Failed to load service packages'}</span>
                <button 
                  className="underline ml-2"
                  onClick={() => dispatch(fetchServicePackages())}
                >
                  Retry
                </button>
              </div>
            )}
            
            {!pkgLoading && !pkgError && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages && packages.length > 0 ? (
                  packages.map(pkg => (
                    <div key={pkg.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{pkg.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {pkg.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{pkg.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Pricing:</h4>
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between">
                            <span>Monthly:</span>
                            <span>${typeof pkg.price === 'object' ? pkg.price.monthly : pkg.price}</span>
                          </div>
                          {pkg.price && typeof pkg.price === 'object' && (
                            <>
                              <div className="flex justify-between">
                                <span>Quarterly:</span>
                                <span>${pkg.price.quarterly}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Yearly:</span>
                                <span>${pkg.price.yearly}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Features:</h4>
                        <ul className="list-disc list-inside">
                          {pkg.features && typeof pkg.features === 'object' ? (
                            Object.entries(pkg.features).map(([key, value], i) => (
                              <li key={i} className="flex items-center">
                                {typeof value === 'boolean' ? (
                                  value ? (
                                    <FaCheck className="inline mr-2 text-green-500" />
                                  ) : (
                                    <FaTimes className="inline mr-2 text-red-500" />
                                  )
                                ) : null}
                                {key}
                              </li>
                            ))
                          ) : (
                            <li>No features listed</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <button 
                          onClick={() => openModal("editPackage", pkg)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => openModal("togglePackageStatus", pkg)}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          {pkg.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    No service packages found
                  </div>
                )}
              </div>
            )}
          </>
        );
        
      case "subscriptions":
        // Content for Subscriptions tab
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-montserrat">Subscriptions</h2>
              <button 
                onClick={() => openModal("createSubscription")} 
                className="px-4 py-2 bg-[#2a5bd7] hover:bg-[#022d94] text-white rounded-md"
              >
                Create Subscription
              </button>
            </div>
            
            {/* Search & Filters */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                placeholder="Search subscriptions..."
                className="w-[280px] px-4 py-2 bg-white font-montserrat border rounded-sm border-1 focus outline-blue-700"
              />
              <button className="px-4 py-2 bg-white font-medium font-montserrat border rounded-sm hover:bg-gray-300">Filter by status</button>
              <button className="px-4 py-2 bg-white border rounded-sm font-medium font-montserrat hover:bg-gray-300">Add filters</button>
            </div>
            
            {subLoading && <div className="flex justify-center"><FaSpinner className="animate-spin text-2xl" /></div>}
            {subError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {subError.message || 'Failed to load subscriptions'}</span>
                <button 
                  className="underline ml-2"
                  onClick={() => dispatch(fetchSubscriptions())}
                >
                  Retry
                </button>
              </div>
            )}
            
            {!subLoading && !subError && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Department</th>
                      <th className="px-6 py-3 text-left">Package</th>
                      <th className="px-6 py-3 text-left">Start Date</th>
                      <th className="px-6 py-3 text-left">End Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscriptions && subscriptions.length > 0 ? (
                      subscriptions.map(sub => {
                        // Find department and package details
                        const department = departments.find(d => d.department_id === sub.department);
                        const servicePackage = packages.find(p => p.id === sub.service_package);
                        
                        return (
                          <tr key={sub.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{department ? department.name : `Department ${sub.department}`}</td>
                            <td className="px-6 py-4">{servicePackage ? servicePackage.name : `Package ${sub.service_package}`}</td>
                            <td className="px-6 py-4">{new Date(sub.start_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{new Date(sub.end_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  sub.status === 'expired' ? 'bg-red-100 text-red-800' : 
                                  'bg-gray-100 text-gray-800'}`}>
                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => openModal("viewSubscription", sub)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => openModal("manageAccess", { subscriptionId: sub.id })}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Manage Access
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">No subscriptions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );
        
      case "users":
        // Content for Users tab
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-montserrat">User Management</h2>
              <button 
                onClick={() => openModal("createUser")} 
                className="px-4 py-2 bg-[#2a5bd7] hover:bg-[#022d94] text-white rounded-md"
              >
                Create User
              </button>
            </div>
            
            {/* Search & Filters */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                placeholder="Search users..."
                className="w-[280px] px-4 py-2 bg-white font-montserrat border rounded-sm border-1 focus outline-blue-700"
              />
              <button className="px-4 py-2 bg-white font-medium font-montserrat border rounded-sm hover:bg-gray-300">Filter by role</button>
              <button className="px-4 py-2 bg-white border rounded-sm font-medium font-montserrat hover:bg-gray-300">Add filters</button>
            </div>
            
            {usersLoading && <div className="flex justify-center"><FaSpinner className="animate-spin text-2xl" /></div>}
            {usersError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {usersError.message || 'Failed to load users'}</span>
                <button 
                  className="underline ml-2"
                  onClick={() => dispatch(fetchUsers())}
                >
                  Retry
                </button>
              </div>
            )}
            
            {!usersLoading && !usersError && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Department</th>
                      <th className="px-6 py-3 text-left">Last Login</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users && users.length > 0 ? (
                      users.map(user => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{user.full_name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            {user.is_root_admin ? 'Root Admin' : 
                              // This would need to check if the user is a department admin
                              'Regular User'}
                          </td>
                          <td className="px-6 py-4">
                            {/* Would need to fetch user's department */}
                            N/A
                          </td>
                          <td className="px-6 py-4">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openModal("viewUser", user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => openModal("editUser", user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );
        
      case "accessControl":
        // Content for Access Control tab
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-montserrat">Service Access Control</h2>
              <button 
                onClick={() => openModal("grantServiceAccess")} 
                className="px-4 py-2 bg-[#2a5bd7] hover:bg-[#022d94] text-white rounded-md"
              >
                Grant Access
              </button>
            </div>
            
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Department</th>
                    <th className="px-6 py-3 text-left">Subscription</th>
                    <th className="px-6 py-3 text-left">Service Package</th>
                    <th className="px-6 py-3 text-left">Granted on</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      Access control data will be available here once implemented.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );
        
      case "analytics":
        // Content for Analytics tab
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-montserrat">Analytics Dashboard</h2>
            </div>
            
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-500 text-sm font-semibold">Total Departments</h3>
                  <FaBuilding className="text-blue-500 text-2xl" />
                </div>
                <p className="mt-4 text-3xl font-bold">{departments?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-2">+12% from last month</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-500 text-sm font-semibold">Active Users</h3>
                  <FaUsers className="text-green-500 text-2xl" />
                </div>
                <p className="mt-4 text-3xl font-bold">{users?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-2">+8% from last month</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-500 text-sm font-semibold">Active Subscriptions</h3>
                  <FaCreditCard className="text-purple-500 text-2xl" />
                </div>
                <p className="mt-4 text-3xl font-bold">{subscriptions?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-2">+15% from last month</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-500 text-sm font-semibold">Monthly Revenue</h3>
                  <FaChartBar className="text-amber-500 text-2xl" />
                </div>
                <p className="mt-4 text-3xl font-bold">$--</p>
                <p className="text-xs text-gray-500 mt-2">Coming Soon</p>
              </div>
            </div>
            
            {/* Placeholder for charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Subscription Growth</h3>
                <div className="w-full h-64 bg-gray-100 flex justify-center items-center rounded">
                  <p className="text-gray-500">Chart will be implemented in the next phase</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Package Popularity</h3>
                <div className="w-full h-64 bg-gray-100 flex justify-center items-center rounded">
                  <p className="text-gray-500">Chart will be implemented in the next phase</p>
                </div>
              </div>
            </div>
          </>
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };

  // Modal component
  const renderModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {modalType === "createDepartment" && "Create New Department"}
            {modalType === "editDepartment" && "Edit Department"}
            {modalType === "viewDepartment" && "Department Details"}
            {modalType === "addDepartmentAdmin" && "Add Department Admin"}
            {modalType === "addDepartmentUser" && "Add Department User"}
            {modalType === "createPackage" && "Create Service Package"}
            {modalType === "editPackage" && "Edit Service Package"}
            {modalType === "createSubscription" && "Create Subscription"}
            {modalType === "viewSubscription" && "Subscription Details"}
            {modalType === "manageAccess" && "Manage Service Access"}
            {modalType === "createUser" && "Create New User"}
            {modalType === "editUser" && "Edit User"}
            {modalType === "viewUser" && "User Details"}
            {modalType === "grantServiceAccess" && "Grant Service Access"}
          </h3>
          
          <form onSubmit={handleSubmit}>
            {/* Dynamic form content based on modal type */}
            {modalType === "createDepartment" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Department Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    rows="3"
                  />
                </div>
              </>
            )}
            
            {modalType === "createSubscription" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Department</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Service Package</label>
                  <select
                    name="packageId"
                    value={formData.packageId || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Package</option>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${typeof pkg.price === 'object' ? pkg.price.monthly : pkg.price}/month
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Billing Cycle</label>
                  <select
                    name="billingCycle"
                    value={formData.billingCycle || "monthly"}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
              </>
            )}

            {modalType === "createUser" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Department (Optional)</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">None</option>
                    {departments.map(dept => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDepartmentAdmin"
                      checked={formData.isDepartmentAdmin || false}
                      onChange={(e) => setFormData({...formData, isDepartmentAdmin: e.target.checked})}
                      className="mr-2"
                    />
                    <span>Make Department Admin</span>
                  </label>
                </div>
              </>
            )}

            {modalType === "grantServiceAccess" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">User</label>
                  <select
                    name="userId"
                    value={formData.userId || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Subscription</label>
                  <select
                    name="subscriptionId"
                    value={formData.subscriptionId || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Subscription</option>
                    {subscriptions.map(sub => {
                      const department = departments.find(d => d.department_id === sub.department);
                      const servicePackage = packages.find(p => p.id === sub.service_package);
                      return (
                        <option key={sub.id} value={sub.id}>
                          {department?.name || 'Unknown Dept'} - {servicePackage?.name || 'Unknown Package'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            )}
            
            {modalType === "addDepartmentAdmin" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password (Optional if user already exists)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Leave blank for existing users"
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  If the user already exists in the system, they will be assigned as an admin to this department.
                  If not, a new user with admin rights will be created.
                </p>
              </>
            )}
            
            {modalType === "addDepartmentUser" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="user@example.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password (Optional if user already exists)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Leave blank for existing users"
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  If the user already exists in the system, they will be added to this department.
                  If not, a new user will be created and added to the department.
                </p>
              </>
            )}
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              {!modalType.startsWith("view") && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-[#2a5bd7] text-white rounded hover:bg-[#022d94] flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pt-16 md:pl-${openleftbar ? '64' : '16'} pl-4 pr-4 ml-auto w-full transition-all duration-300`}>
      <div className="container mx-auto py-8">
        {/* Main Tabs */}
        <div className="flex mb-8 border-b-2 font-montserrat font-medium overflow-x-auto scrollbar-hide">
          <button
            className={`px-6 py-3 ${activeTab === "departments" ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-600"}`}
            onClick={() => setActiveTab("departments")}
          >
            <FaBuilding className="inline mr-2" /> Departments
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "packages" ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-600"}`}
            onClick={() => setActiveTab("packages")}
          >
            <FaBoxOpen className="inline mr-2" /> Service Packages
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "subscriptions" ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-600"}`}
            onClick={() => setActiveTab("subscriptions")}
          >
            <FaCreditCard className="inline mr-2" /> Subscriptions
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "users" ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-600"}`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="inline mr-2" /> Users
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "accessControl" ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-600"}`}
            onClick={() => setActiveTab("accessControl")}
          >
            <FaUsers className="inline mr-2" /> Access Control
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "analytics" ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-600"}`}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartBar className="inline mr-2" /> Analytics
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white p-8 rounded-lg shadow-md min-h-[600px]">
          {renderContent()}
        </div>
        
        {/* Modal */}
        {renderModal()}
      </div>
    </div>
  );
}
