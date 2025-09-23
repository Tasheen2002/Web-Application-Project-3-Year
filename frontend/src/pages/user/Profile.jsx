import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { authAPI, userAPI, uploadAPI } from '../../services/api';
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const passwordForm = useForm();
  const addressForm = useForm();

  // Get user addresses
  const { data: addresses, isLoading: addressesLoading } = useQuery(
    'userAddresses',
    () => userAPI.getAddresses(),
    {
      select: (response) => response.data.addresses,
    }
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data) => authAPI.updateProfile(data),
    {
      onSuccess: (response) => {
        updateUser(response.data.user);
        setIsEditingProfile(false);
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  // Change password mutation
  const changePasswordMutation = useMutation(
    (data) => authAPI.changePassword(data),
    {
      onSuccess: () => {
        setIsEditingPassword(false);
        passwordForm.reset();
        toast.success('Password changed successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to change password');
      }
    }
  );

  // Add address mutation
  const addAddressMutation = useMutation(
    (data) => userAPI.addAddress(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userAddresses');
        setShowAddressForm(false);
        addressForm.reset();
        toast.success('Address added successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add address');
      }
    }
  );

  // Update address mutation
  const updateAddressMutation = useMutation(
    ({ id, data }) => userAPI.updateAddress(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userAddresses');
        setEditingAddress(null);
        addressForm.reset();
        toast.success('Address updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update address');
      }
    }
  );

  // Delete address mutation
  const deleteAddressMutation = useMutation(
    (id) => userAPI.deleteAddress(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userAddresses');
        toast.success('Address deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete address');
      }
    }
  );

  // Set default address mutation
  const setDefaultAddressMutation = useMutation(
    (id) => userAPI.setDefaultAddress(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userAddresses');
        toast.success('Default address updated');
      }
    }
  );

  const handleProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handlePasswordSubmit = (data) => {
    changePasswordMutation.mutate(data);
  };

  const handleAddressSubmit = (data) => {
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress._id, data });
    } else {
      addAddressMutation.mutate(data);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
    addressForm.reset(address);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddressMutation.mutate(id);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Profile Information */}
              {activeTab === 'profile' && (
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="btn-secondary"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditingProfile ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...profileForm.register('name', { required: 'Name is required' })}
                            className="input-field pl-10"
                          />
                        </div>
                        {profileForm.formState.errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {profileForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...profileForm.register('email', {
                              required: 'Email is required',
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Please enter a valid email'
                              }
                            })}
                            className="input-field pl-10"
                          />
                        </div>
                        {profileForm.formState.errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {profileForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...profileForm.register('phone')}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isLoading}
                          className="btn-primary"
                        >
                          {updateProfileMutation.isLoading ? (
                            <div className="loading-spinner h-4 w-4 mr-2"></div>
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Member Since
                          </label>
                          <p className="text-gray-900">
                            {new Date(user?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Saved Addresses
                      </h2>
                      <button
                        onClick={() => {
                          setShowAddressForm(true);
                          setEditingAddress(null);
                          addressForm.reset();
                        }}
                        className="btn-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </button>
                    </div>

                    {addressesLoading ? (
                      <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="animate-pulse p-4 border rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : addresses && addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div
                            key={address._id}
                            className="p-4 border rounded-lg relative"
                          >
                            {address.isDefault && (
                              <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                            <div className="mb-2">
                              <h4 className="font-medium text-gray-900">
                                {address.fullName}
                              </h4>
                              <p className="text-gray-600">
                                {address.address}
                              </p>
                              <p className="text-gray-600">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex space-x-2">
                              {!address.isDefault && (
                                <button
                                  onClick={() => setDefaultAddressMutation.mutate(address._id)}
                                  className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                  Set as Default
                                </button>
                              )}
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="text-sm text-gray-600 hover:text-gray-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address._id)}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No addresses saved yet</p>
                      </div>
                    )}
                  </div>

                  {/* Add/Edit Address Form */}
                  {showAddressForm && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            {...addressForm.register('fullName', { required: 'Full name is required' })}
                            className="input-field"
                            placeholder="Full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            {...addressForm.register('address', { required: 'Address is required' })}
                            className="input-field"
                            placeholder="Street address"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              {...addressForm.register('city', { required: 'City is required' })}
                              className="input-field"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State
                            </label>
                            <input
                              {...addressForm.register('state', { required: 'State is required' })}
                              className="input-field"
                              placeholder="State"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code
                            </label>
                            <input
                              {...addressForm.register('zipCode', { required: 'ZIP code is required' })}
                              className="input-field"
                              placeholder="ZIP code"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <select
                              {...addressForm.register('country', { required: 'Country is required' })}
                              className="input-field"
                            >
                              <option value="">Select Country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="UK">United Kingdom</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            disabled={addAddressMutation.isLoading || updateAddressMutation.isLoading}
                            className="btn-primary"
                          >
                            {(addAddressMutation.isLoading || updateAddressMutation.isLoading) ? (
                              <div className="loading-spinner h-4 w-4 mr-2"></div>
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
                            {editingAddress ? 'Update Address' : 'Add Address'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddress(null);
                              addressForm.reset();
                            }}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Security Settings
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Password</h3>
                          <p className="text-sm text-gray-600">
                            Change your account password
                          </p>
                        </div>
                        <button
                          onClick={() => setIsEditingPassword(!isEditingPassword)}
                          className="btn-secondary"
                        >
                          {isEditingPassword ? 'Cancel' : 'Change Password'}
                        </button>
                      </div>

                      {isEditingPassword && (
                        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
                              type="password"
                              className="input-field"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              {...passwordForm.register('newPassword', {
                                required: 'New password is required',
                                minLength: {
                                  value: 6,
                                  message: 'Password must be at least 6 characters'
                                }
                              })}
                              type="password"
                              className="input-field"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              {...passwordForm.register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                  value === passwordForm.watch('newPassword') || 'Passwords do not match'
                              })}
                              type="password"
                              className="input-field"
                            />
                          </div>

                          <div className="flex space-x-4">
                            <button
                              type="submit"
                              disabled={changePasswordMutation.isLoading}
                              className="btn-primary"
                            >
                              {changePasswordMutation.isLoading ? (
                                <div className="loading-spinner h-4 w-4 mr-2"></div>
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Update Password
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingPassword(false);
                                passwordForm.reset();
                              }}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-800">Two-factor authentication</span>
                          </div>
                          <span className="text-sm text-green-600">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span className="text-sm text-gray-800">Login notifications</span>
                          </div>
                          <span className="text-sm text-gray-600">Disabled</span>
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
  );
};

export default Profile;