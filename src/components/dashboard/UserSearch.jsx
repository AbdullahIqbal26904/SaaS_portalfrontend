import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '@/redux/slices/usersSlice';
import { debounce } from 'lodash';
import FormInput from '@/components/common/FormInput';

const UserSearch = ({ onSelectUser, placeholder = "Search users...", labelText = "User Search" }) => {
  const dispatch = useDispatch();
  const { searchResults, searching, pagination, error } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  // Handle debounced search to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(searchUsers({ query, page: 1, limit: 10 }));
      setPage(1);
    }, 500),
    [dispatch]
  );
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  // Handle pagination
  const handleLoadMore = () => {
    if (page < Math.ceil(pagination.total / pagination.limit)) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(searchUsers({ query: searchTerm, page: nextPage, limit: 10 }));
    }
  };
  
  // Handle user selection
  const handleSelectUser = (user) => {
    if (onSelectUser) {
      onSelectUser(user);
      setSearchTerm(''); // Clear search after selection
    }
  };
  
  return (
    <div className="user-search w-full">
      <FormInput
        type="text"
        name="userSearch"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        labelText={labelText}
      />
      
      {searching && (
        <div className="my-3 text-center">
          <span className="text-gray-600">Searching...</span>
        </div>
      )}
      
      {error && (
        <div className="my-3 text-center text-red-500">
          {error.message || 'Error searching users'}
        </div>
      )}
      
      {!searching && searchResults.length > 0 && (
        <div className="mt-3 border rounded-md max-h-60 overflow-y-auto">
          <ul className="divide-y">
            {searchResults.map((user) => (
              <li
                key={user.user_id || user.id}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => handleSelectUser(user)}
              >
                <div>
                  <p className="font-medium">{user.full_name || user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {user.is_root_admin 
                    ? 'Root Admin'
                    : user.is_reseller_admin 
                      ? 'Reseller Admin' 
                      : user.is_department_admin 
                        ? 'Dept Admin' 
                        : 'User'}
                </div>
              </li>
            ))}
          </ul>
          
          {pagination.total > searchResults.length && (
            <div className="p-2 text-center">
              <button
                onClick={handleLoadMore}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
      
      {!searching && searchTerm && searchResults.length === 0 && (
        <div className="my-3 text-center text-gray-500">
          No users found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default UserSearch;
