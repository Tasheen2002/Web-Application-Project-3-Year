import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { orderAPI } from "../../services/api";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["userOrders", statusFilter],
    () =>
      orderAPI.getOrders({
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    {
      select: (response) => {
        // Transform the backend response to match frontend expectations
        return (response.data.orders || []).map((order) => ({
          ...order,
          status: order.orderStatus || order.status,
          totalAmount: order.totalPrice || order.totalAmount,
          items: order.orderItems || order.items || [],
        }));
      },
    }
  );

  // Cancel order mutation
  const cancelOrderMutation = useMutation(
    (orderId) => orderAPI.cancelOrder(orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userOrders"]);
        toast.success("Order cancelled successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to cancel order");
      },
    }
  );

  const handleCancelOrder = (orderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              My Orders
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => refetch()}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error ? (
            <div className="card text-center py-12">
              <div className="text-red-600 mb-4">
                <XCircle className="h-12 w-12 mx-auto mb-4" />
                <p>Failed to load orders. Please try again.</p>
              </div>
              <button onClick={() => refetch()} className="btn-primary">
                Retry
              </button>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="card">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          Total:{" "}
                          <span className="font-semibold">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div className="flex space-x-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                        {(order.status === "delivered" ||
                          order.status === "shipped") && (
                          <button className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                            <Download className="h-4 w-4 mr-1" />
                            Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={
                            item.product.images?.[0]?.url ||
                            "/placeholder-product.jpg"
                          }
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 3 && (
                      <div className="text-center pt-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          +{order.items.length - 3} more items
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Order Progress */}
                  {order.status !== "cancelled" && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              [
                                "pending",
                                "processing",
                                "shipped",
                                "delivered",
                              ].includes(order.status)
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="text-gray-600">Order Placed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              ["processing", "shipped", "delivered"].includes(
                                order.status
                              )
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="text-gray-600">Processing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              ["shipped", "delivered"].includes(order.status)
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="text-gray-600">Shipped</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="text-gray-600">Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tracking Information */}
                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Tracking Number
                          </p>
                          <p className="text-sm text-blue-700">
                            {order.trackingNumber}
                          </p>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Track Package
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.status === "pending" && (
                      <button
                        onClick={(e) => handleCancelOrder(order._id, e)}
                        disabled={cancelOrderMutation.isLoading}
                        className="btn-danger text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelOrderMutation.isLoading
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <>
                        <button className="btn-secondary text-sm py-2 px-4">
                          Return Items
                        </button>
                        <button className="btn-secondary text-sm py-2 px-4">
                          Leave Review
                        </button>
                      </>
                    )}
                    {order.status === "delivered" && (
                      <button className="btn-primary text-sm py-2 px-4">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                No orders found
              </h2>
              <p className="text-gray-600 mb-6">
                {statusFilter === "all"
                  ? "You haven't placed any orders yet."
                  : `No orders with status "${statusFilter}" found.`}
              </p>
              <Link to="/products" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
