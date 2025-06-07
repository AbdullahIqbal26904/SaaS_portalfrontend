import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResellerCustomers } from '@/redux/slices/resellersSlice';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import FormInput from '@/components/common/FormInput';
import ShareableInvite from './ShareableInvite';
import { createResellerCustomer, createResellerSubscription } from '@/redux/slices/resellersSlice';

const CustomersDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedReseller, resellerCustomers, loading, error } = useSelector((state) => state.resellers);
  
  const [customers, setCustomers] = useState([]);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [createSubscriptionModal, setCreateSubscriptionModal] = useState(false);
  
  const [customerForm, setCustomerForm] = useState({
    name: '',
    description: ''
  });
  
  const [subscriptionForm, setSubscriptionForm] = useState({
    department: '',
    service_package: ''
  });

  useEffect(() => {
    // If user is a reseller admin, fetch their customers
    if (user?.is_reseller_admin) {
      // We need to fetch the reseller ID first, assuming it's stored in the user object
      const resellerId = user.reseller_id; // This assumes the backend includes the reseller_id in the user object
      if (resellerId) {
        dispatch(fetchResellerCustomers(resellerId));
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Update customers when resellerCustomers changes
    if (user?.is_reseller_admin && user?.reseller_id && resellerCustomers[user.reseller_id]) {
      setCustomers(resellerCustomers[user.reseller_id]);
    }
  }, [resellerCustomers, user]);

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (user?.is_reseller_admin && user?.reseller_id) {
      dispatch(createResellerCustomer({
        resellerId: user.reseller_id,
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
    if (user?.is_reseller_admin && user?.reseller_id) {
      dispatch(createResellerSubscription({
        resellerId: user.reseller_id,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        {user?.is_reseller_admin && (
          <div className="flex space-x-2">
            <ShareableInvite />
            <Button onClick={() => setCreateCustomerModal(true)}>Add New Customer</Button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center py-4">Loading customers...</p>
      ) : error ? (
        <p className="text-center py-4 text-red-500">Error: {error.message}</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.department_details.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.department_details.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(customer.department_details.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSubscriptionForm({
                          department: customer.department,
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
              
              {customers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Customer Modal */}
      <Modal 
        isOpen={createCustomerModal} 
        onClose={() => setCreateCustomerModal(false)}
        title="Add New Customer"
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
            <label className="block text-sm font-medium text-gray-700">Department ID</label>
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

export default CustomersDashboard;
