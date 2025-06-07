import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubscriptions,
  fetchSubscriptionById,
  createNewSubscription,
  updateSubscriptionStatus,
  grantServiceAccessToUser,
  revokeServiceAccess
} from '@/redux/slices/subscriptionsSlice';
import { fetchDepartments } from '@/redux/slices/departmentsSlice';
import { fetchServicePackages } from '@/redux/slices/packagesSlice';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import FormInput from '@/components/common/FormInput';
import UserSearch from './UserSearch';

const SubscriptionsDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { subscriptions, selectedSubscription, loading, error } = useSelector((state) => state.subscriptions);
  const { departments } = useSelector((state) => state.departments);
  const { packages } = useSelector((state) => state.packages);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [createSubscriptionModal, setCreateSubscriptionModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);
  
  // Form states
  const [subscriptionForm, setSubscriptionForm] = useState({
    department: '',
    service_package: ''
  });
  
  const [userAccessForm, setUserAccessForm] = useState({
    user_id: ''
  });
  
  const [selectedSearchUser, setSelectedSearchUser] = useState(null);
  
  const [statusForm, setStatusForm] = useState({
    status: 'active'
  });

  useEffect(() => {
    dispatch(fetchSubscriptions());
    dispatch(fetchDepartments());
    dispatch(fetchServicePackages(true)); // Only active packages
  }, [dispatch]);

  const handleSelectSubscription = (subscriptionId) => {
    dispatch(fetchSubscriptionById(subscriptionId));
    setActiveTab('details');
  };

  const handleCreateSubscription = (e) => {
    e.preventDefault();
    dispatch(createNewSubscription(subscriptionForm)).then(() => {
      setCreateSubscriptionModal(false);
      setSubscriptionForm({
        department: '',
        service_package: ''
      });
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (selectedSubscription) {
      const userId = selectedSearchUser ? 
        (selectedSearchUser.user_id || selectedSearchUser.id) : 
        userAccessForm.user_id;
        
      dispatch(grantServiceAccessToUser({
        subscriptionId: selectedSubscription.id,
        userId: userId
      })).then(() => {
        setAddUserModal(false);
        setUserAccessForm({ user_id: '' });
        setSelectedSearchUser(null);
      });
    }
  };

  const handleChangeStatus = (e) => {
    e.preventDefault();
    if (selectedSubscription) {
      dispatch(updateSubscriptionStatus({
        id: selectedSubscription.id,
        status: statusForm.status
      })).then(() => {
        setChangeStatusModal(false);
      });
    }
  };

  const handleRevokeAccess = (accessId) => {
    if (window.confirm('Are you sure you want to revoke this user\'s access?')) {
      dispatch(revokeServiceAccess(accessId));
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Subscriptions Management</h2>
        {(user?.is_root_admin || user?.is_department_admin) && (
          <Button onClick={() => setCreateSubscriptionModal(true)}>Create Subscription</Button>
        )}
      </div>
      
      {loading ? (
        <p>Loading subscriptions...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <li key={subscription.id}>
                <div 
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectSubscription(subscription.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {subscription.department_details?.name} - {subscription.service_package_details?.name}
                      </p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                          subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {subscription.status}
                      </span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm text-gray-500">
                        ${subscription.service_package_details?.price}/{subscription.service_package_details?.billing_cycle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {new Date(subscription.start_date).toLocaleDateString()} - {new Date(subscription.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Created: {new Date(subscription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            
            {subscriptions.length === 0 && (
              <li>
                <div className="px-4 py-6 sm:px-6 text-center text-gray-500">
                  No subscriptions found
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  const renderDetailsTab = () => {
    if (!selectedSubscription) return <p>Please select a subscription first</p>;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Subscription Details</h2>
          <Button onClick={() => setActiveTab('overview')}>Back to List</Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">
              {selectedSubscription.department_details?.name} - {selectedSubscription.service_package_details?.name}
            </h3>
            <div className="flex space-x-2">
              {(user?.is_root_admin || user?.is_department_admin) && (
                <Button 
                  size="sm" 
                  onClick={() => {
                    setStatusForm({ status: selectedSubscription.status });
                    setChangeStatusModal(true);
                  }}
                >
                  Change Status
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p>{selectedSubscription.department_details?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Package</p>
              <p>{selectedSubscription.service_package_details?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs 
                ${selectedSubscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                  selectedSubscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  selectedSubscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {selectedSubscription.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p>${selectedSubscription.service_package_details?.price}/{selectedSubscription.service_package_details?.billing_cycle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p>{new Date(selectedSubscription.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p>{new Date(selectedSubscription.end_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p>{new Date(selectedSubscription.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p>{new Date(selectedSubscription.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {selectedSubscription.service_package_details?.features && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Service Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(selectedSubscription.service_package_details.features).map(([key, value]) => (
                  <li key={key} className="flex items-center">
                    <span className={`mr-2 ${value ? 'text-green-500' : 'text-red-500'}`}>
                      {value ? '✓' : '✗'}
                    </span>
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Users with Access</h4>
              {(user?.is_root_admin || user?.is_department_admin) && selectedSubscription.status === 'active' && (
                <Button size="sm" onClick={() => setAddUserModal(true)}>Add User</Button>
              )}
            </div>
            
            <div className="bg-gray-50 rounded overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Granted At</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedSubscription.users?.map((access) => (
                    <tr key={access.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {access.user_details.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {access.user_details.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(access.granted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {(user?.is_root_admin || user?.is_department_admin) && (
                          <Button 
                            size="xs" 
                            variant="danger" 
                            onClick={() => handleRevokeAccess(access.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {(!selectedSubscription.users || selectedSubscription.users.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No users have access to this subscription
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex border-b">
          <button 
            className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Subscriptions Overview
          </button>
          {selectedSubscription && (
            <button 
              className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Subscription Details
            </button>
          )}
        </div>
      </div>
      
      {activeTab === 'overview' ? renderOverviewTab() : renderDetailsTab()}
      
      {/* Create Subscription Modal */}
      <Modal 
        isOpen={createSubscriptionModal} 
        onClose={() => setCreateSubscriptionModal(false)}
        title="Create New Subscription"
      >
        <form onSubmit={handleCreateSubscription} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={subscriptionForm.department}
              onChange={(e) => setSubscriptionForm({...subscriptionForm, department: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.department_id} value={department.department_id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Package</label>
            <select
              value={subscriptionForm.service_package}
              onChange={(e) => setSubscriptionForm({...subscriptionForm, service_package: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} (${pkg.price}/{pkg.billing_cycle})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setCreateSubscriptionModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Subscription'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Add User Access Modal */}
      <Modal 
        isOpen={addUserModal} 
        onClose={() => setAddUserModal(false)}
        title="Add User Access"
      >
        <form onSubmit={handleAddUser} className="space-y-4 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Find User</h3>
            <UserSearch 
              onSelectUser={(user) => {
                setSelectedSearchUser(user);
                setUserAccessForm({
                  user_id: user.user_id || user.id
                });
              }}
              placeholder="Search for users by name or email..."
              labelText="Search Users"
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              {selectedSearchUser ? 'Selected User' : 'Or Enter User ID Directly'}
            </h3>
            
            {selectedSearchUser && (
              <div className="p-3 border rounded-md mb-4 bg-gray-50">
                <p className="font-medium">{selectedSearchUser.full_name || selectedSearchUser.username}</p>
                <p className="text-sm text-gray-600">{selectedSearchUser.email}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {selectedSearchUser.user_id || selectedSearchUser.id}</p>
              </div>
            )}
            
            {!selectedSearchUser && (
              <FormInput
                label="User ID"
                id="user-id"
                type="number"
                value={userAccessForm.user_id}
                onChange={(e) => setUserAccessForm({...userAccessForm, user_id: e.target.value})}
                required
              />
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Note: The user must be part of the department associated with this subscription.
          </p>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setAddUserModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Grant Access'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Change Status Modal */}
      <Modal 
        isOpen={changeStatusModal} 
        onClose={() => setChangeStatusModal(false)}
        title="Change Subscription Status"
      >
        <form onSubmit={handleChangeStatus} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusForm.status}
              onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setChangeStatusModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionsDashboard;
