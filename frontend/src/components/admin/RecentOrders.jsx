import { Link } from 'react-router-dom';

const RecentOrders = ({ orders = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.slice(0, 5).map((order) => (
            <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">#{order._id.slice(-8)}</p>
                <p className="text-sm text-gray-600">{order.user?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No recent orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;