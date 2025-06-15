'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateUser } from '../../hooks/useUser';
import { useGetAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '../../hooks/useAddress';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';

const ProfilePage = () => {
    const { user, checkAuthStatus, syncUserData } = useAuth();
    const { updateUser, loading: userLoading, error: userError } = useUpdateUser();
    const { data: addresses, fetchAddresses, loading: addressLoading } = useGetAddresses();
    const { createAddress, loading: createAddressLoading } = useCreateAddress();
    const { updateAddress, loading: updateAddressLoading } = useUpdateAddress();
    const { deleteAddress } = useDeleteAddress();

    const [activeTab, setActiveTab] = useState('personal');
    const [editing, setEditing] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: '',
        additional: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
        }
    }, [user]);

    useEffect(() => {
        fetchAddresses();
    }, []);

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await updateUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            });

            await syncUserData();

            setEditing(false);
            setSuccessMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error);
            setErrorMessage(`Failed to update profile: ${error.message}`);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const addressPayload = {
                street: addressForm.street,
                city: addressForm.city,
                postalCode: addressForm.postalCode,
                country: addressForm.country,
            };

            if (addressForm.additional && addressForm.additional.trim()) {
                addressPayload.additional = addressForm.additional;
            }

            if (editingAddress) {
                await updateAddress(editingAddress.id, addressPayload);
                setSuccessMessage('Address updated successfully!');
            } else {
                await createAddress(addressPayload);
                setSuccessMessage('Address added successfully!');
            }

            await fetchAddresses();
            setShowAddressForm(false);
            setEditingAddress(null);
            setAddressForm({
                street: '',
                city: '',
                postalCode: '',
                country: '',
                additional: '',
            });
        } catch (error) {
            console.error('Address operation failed:', error);
            setErrorMessage(`Failed to ${editingAddress ? 'update' : 'add'} address: ${error.message}`);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setAddressForm({
            street: address.street || '',
            city: address.city || '',
            postalCode: address.zip || '',
            country: address.country || '',
            additional: address.additional || '',
        });
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            setErrorMessage('');
            setSuccessMessage('');

            try {
                await deleteAddress(addressId);
                await fetchAddresses();
                setSuccessMessage('Address deleted successfully!');
            } catch (error) {
                console.error('Delete address failed:', error);
                setErrorMessage(`Failed to delete address: ${error.message}`);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        });
        setEditing(false);
        setErrorMessage('');
    };

    const handleCancelAddress = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
            street: '',
            city: '',
            postalCode: '',
            country: '',
            additional: '',
        });
        setErrorMessage('');
    };

    const tabs = [
        { id: 'personal', name: 'Personal Info', icon: '👤' },
        { id: 'addresses', name: 'Addresses', icon: '📍' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage your account settings and preferences.
                            </p>
                        </div>

                        {successMessage && (
                            <div className="mb-6 rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">{successMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-6 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white shadow rounded-lg">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.name}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6">
                                {activeTab === 'personal' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                                            {!editing && (
                                                <button
                                                    onClick={() => setEditing(true)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {editing ? (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="lastName"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>

                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleCancel}
                                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={userLoading}
                                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                    >
                                                        {userLoading ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-500">First Name</label>
                                                        <p className="mt-1 text-sm text-gray-900">{user?.firstName || 'Not set'}</p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-500">Last Name</label>
                                                        <p className="mt-1 text-sm text-gray-900">{user?.lastName || 'Not set'}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                                                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500">Account Status</label>
                                                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500">Member Since</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'addresses' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
                                            <button
                                                onClick={() => setShowAddressForm(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Add Address
                                            </button>
                                        </div>

                                        {addressLoading ? (
                                            <div className="animate-pulse space-y-4">
                                                <div className="h-32 bg-gray-200 rounded"></div>
                                                <div className="h-32 bg-gray-200 rounded"></div>
                                            </div>
                                        ) : addresses && addresses.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {addresses.map((address) => (
                                                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <h4 className="text-sm font-medium text-gray-900">
                                                                        Address
                                                                    </h4>
                                                                </div>
                                                                <div className="mt-2 text-sm text-gray-600">
                                                                    <p>{address.street}</p>
                                                                    {address.additional && <p>{address.additional}</p>}
                                                                    <p>{address.city} {address.zip}</p>
                                                                    <p>{address.country}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2 ml-4">
                                                                <button
                                                                    onClick={() => handleEditAddress(address)}
                                                                    className="text-blue-600 hover:text-blue-500"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                    className="text-red-600 hover:text-red-500"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                                                <p className="mt-1 text-sm text-gray-500">Get started by adding your first address.</p>
                                            </div>
                                        )}

                                        {showAddressForm && (
                                            <div className="fixed inset-0 z-50 overflow-y-auto">
                                                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                                                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                                        <form onSubmit={handleAddressSubmit}>
                                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                                                </h3>

                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                                                        <input
                                                                            type="text"
                                                                            name="street"
                                                                            value={addressForm.street}
                                                                            onChange={handleAddressChange}
                                                                            required
                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Additional Address Info (Optional)</label>
                                                                        <input
                                                                            type="text"
                                                                            name="additional"
                                                                            value={addressForm.additional}
                                                                            onChange={handleAddressChange}
                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                            placeholder="Apartment, suite, etc."
                                                                        />
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700">City</label>
                                                                            <input
                                                                                type="text"
                                                                                name="city"
                                                                                value={addressForm.city}
                                                                                onChange={handleAddressChange}
                                                                                required
                                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                                                            <input
                                                                                type="text"
                                                                                name="postalCode"
                                                                                value={addressForm.postalCode}
                                                                                onChange={handleAddressChange}
                                                                                required
                                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                                                        <input
                                                                            type="text"
                                                                            name="country"
                                                                            value={addressForm.country}
                                                                            onChange={handleAddressChange}
                                                                            required
                                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                            placeholder="e.g., FR, US, CA"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                                <button
                                                                    type="submit"
                                                                    disabled={createAddressLoading || updateAddressLoading}
                                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                                                >
                                                                    {(createAddressLoading || updateAddressLoading)
                                                                        ? (editingAddress ? 'Updating...' : 'Adding...')
                                                                        : (editingAddress ? 'Update' : 'Add') + ' Address'
                                                                    }
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleCancelAddress}
                                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800">
                                                        Password Management Coming Soon
                                                    </h3>
                                                    <div className="mt-2 text-sm text-yellow-700">
                                                        <p>Password change functionality will be available in a future update. For now, contact support if you need to reset your password.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <h4 className="text-base font-medium text-gray-900 mb-4">Login Sessions</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">Current Session</div>
                                                            <div className="text-sm text-gray-500">Active now</div>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preferences' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Preferences</h3>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-base font-medium text-gray-900 mb-4">Email Notifications</h4>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">Order Updates</div>
                                                            <div className="text-sm text-gray-500">Get notified about your order status</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="bg-blue-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            role="switch"
                                                            aria-checked="true"
                                                        >
                                                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">Security Alerts</div>
                                                            <div className="text-sm text-gray-500">Get notified about security updates</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="bg-blue-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            role="switch"
                                                            aria-checked="true"
                                                        >
                                                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">Marketing Emails</div>
                                                            <div className="text-sm text-gray-500">Receive updates about new products and offers</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            role="switch"
                                                            aria-checked="false"
                                                        >
                                                            <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-base font-medium text-gray-900 mb-4">Display Settings</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Theme</label>
                                                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                            <option>Light</option>
                                                            <option>Dark</option>
                                                            <option>System</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Language</label>
                                                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                            <option>English</option>
                                                            <option>French</option>
                                                            <option>Spanish</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;
