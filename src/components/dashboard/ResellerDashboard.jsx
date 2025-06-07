import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchResellers, 
  fetchResellerById, 
  createNewReseller,
  addAdminToReseller,
  createResellerCustomer,
  createResellerSubscription
} from '@/redux/slices/resellersSlice';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import FormInput from '@/components/common/FormInput';
import ShareableInvite from './ShareableInvite';

const ResellerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { resellers, selectedReseller, loading, error } = useSelector((state) => state.resellers);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [createResellerModal, setCreateResellerModal] = useState(false);
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [createSubscriptionModal, setCreateSubscriptionModal] = useState(false);

  // Form states
  const [resellerForm, setResellerForm] = useState({
    name: '',
    description: '',
    is_active: true,
    commission_rate: '10.00'
  });

  const [adminForm, setAdminForm] = useState({
    email: '',
    full_name: '',
    password: ''
  });

  const [customerForm, setCustomerForm] = useState({
    name: '',
    description: ''
  });

  const [subscriptionForm, setSubscriptionForm] = useState({
    department: '',
    service_package: ''
  });

  useEffect(() => {
    dispatch(fetchResellers());
  }, [dispatch]);

  const handleSelectReseller = (resellerId) => {
    dispatch(fetchResellerById(resellerId));
    setActiveTab('details');
  };

  const handleCreateReseller = (e) => {
    e.preventDefault();
    dispatch(createNewReseller(resellerForm)).then(() => {
      setCreateResellerModal(false);
      setResellerForm({
        name: '',
        description: '',
        is_active: true,
        commission_rate: '10.00'
      });
    });
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (selectedReseller) {
      dispatch(addAdminToReseller({
        resellerId: selectedReseller.reseller_id,
        adminData: adminForm
      })).then(() => {
        setAddAdminModal(false);
        setAdminForm({
          email: '',
          full_name: '',
          password: ''
        });
      });
    }
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (selectedReseller) {
      dispatch(createResellerCustomer({
        resellerId: selectedReseller.reseller_id,
        customerData: customerForm
      })).then(() => {
        setCreateCustomerModal(false);
        setCustomerForm({
          name: '',
          description: ''
        });
      });
    }
  };

  const handleCreateSubscription = (e) => {
    e.preventDefault();
    if (selectedReseller) {
      dispatch(createResellerSubscription({
        resellerId: selectedReseller.reseller_id,
        subscriptionData: subscriptionForm
      })).then(() => {
        setCreateSubscriptionModal(false);
        setSubscriptionForm({
          department: '',
          service_package: ''
        });
      });
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resellers Management</h2>
        {user?.is_root_admin && (
          <Button onClick={() => setCreateResellerModal(true)}>Create New Reseller</Button>
        )}
      </div>
      
      {loading ? (
        <p>Loading resellers...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resellers.map((reseller) => (
            <div 
              key={reseller.reseller_id}
              className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
              onClick={() => handleSelectReseller(reseller.reseller_id)}
            >
              <h3 className="text-lg font-medium">{reseller.name}</h3>
              <p className="text-gray-600 text-sm">{reseller.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${reseller.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reseller.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm">Commission: {reseller.commission_rate}%</span>
              </div>
            </div>
          ))}
          
          {resellers.length === 0 && (
            <p className="col-span-full text-center py-8 text-gray-500">No resellers found</p>
          )}
        </div>
      )}
    </div>
  );

  const renderDetailsTab = () => {
    if (!selectedReseller) return <p>Please select a reseller first</p>;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{selectedReseller.name}</h2>
          <Button onClick={() => setActiveTab('overview')}>Back to List</Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Reseller Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{selectedReseller.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{selectedReseller.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={selectedReseller.is_active ? 'text-green-600' : 'text-red-600'}>
                {selectedReseller.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Commission Rate</p>
              <p>{selectedReseller.commission_rate}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Admins</h3>
            {user?.is_root_admin && (
              <Button onClick={() => setAddAdminModal(true)} size="sm">Add Admin</Button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedReseller.admins?.map((admin) => (
                  <tr key={admin.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Reseller Admin</td>
                  </tr>
                ))}
                {(!selectedReseller.admins || selectedReseller.admins.length === 0) && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center">No admins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Customers</h3>
            <div className="flex space-x-2">
              {(user?.is_root_admin || user?.is_reseller_admin) && (
                <>
                  <ShareableInvite />
                  <Button onClick={() => setCreateCustomerModal(true)} size="sm">Add Customer</Button>
                </>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedReseller.customers?.map((customer) => (
                  <tr key={customer.department_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        size="xs"
                        onClick={() => {
                          setSubscriptionForm({
                            department: customer.department_id,
                            service_package: ''
                          });
                          setCreateSubscriptionModal(true);
                        }}
                      >
                        Create Subscription
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!selectedReseller.customers || selectedReseller.customers.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex border-b">
          <button 
            className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Resellers Overview
          </button>
          {selectedReseller && (
            <button 
              className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              {selectedReseller.name} Details
            </button>
          )}
        </div>
      </div>
      
      {activeTab === 'overview' ? renderOverviewTab() : renderDetailsTab()}
      
      {/* Create Reseller Modal */}
      <Modal 
        isOpen={createResellerModal} 
        onClose={() => setCreateResellerModal(false)}
        title="Create New Reseller"
      >
        <form onSubmit={handleCreateReseller} className="space-y-4">
          <FormInput
            label="Name"
            id="reseller-name"
            value={resellerForm.name}
            onChange={(e) => setResellerForm({...resellerForm, name: e.target.value})}
            required
          />
          <FormInput
            label="Description"
            id="reseller-description"
            value={resellerForm.description}
            onChange={(e) => setResellerForm({...resellerForm, description: e.target.value})}
            required
          />
          <FormInput
            label="Commission Rate (%)"
            id="reseller-commission"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={resellerForm.commission_rate}
            onChange={(e) => setResellerForm({...resellerForm, commission_rate: e.target.value})}
            required
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reseller-active"
              checked={resellerForm.is_active}
              onChange={(e) => setResellerForm({...resellerForm, is_active: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="reseller-active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setCreateResellerModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Reseller'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Add Admin Modal */}
      <Modal 
        isOpen={addAdminModal} 
        onClose={() => setAddAdminModal(false)}
        title="Add Reseller Admin"
      >
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <FormInput
            label="Email"
            id="admin-email"
            type="email"
            value={adminForm.email}
            onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
            required
          />
          <FormInput
            label="Full Name"
            id="admin-name"
            value={adminForm.full_name}
            onChange={(e) => setAdminForm({...adminForm, full_name: e.target.value})}
            required
          />
          <FormInput
            label="Password (only needed for new users)"
            id="admin-password"
            type="password"
            value={adminForm.password}
            onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
            placeholder="Leave blank if user already exists"
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setAddAdminModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Admin'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Create Customer Modal */}
      <Modal 
        isOpen={createCustomerModal} 
        onClose={() => setCreateCustomerModal(false)}
        title="Create Customer Department"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <FormInput
            label="Department Name"
            id="customer-name"
            value={customerForm.name}
            onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
            required
          />
          <FormInput
            label="Description"
            id="customer-description"
            value={customerForm.description}
            onChange={(e) => setCustomerForm({...customerForm, description: e.target.value})}
            required
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setCreateCustomerModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Create Subscription Modal */}
      <Modal 
        isOpen={createSubscriptionModal} 
        onClose={() => setCreateSubscriptionModal(false)}
        title="Create Subscription"
      >
        <form onSubmit={handleCreateSubscription} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={subscriptionForm.department}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
            />
          </div>
          <FormInput
            label="Service Package ID"
            id="subscription-package"
            type="number"
            value={subscriptionForm.service_package}
            onChange={(e) => setSubscriptionForm({
              ...subscriptionForm, 
              service_package: e.target.value
            })}
            required
          />
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
    </div>
  );
};

export default ResellerDashboard;
