import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { adminAPI } from "../../services/api";
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Ban,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  MoreVertical,
  UserPlus,
  Download,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const UsersManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // Fetch users
  const { data: usersData, isLoading } = useQuery(
    [
      "adminUsers",
      { search: searchTerm, role: roleFilter, status: statusFilter },
    ],
    () =>
      adminAPI.getUsers({
        search: searchTerm || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 50,
      }),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    }
  );

  // Update user status mutation
  const updateUserStatusMutation = useMutation(
    ({ userId, status }) => adminAPI.updateUserStatus(userId, status),
    {
      // Optimistic update
      onMutate: async ({ userId, status }) => {
        await queryClient.cancelQueries("adminUsers");
        const previousData = queryClient.getQueryData([
          "adminUsers",
          { search: searchTerm, role: roleFilter, status: statusFilter },
        ]);
        queryClient.setQueryData(
          [
            "adminUsers",
            { search: searchTerm, role: roleFilter, status: statusFilter },
          ],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              users: old.users.map((u) =>
                u._id === userId ? { ...u, status } : u
              ),
            };
          }
        );
        return { previousData };
      },
      onSuccess: () => {
        queryClient.invalidateQueries("adminUsers");
        toast.success("User status updated successfully");
      },
      onError: (error, _vars, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            [
              "adminUsers",
              { search: searchTerm, role: roleFilter, status: statusFilter },
            ],
            context.previousData
          );
        }
        toast.error(
          error.response?.data?.message || "Failed to update user status"
        );
      },
    }
  );

  // Delete user mutation
  const deleteUserMutation = useMutation(
    (userId) => adminAPI.deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("adminUsers");
        toast.success("User deleted successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete user");
      },
    }
  );

  // Create user mutation
  const createUserMutation = useMutation(
    (userData) => adminAPI.createUser(userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("adminUsers");
        setShowCreateUser(false);
        setNewUser({ name: "", email: "", password: "", role: "user" });
        toast.success("User created successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create user");
      },
    }
  );

  // Edit user modal state
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Edit user mutation
  const editUserMutation = useMutation(
    ({ id, data }) => adminAPI.updateUser(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("adminUsers");
        setShowEditUser(false);
        setEditUser(null);
        toast.success("User updated successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update user");
      },
    }
  );

  const handleEditUser = (user) => {
    setEditUser({ ...user });
    setShowEditUser(true);
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    if (!editUser) return;
    const { _id, name, email, phone, role, status } = editUser;
    editUserMutation.mutate({
      id: _id,
      data: { name, email, phone, role, status },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <User className="h-4 w-4 text-gray-500" />;
      case "banned":
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    updateUserStatusMutation.mutate({ userId, status: newStatus });
  };

  const handleDeleteUser = (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`
      )
    ) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    createUserMutation.mutate(newUser);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>
      {showCreateUser && (
        <form
          onSubmit={handleCreateUser}
          className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col gap-3 max-w-lg"
        >
          <div className="flex gap-3">
            <input
              className="input-field flex-1"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <input
              className="input-field flex-1"
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
            />
          </div>
          <div className="flex gap-3">
            <input
              className="input-field flex-1"
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
            />
            <select
              className="input-field flex-1"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowCreateUser(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createUserMutation.isLoading}
            >
              {createUserMutation.isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">
            Manage customer accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </button>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowCreateUser((v) => !v)}
          >
            <UserPlus className="h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {usersData?.pagination?.total || 0}
              </p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {usersData?.activeUsers || 0}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">New This Month</p>
              <p className="text-2xl font-bold text-blue-600">
                {usersData?.users?.filter((u) => {
                  const userDate = new Date(u.createdAt);
                  const now = new Date();
                  return (
                    userDate.getMonth() === now.getMonth() &&
                    userDate.getFullYear() === now.getFullYear()
                  );
                }).length || 0}
              </p>
            </div>
            <UserPlus className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Admins</p>
              <p className="text-2xl font-bold text-purple-600">
                {usersData?.users?.filter((u) => u.role === "admin").length ||
                  0}
              </p>
            </div>
            <User className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Roles</option>
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {usersData?.totalUsers || 0} users
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : usersData?.users?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersData.users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500">
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status || "active"}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value)
                        }
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                          user.status || "active"
                        )}`}
                        disabled={updateUserStatusMutation.isLoading}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit User"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  User Details - {selectedUser.name}
                </h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-900">{selectedUser.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <p className="text-gray-900">
                          {selectedUser.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedUser.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {selectedUser.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            selectedUser.status || "active"
                          )}`}
                        >
                          {getStatusIcon(selectedUser.status || "active")}
                          <span className="ml-1 capitalize">
                            {selectedUser.status || "active"}
                          </span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Join Date
                        </label>
                        <p className="text-gray-900">
                          {new Date(
                            selectedUser.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  {selectedUser.addresses &&
                    selectedUser.addresses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Addresses
                        </h3>
                        <div className="space-y-3">
                          {selectedUser.addresses.map((address, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  {address.fullName}
                                </span>
                                {address.isDefault && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {address.address}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {address.city}, {address.state}{" "}
                                {address.zipCode}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {address.country}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Statistics and Actions */}
                <div className="space-y-6">
                  {/* User Statistics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Statistics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ShoppingBag className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            Total Orders
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            Total Spent
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">$0.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            Last Login
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {selectedUser.lastLogin
                            ? new Date(
                                selectedUser.lastLogin
                              ).toLocaleDateString()
                            : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Quick Actions
                    </h3>
                    <button className="w-full btn-primary">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </button>
                    <button
                      className="w-full btn-secondary"
                      onClick={() => handleEditUser(selectedUser)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit User
                    </button>
                    <button className="w-full btn-secondary">
                      <Eye className="h-4 w-4 mr-2" />
                      View Orders
                    </button>
                    {selectedUser.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(selectedUser)}
                        className="w-full btn-danger"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <button
                onClick={() => {
                  setShowEditUser(false);
                  setEditUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="flex gap-3">
                <input
                  className="input-field flex-1"
                  placeholder="Name"
                  value={editUser.name || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  required
                />
                <input
                  className="input-field flex-1"
                  placeholder="Email"
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-3">
                <input
                  className="input-field flex-1"
                  placeholder="Phone"
                  value={editUser.phone || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                />
                <select
                  className="input-field flex-1"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <select
                  className="input-field flex-1"
                  value={editUser.status || "active"}
                  onChange={(e) =>
                    setEditUser({ ...editUser, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowEditUser(false);
                    setEditUser(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={editUserMutation.isLoading}
                >
                  {editUserMutation.isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
