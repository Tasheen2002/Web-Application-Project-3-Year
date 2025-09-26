import { useState } from 'react';
import { useQuery } from 'react-query';
import { adminAPI } from '../../services/api';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3
} from 'lucide-react';

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30');
  const [chartType, setChartType] = useState('revenue');

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery(
    ['analytics', dateRange],
    () => adminAPI.getSalesChart(dateRange),
    {
      select: (response) => response.data,
    }
  );

  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+15.3%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'New Customers',
      value: '324',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Products Sold',
      value: '2,456',
      change: '-2.4%',
      changeType: 'negative',
      icon: Package,
      color: 'text-orange-600'
    }
  ];

  const topProducts = [
    { name: 'iPhone 14 Pro', sales: 124, revenue: '$123,456' },
    { name: 'MacBook Air M2', sales: 89, revenue: '$98,765' },
    { name: 'iPad Pro', sales: 67, revenue: '$67,890' },
    { name: 'AirPods Pro', sales: 156, revenue: '$45,678' },
    { name: 'Apple Watch Series 8', sales: 78, revenue: '$34,567' }
  ];

  const recentActivity = [
    { action: 'New order #12345', user: 'John Doe', time: '2 minutes ago', type: 'order' },
    { action: 'Product "iPhone 14" updated', user: 'Admin', time: '15 minutes ago', type: 'product' },
    { action: 'User registration', user: 'Jane Smith', time: '1 hour ago', type: 'user' },
    { action: 'Payment received #12344', user: 'Mike Johnson', time: '2 hours ago', type: 'payment' },
    { action: 'Inventory alert: Low stock', user: 'System', time: '3 hours ago', type: 'alert' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'product':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'user':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Track your business performance</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
            <div className="flex items-center space-x-2">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-2"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="customers">Customers</option>
              </select>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Sales Chart</h4>
              <p className="text-gray-600 max-w-sm">
                Interactive chart showing {chartType} trends over the selected time period.
                Chart libraries like Chart.js, Recharts, or D3.js can be integrated here.
              </p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.sales} sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {product.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Analytics */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Customers</span>
              <span className="font-medium">324</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Returning Customers</span>
              <span className="font-medium">1,256</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Retention Rate</span>
              <span className="font-medium text-green-600">78.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-medium">$156.78</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Lifetime Value</span>
              <span className="font-medium">$892.45</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-600">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Data */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">45%</div>
            <div className="text-sm text-gray-600">United States</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">28%</div>
            <div className="text-sm text-gray-600">Canada</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">27%</div>
            <div className="text-sm text-gray-600">Other Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;