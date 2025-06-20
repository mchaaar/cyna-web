'use client';

import { useState, useEffect } from 'react';
import { useGetUsers, useDeleteUser } from '../hooks/useUser';
import UserCreateModal from './UserCreateModal';
import UserEditModal from './UserEditModal';
import LoadingSpinner from './LoadingSpinner';

export default function AdminTable() {
  const [users, setUsers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { data: usersData, loading: usersLoading, error: usersError, fetchUsers } = useGetUsers();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (usersData) {
      const allUsers =
        usersData.member ||
        usersData['hydra:member'] ||
        (Array.isArray(usersData) ? usersData : []);
      setUsers(allUsers);
    }
  }, [usersData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        showMessage('success', 'User deleted successfully');
        await fetchUsers();
      } catch (error) {
        showMessage('error', error.message || 'Failed to delete user');
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserCreated = () => {
    setIsCreateModalOpen(false);
    showMessage('success', 'User created successfully');
    fetchUsers();
  };

  const handleUserUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    showMessage('success', 'User updated successfully');
    fetchUsers();
  };

  const getRoleName = (role) => {
    switch (role) {
      case 0:
        return 'User';
      case 1:
        return 'Admin';
      default:
        return 'Unknown';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 0:
        return 'bg-blue-100 text-blue-800';
      case 1:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (usersLoading) {
    return <LoadingSpinner />;
  }

  if (usersError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading users: {usersError}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Users Management</h3>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.firstName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.email?.split('@')[0]
                        }
                      </div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {getRoleName(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteLoading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleUserCreated}
        onError={(error) => showMessage('error', error)}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleUserUpdated}
        onError={(error) => showMessage('error', error)}
      />
    </div>
  );
}
