import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { orderAPI } from "../../services/api";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Download,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
} from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery(["order", id], () => orderAPI.getOrder(id), {
    select: (response) => response.data.order,
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation(() => orderAPI.cancelOrder(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["order", id]);
      queryClient.invalidateQueries(["userOrders"]);
      toast.success("Order cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  const handleCancelOrder = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      cancelOrderMutation.mutate();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-lg">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                          <div className="w-20 h-20 bg-gray-200 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            <div className="card text-center py-12">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The order you're looking for could not be found or you don't
                have permission to view it.
              </p>
              <button
                onClick={() => navigate("/orders")}
                className="btn-primary"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/orders")}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order #{order._id.slice(-8)}
                </h1>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.orderStatus || order.status)}
              <span
                className={`px-3 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(
                  order.orderStatus || order.status
                )}`}
              >
                {order.orderStatus || order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Progress or Cancelled Status */}
              {(order.orderStatus || order.status) === "cancelled" ? (
                <div className="card">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Order Cancelled
                      </h3>
                      <p className="text-gray-600">
                        This order has been cancelled and any charges have been
                        refunded.
                      </p>
                      {order.statusHistory &&
                        order.statusHistory.length > 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            Cancelled on{" "}
                            {new Date(
                              order.statusHistory.find(
                                (h) => h.status === "cancelled"
                              )?.date || order.updatedAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Order Progress
                  </h3>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full mb-2 ${
                            [
                              "pending",
                              "processing",
                              "shipped",
                              "delivered",
                            ].includes(order.orderStatus || order.status)
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-600 text-center">
                          Order
                          <br />
                          Placed
                        </span>
                        {order.createdAt && (
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full mb-2 ${
                            ["processing", "shipped", "delivered"].includes(
                              order.orderStatus || order.status
                            )
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-600 text-center">
                          Processing
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full mb-2 ${
                            ["shipped", "delivered"].includes(
                              order.orderStatus || order.status
                            )
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-600 text-center">
                          Shipped
                        </span>
                        {order.shippingDate && (
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(order.shippingDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full mb-2 ${
                            (order.orderStatus || order.status) === "delivered"
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-600 text-center">
                          Delivered
                        </span>
                        {order.deliveredAt && (
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-200">
                      <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{
                          width:
                            (order.orderStatus || order.status) === "delivered"
                              ? "100%"
                              : (order.orderStatus || order.status) ===
                                "shipped"
                              ? "66%"
                              : (order.orderStatus || order.status) ===
                                "processing"
                              ? "33%"
                              : (order.orderStatus || order.status) ===
                                "pending"
                              ? "0%"
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking Information */}
              {order.trackingNumber && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tracking Information
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Tracking Number
                        </p>
                        <p className="text-lg font-mono text-blue-700">
                          {order.trackingNumber}
                        </p>
                      </div>
                      <button className="btn-primary text-sm">
                        Track Package
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {(order.orderItems || order.items || []).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.product?.name || item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product?._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {item.product?.name || item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Unit Price: ${(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          $
                          {((item.quantity || 0) * (item.price || 0)).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      $
                      {(
                        (order.totalPrice || order.totalAmount) -
                        (order.shippingCost || 0) -
                        (order.taxAmount || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      ${(order.shippingCost || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      ${(order.taxAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  {order.couponCode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Coupon ({order.couponCode})
                      </span>
                      <span className="text-green-600">
                        -${(order.couponDiscount || 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        $
                        {(order.totalPrice || order.totalAmount || 0).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {(order.orderStatus || order.status) === "pending" && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={cancelOrderMutation.isLoading}
                      className="w-full btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelOrderMutation.isLoading
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                  {(order.orderStatus || order.status) === "cancelled" && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 text-center">
                        This order has been cancelled. Any charges have been
                        refunded.
                      </p>
                    </div>
                  )}
                  <button className="w-full btn-secondary">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </button>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress?.name}
                  </p>
                  <p>{order.shippingAddress?.street}</p>
                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}{" "}
                    {order.shippingAddress?.zipCode}
                  </p>
                  <p>{order.shippingAddress?.country}</p>
                  {order.shippingAddress?.phone && (
                    <p className="flex items-center mt-2">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod || "Card"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span
                      className={`font-medium ${
                        order.isPaid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span>Paid On</span>
                      <span className="font-medium">
                        {new Date(order.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              {order.user && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="font-medium text-gray-900">
                      {order.user.name}
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {order.user.email}
                    </p>
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

export default OrderDetail;
