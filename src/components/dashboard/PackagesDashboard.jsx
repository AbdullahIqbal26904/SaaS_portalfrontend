import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServicePackages,
  fetchServicePackageById,
  createNewServicePackage,
  updateExistingServicePackage,
  deleteServicePackageById
} from '@/redux/slices/packagesSlice';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import FormInput from '@/components/common/FormInput';

const PackagesDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { packages, selectedPackage, loading, error } = useSelector((state) => state.packages);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [createPackageModal, setCreatePackageModal] = useState(false);
  const [editPackageModal, setEditPackageModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form states
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    price: '',
    billing_cycle: 'monthly',
    features: {},
    is_active: true
  });

  // Features management
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState(true);
  const [featuresList, setFeaturesList] = useState([]);

  useEffect(() => {
    dispatch(fetchServicePackages(false)); // Include inactive packages too
  }, [dispatch]);

  // Set form data when editing a package
  useEffect(() => {
    if (selectedPackage) {
      setPackageForm({
        name: selectedPackage.name,
        description: selectedPackage.description,
        price: selectedPackage.price,
        billing_cycle: selectedPackage.billing_cycle,
        features: { ...selectedPackage.features },
        is_active: selectedPackage.is_active
      });
      
      // Convert features object to array for UI display
      const featuresArray = Object.entries(selectedPackage.features || {}).map(([key, value]) => ({
        key,
        value
      }));
      setFeaturesList(featuresArray);
    } else {
      setFeaturesList([]);
    }
  }, [selectedPackage]);

  const handleSelectPackage = (packageId) => {
    dispatch(fetchServicePackageById(packageId));
    setActiveTab('details');
  };

  const handleAddFeature = () => {
    if (!featureKey.trim()) return;
    
    setPackageForm({
      ...packageForm,
      features: {
        ...packageForm.features,
        [featureKey]: featureValue
      }
    });
    
    setFeaturesList([
      ...featuresList,
      { key: featureKey, value: featureValue }
    ]);
    
    setFeatureKey('');
    setFeatureValue(true);
  };

  const handleRemoveFeature = (key) => {
    const { [key]: removedFeature, ...restFeatures } = packageForm.features;
    
    setPackageForm({
      ...packageForm,
      features: restFeatures
    });
    
    setFeaturesList(featuresList.filter(feature => feature.key !== key));
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();
    dispatch(createNewServicePackage(packageForm)).then(() => {
      setCreatePackageModal(false);
      resetForm();
    });
  };

  const handleUpdatePackage = (e) => {
    e.preventDefault();
    if (selectedPackage) {
      dispatch(updateExistingServicePackage({
        id: selectedPackage.id,
        data: packageForm
      })).then(() => {
        setEditPackageModal(false);
      });
    }
  };

  const handleDeletePackage = () => {
    if (selectedPackage) {
      dispatch(deleteServicePackageById(selectedPackage.id)).then(() => {
        setConfirmDelete(false);
        setActiveTab('overview');
      });
    }
  };

  const resetForm = () => {
    setPackageForm({
      name: '',
      description: '',
      price: '',
      billing_cycle: 'monthly',
      features: {},
      is_active: true
    });
    setFeaturesList([]);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Service Packages Management</h2>
        {user?.is_root_admin && (
          <Button onClick={() => {
            resetForm();
            setCreatePackageModal(true);
          }}>Create New Package</Button>
        )}
      </div>
      
      {loading ? (
        <p>Loading service packages...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
              onClick={() => handleSelectPackage(pkg.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{pkg.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{pkg.description}</p>
              <div className="flex justify-between items-center">
                <p className="font-medium">${pkg.price}</p>
                <span className="text-sm capitalize">{pkg.billing_cycle}</span>
              </div>
            </div>
          ))}
          
          {packages.length === 0 && (
            <p className="col-span-full text-center py-8 text-gray-500">No service packages found</p>
          )}
        </div>
      )}
    </div>
  );

  const renderDetailsTab = () => {
    if (!selectedPackage) return <p>Please select a service package first</p>;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{selectedPackage.name}</h2>
          <Button onClick={() => setActiveTab('overview')}>Back to List</Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium mb-4">Package Details</h3>
            {user?.is_root_admin && (
              <div className="space-x-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setEditPackageModal(true)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{selectedPackage.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={selectedPackage.is_active ? 'text-green-600' : 'text-red-600'}>
                {selectedPackage.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p>${selectedPackage.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Billing Cycle</p>
              <p className="capitalize">{selectedPackage.billing_cycle}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p>{selectedPackage.description}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500">Features</p>
            <ul className="mt-2 space-y-1">
              {Object.entries(selectedPackage.features || {}).map(([key, value]) => (
                <li key={key} className="flex items-center">
                  <span className={`mr-2 ${value ? 'text-green-500' : 'text-red-500'}`}>
                    {value ? '✓' : '✗'}
                  </span>
                  {key}
                </li>
              ))}
              {Object.keys(selectedPackage.features || {}).length === 0 && (
                <li className="text-gray-500">No features defined</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderPackageForm = (isEdit) => (
    <form onSubmit={isEdit ? handleUpdatePackage : handleCreatePackage} className="space-y-4">
      <FormInput
        label="Package Name"
        id="package-name"
        value={packageForm.name}
        onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
        required
      />
      
      <FormInput
        label="Description"
        id="package-description"
        value={packageForm.description}
        onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Price"
          id="package-price"
          type="number"
          step="0.01"
          min="0"
          value={packageForm.price}
          onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Cycle
          </label>
          <select
            id="package-billing-cycle"
            value={packageForm.billing_cycle}
            onChange={(e) => setPackageForm({...packageForm, billing_cycle: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="package-active"
          checked={packageForm.is_active}
          onChange={(e) => setPackageForm({...packageForm, is_active: e.target.checked})}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="package-active" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Features</h4>
        
        {featuresList.length > 0 && (
          <div className="mb-4">
            <ul className="divide-y">
              {featuresList.map((feature, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`mr-2 ${feature.value ? 'text-green-500' : 'text-red-500'}`}>
                      {feature.value ? '✓' : '✗'}
                    </span>
                    <span>{feature.key}</span>
                  </div>
                  <Button 
                    size="xs" 
                    variant="danger" 
                    onClick={() => handleRemoveFeature(feature.key)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Feature name"
            value={featureKey}
            onChange={(e) => setFeatureKey(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={featureValue}
            onChange={(e) => setFeatureValue(e.target.value === 'true')}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Included</option>
            <option value="false">Not Included</option>
          </select>
          <Button type="button" onClick={handleAddFeature}>Add</Button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => isEdit ? setEditPackageModal(false) : setCreatePackageModal(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex border-b">
          <button 
            className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Packages Overview
          </button>
          {selectedPackage && (
            <button 
              className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              {selectedPackage.name} Details
            </button>
          )}
        </div>
      </div>
      
      {activeTab === 'overview' ? renderOverviewTab() : renderDetailsTab()}
      
      {/* Create Package Modal */}
      <Modal 
        isOpen={createPackageModal} 
        onClose={() => setCreatePackageModal(false)}
        title="Create New Service Package"
      >
        {renderPackageForm(false)}
      </Modal>
      
      {/* Edit Package Modal */}
      <Modal 
        isOpen={editPackageModal} 
        onClose={() => setEditPackageModal(false)}
        title={`Edit ${selectedPackage?.name || 'Service Package'}`}
      >
        {renderPackageForm(true)}
      </Modal>
      
      {/* Confirm Delete Modal */}
      <Modal 
        isOpen={confirmDelete} 
        onClose={() => setConfirmDelete(false)}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="mb-4">Are you sure you want to delete the package "{selectedPackage?.name}"?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeletePackage}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PackagesDashboard;
