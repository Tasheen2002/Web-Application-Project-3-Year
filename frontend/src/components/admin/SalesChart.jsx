import { BarChart3 } from 'lucide-react';

const SalesChart = ({ data = [], period = 'week' }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <select className="text-sm border border-gray-300 rounded px-3 py-1">
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 90 days</option>
        </select>
      </div>

      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Sales Chart</p>
          <p className="text-sm text-gray-500 mt-1">
            Chart implementation with Chart.js or Recharts can be added here
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;