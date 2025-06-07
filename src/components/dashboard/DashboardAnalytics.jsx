import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubscriptions } from '@/redux/slices/subscriptionsSlice';
import { fetchDepartments } from '@/redux/slices/departmentsSlice';
import { fetchUsers } from '@/redux/slices/usersSlice';

const DashboardAnalytics = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { subscriptions } = useSelector((state) => state.subscriptions);
  const { departments } = useSelector((state) => state.departments);
  const { users } = useSelector((state) => state.users);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalDepartments: 0,
    totalUsers: 0,
    subscriptionsByMonth: {},
    usersByDepartment: {}
  });
  
  useEffect(() => {
    // Fetch all necessary data
    dispatch(fetchSubscriptions());
    dispatch(fetchDepartments());
    dispatch(fetchUsers());
  }, [dispatch]);
  
  useEffect(() => {
    // Process data for analytics once loaded
    if (subscriptions && departments && users) {
      calculateMetrics();
    }
  }, [subscriptions, departments, users]);
  
  const calculateMetrics = () => {
    // Total and active subscriptions
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    
    // Subscriptions by month
    const subsByMonth = subscriptions.reduce((acc, sub) => {
      const date = new Date(sub.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});
    
    // Users by department 
    const usersByDept = {};
    departments.forEach(dept => {
      const deptUsers = dept.users?.length || 0;
      usersByDept[dept.name] = deptUsers;
    });
    
    setMetrics({
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      totalDepartments: departments.length,
      totalUsers: users.length,
      subscriptionsByMonth: subsByMonth,
      usersByDepartment: usersByDept
    });
  };
  
  // Helper function for simple bar charts
  const renderBarChart = (data, label) => {
    const maxValue = Math.max(...Object.values(data));
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">{label}</h3>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div className="w-20 text-sm text-gray-600">{key}</div>
              <div className="flex-1">
                <div
                  className="h-6 bg-blue-500 rounded"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="w-10 text-right text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Key metrics cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Subscriptions</h3>
          <p className="text-3xl font-bold mt-2">{metrics.totalSubscriptions}</p>
          <div className="mt-2 text-sm">
            <span className="text-green-500 font-medium">{metrics.activeSubscriptions} Active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Departments</h3>
          <p className="text-3xl font-bold mt-2">{metrics.totalDepartments}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{metrics.totalUsers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Subscription Health</h3>
          <p className="text-3xl font-bold mt-2">
            {metrics.totalSubscriptions > 0
              ? `${Math.round((metrics.activeSubscriptions / metrics.totalSubscriptions) * 100)}%`
              : '0%'}
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{
                width: metrics.totalSubscriptions > 0
                  ? `${(metrics.activeSubscriptions / metrics.totalSubscriptions) * 100}%`
                  : '0%'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Subscriptions Over Time</h2>
          {renderBarChart(metrics.subscriptionsByMonth, 'Subscriptions by Month')}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Department Size</h2>
          {renderBarChart(metrics.usersByDepartment, 'Users by Department')}
        </div>
      </div>
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Analytics</h2>
        
        {/* Subscription Status Distribution */}
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Subscription Status</h3>
          <div className="flex h-8 rounded-md overflow-hidden">
            {subscriptions.length > 0 ? (
              <>
                <div 
                  className="bg-green-500" 
                  style={{ 
                    width: `${(metrics.activeSubscriptions / subscriptions.length) * 100}%` 
                  }}
                ></div>
                <div 
                  className="bg-yellow-500" 
                  style={{ 
                    width: `${(
                      subscriptions.filter(s => s.status === 'pending').length / 
                      subscriptions.length
                    ) * 100}%` 
                  }}
                ></div>
                <div 
                  className="bg-red-500" 
                  style={{ 
                    width: `${(
                      subscriptions.filter(s => s.status === 'cancelled' || s.status === 'expired').length / 
                      subscriptions.length
                    ) * 100}%` 
                  }}
                ></div>
              </>
            ) : (
              <div className="bg-gray-200 w-full"></div>
            )}
          </div>
          <div className="flex text-sm mt-2 justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Active ({metrics.activeSubscriptions})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span>Pending ({subscriptions.filter(s => s.status === 'pending').length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span>
                Inactive ({
                  subscriptions.filter(s => s.status === 'cancelled' || s.status === 'expired').length
                })
              </span>
            </div>
          </div>
        </div>
        
        {/* Subscriptions Over Time */}
        <div className="mt-8">
          <h3 className="text-md font-medium mb-2">Growth Over Time</h3>
          {renderBarChart(metrics.subscriptionsByMonth, 'New Subscriptions by Month')}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
      
      {/* User Distribution */}
      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Users by Department</h3>
        {renderBarChart(metrics.usersByDepartment, 'Department Size')}
      </div>
      
      {/* User Roles Distribution */}
      <div className="mt-8">
        <h3 className="text-md font-medium mb-2">User Roles Distribution</h3>
        <div className="flex h-8 rounded-md overflow-hidden">
          {users.length > 0 ? (
            <>
              <div 
                className="bg-blue-700" 
                style={{ 
                  width: `${(users.filter(u => u.is_root_admin).length / users.length) * 100}%` 
                }}
              ></div>
              <div 
                className="bg-blue-500" 
                style={{ 
                  width: `${(users.filter(u => u.is_reseller_admin).length / users.length) * 100}%` 
                }}
              ></div>
              <div 
                className="bg-blue-300" 
                style={{ 
                  width: `${(users.filter(u => u.is_department_admin).length / users.length) * 100}%` 
                }}
              ></div>
              <div 
                className="bg-gray-200" 
                style={{ 
                  width: `${(
                    users.filter(
                      u => !u.is_root_admin && !u.is_reseller_admin && !u.is_department_admin
                    ).length / users.length
                  ) * 100}%` 
                }}
              ></div>
            </>
          ) : (
            <div className="bg-gray-200 w-full"></div>
          )}
        </div>
        <div className="flex text-sm mt-2 justify-between flex-wrap">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-blue-700 mr-1"></div>
            <span>Root Admin ({users.filter(u => u.is_root_admin).length})</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>Reseller Admin ({users.filter(u => u.is_reseller_admin).length})</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-blue-300 mr-1"></div>
            <span>Department Admin ({users.filter(u => u.is_department_admin).length})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-200 mr-1"></div>
            <span>
              Regular Users ({
                users.filter(
                  u => !u.is_root_admin && !u.is_reseller_admin && !u.is_department_admin
                ).length
              })
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button 
            className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`pb-2 px-4 ${activeTab === 'subscriptions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Subscriptions
          </button>
          <button 
            className={`pb-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'subscriptions' && renderSubscriptionsTab()}
      {activeTab === 'users' && renderUsersTab()}
    </div>
  );
};

export default DashboardAnalytics;
