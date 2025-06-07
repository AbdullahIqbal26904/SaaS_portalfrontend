import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDepartments,
  fetchDepartmentById,
  createNewDepartment,
  updateExistingDepartment,
  deleteDepartmentById,
  addAdminToDepartment,
  removeAdminFromDepartment,
  addUserToDepartment,
  removeUserFromDepartment
} from '@/redux/slices/departmentsSlice';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import FormInput from '@/components/common/FormInput';
import UserSearch from './UserSearch';

const DepartmentsDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { departments, selectedDepartment, loading, error } = useSelector((state) => state.departments);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [createDepartmentModal, setCreateDepartmentModal] = useState(false);
  const [editDepartmentModal, setEditDepartmentModal] = useState(false);
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form states
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: ''
  });

  const [adminForm, setAdminForm] = useState({
    email: '',
    full_name: '',
    password: ''
  });

  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    password: ''
  });
  
  const [selectedSearchUser, setSelectedSearchUser] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSelectDepartment = (departmentId) => {
    dispatch(fetchDepartmentById(departmentId));
    setActiveTab('details');
  };

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    dispatch(createNewDepartment(departmentForm)).then(() => {
      setCreateDepartmentModal(false);
      setDepartmentForm({
        name: '',
        description: ''
      });
    });
  };

  const handleEditDepartment = (e) => {
    e.preventDefault();
    if (selectedDepartment) {
      dispatch(updateExistingDepartment({
        id: selectedDepartment.department_id,
        data: departmentForm
      })).then(() => {
        setEditDepartmentModal(false);
      });
    }
  };
  
  const handleDeleteDepartment = () => {
    if (selectedDepartment) {
      dispatch(deleteDepartmentById(selectedDepartment.department_id)).then(() => {
        setConfirmDelete(false);
        setActiveTab('overview');
      });
    }
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (selectedDepartment) {
      const dataToSubmit = selectedSearchUser ? {
        user_id: selectedSearchUser.user_id || selectedSearchUser.id
      } : adminForm;
      
      dispatch(addAdminToDepartment({
        departmentId: selectedDepartment.department_id,
        adminData: dataToSubmit
      })).then(() => {
        setAddAdminModal(false);
        setAdminForm({
          email: '',
          full_name: '',
          password: ''
        });
        setSelectedSearchUser(null);
      });
    }
  };

  const handleRemoveAdmin = (email) => {
    if (selectedDepartment && window.confirm("Are you sure you want to remove this admin?")) {
      dispatch(removeAdminFromDepartment({
        departmentId: selectedDepartment.department_id,
        email
      }));
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (selectedDepartment) {
      const dataToSubmit = selectedSearchUser ? {
        user_id: selectedSearchUser.user_id || selectedSearchUser.id
      } : userForm;
      
      dispatch(addUserToDepartment({
        departmentId: selectedDepartment.department_id,
        userData: dataToSubmit
      })).then(() => {
        setAddUserModal(false);
        setUserForm({
          email: '',
          full_name: '',
          password: ''
        });
        setSelectedSearchUser(null);
      });
    }
  };

  const handleRemoveUser = (email) => {
    if (selectedDepartment && window.confirm("Are you sure you want to remove this user?")) {
      dispatch(removeUserFromDepartment({
        departmentId: selectedDepartment.department_id,
        email
      }));
    }
  };

  const openEditModal = () => {
    if (selectedDepartment) {
      setDepartmentForm({
        name: selectedDepartment.name,
        description: selectedDepartment.description
      });
      setEditDepartmentModal(true);
    }
  };

  // Check if user is an admin of the selected department
  const isAdmin = () => {
    if (!user || !selectedDepartment) return false;
    if (user.is_root_admin) return true;
    
    return selectedDepartment.admins?.some(admin => admin.user_id === user.user_id);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Departments Management</h2>
        <Button onClick={() => setCreateDepartmentModal(true)}>Create New Department</Button>
      </div>
      
      {loading ? (
        <p>Loading departments...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => (
            <div 
              key={department.department_id}
              className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
              onClick={() => handleSelectDepartment(department.department_id)}
            >
              <h3 className="text-lg font-medium">{department.name}</h3>
              <p className="text-gray-600 text-sm">{department.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Created: {new Date(department.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          
          {departments.length === 0 && (
            <p className="col-span-full text-center py-8 text-gray-500">No departments found</p>
          )}
        </div>
      )}
    </div>
  );

  const renderDetailsTab = () => {
    if (!selectedDepartment) return <p>Please select a department first</p>;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{selectedDepartment.name}</h2>
          <div className="flex space-x-2">
            <Button onClick={() => setActiveTab('overview')}>Back to List</Button>
            {isAdmin() && (
              <>
                <Button onClick={openEditModal}>Edit</Button>
                <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete</Button>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Department Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{selectedDepartment.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{selectedDepartment.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p>{new Date(selectedDepartment.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p>{new Date(selectedDepartment.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Department Administrators</h3>
            {isAdmin() && (
              <Button onClick={() => setAddAdminModal(true)} size="sm">Add Admin</Button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  {isAdmin() && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedDepartment.admins?.map((admin) => (
                  <tr key={admin.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                    {isAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleRemoveAdmin(admin.email)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {(!selectedDepartment.admins || selectedDepartment.admins.length === 0) && (
                  <tr>
                    <td colSpan={isAdmin() ? 3 : 2} className="px-6 py-4 text-center">No admins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Department Users</h3>
            {isAdmin() && (
              <Button onClick={() => setAddUserModal(true)} size="sm">Add User</Button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  {isAdmin() && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedDepartment.users?.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    {isAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleRemoveUser(user.email)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {(!selectedDepartment.users || selectedDepartment.users.length === 0) && (
                  <tr>
                    <td colSpan={isAdmin() ? 3 : 2} className="px-6 py-4 text-center">No users found</td>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex border-b">
          <button 
            className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Departments Overview
          </button>
          {selectedDepartment && (
            <button 
              className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              {selectedDepartment.name} Details
            </button>
          )}
        </div>
      </div>
      
      {activeTab === 'overview' ? renderOverviewTab() : renderDetailsTab()}
      
      {/* Create Department Modal */}
      <Modal 
        isOpen={createDepartmentModal} 
        onClose={() => setCreateDepartmentModal(false)}
        title="Create New Department"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <FormInput
            label="Name"
            id="department-name"
            value={departmentForm.name}
            onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
            required
          />
          <FormInput
            label="Description"
            id="department-description"
            value={departmentForm.description}
            onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
            required
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setCreateDepartmentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Edit Department Modal */}
      <Modal 
        isOpen={editDepartmentModal} 
        onClose={() => setEditDepartmentModal(false)}
        title="Edit Department"
      >
        <form onSubmit={handleEditDepartment} className="space-y-4">
          <FormInput
            label="Name"
            id="department-edit-name"
            value={departmentForm.name}
            onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
            required
          />
          <FormInput
            label="Description"
            id="department-edit-description"
            value={departmentForm.description}
            onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
            required
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setEditDepartmentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Add Admin Modal */}
      <Modal 
        isOpen={addAdminModal} 
        onClose={() => setAddAdminModal(false)}
        title="Add Department Admin"
      >
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Find Existing User</h3>
            <UserSearch 
              onSelectUser={(user) => {
                setSelectedSearchUser(user);
                setAdminForm({
                  email: user.email,
                  full_name: user.full_name || user.username,
                  password: ''
                });
              }}
              placeholder="Search for existing users..."
              labelText="Search Users"
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              {selectedSearchUser ? 'Selected User' : 'Or Create New User'}
            </h3>
            <FormInput
              label="Email"
              id="admin-email"
              type="email"
              value={adminForm.email}
              onChange={(e) => {
                setAdminForm({...adminForm, email: e.target.value});
                setSelectedSearchUser(null);
              }}
              required
              disabled={!!selectedSearchUser}
            />
            <FormInput
              label="Full Name"
              id="admin-name"
              value={adminForm.full_name}
              onChange={(e) => {
                setAdminForm({...adminForm, full_name: e.target.value});
                setSelectedSearchUser(null);
              }}
              required
              disabled={!!selectedSearchUser}
            />
            {!selectedSearchUser && (
              <FormInput
                label="Password (only needed for new users)"
                id="admin-password"
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                placeholder="Enter password for new user"
              />
            )}
          </div>
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
      
      {/* Add User Modal */}
      <Modal 
        isOpen={addUserModal} 
        onClose={() => setAddUserModal(false)}
        title="Add User to Department"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Find Existing User</h3>
            <UserSearch 
              onSelectUser={(user) => {
                setSelectedSearchUser(user);
                setUserForm({
                  email: user.email,
                  full_name: user.full_name || user.username,
                  password: ''
                });
              }}
              placeholder="Search for existing users..."
              labelText="Search Users"
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              {selectedSearchUser ? 'Selected User' : 'Or Create New User'}
            </h3>
            <FormInput
              label="Email"
              id="user-email"
              type="email"
              value={userForm.email}
              onChange={(e) => {
                setUserForm({...userForm, email: e.target.value});
                setSelectedSearchUser(null);
              }}
              required
              disabled={!!selectedSearchUser}
            />
            <FormInput
              label="Full Name"
              id="user-name"
              value={userForm.full_name}
              onChange={(e) => {
                setUserForm({...userForm, full_name: e.target.value});
                setSelectedSearchUser(null);
              }}
              required
              disabled={!!selectedSearchUser}
            />
            {!selectedSearchUser && (
              <FormInput
                label="Password (only needed for new users)"
                id="user-password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                placeholder="Enter password for new user"
              />
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setAddUserModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Confirm Delete Modal */}
      <Modal 
        isOpen={confirmDelete} 
        onClose={() => setConfirmDelete(false)}
        title="Delete Department"
      >
        <div className="p-4">
          <p className="mb-4">Are you sure you want to delete the department "{selectedDepartment?.name}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteDepartment} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Department'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsDashboard;
