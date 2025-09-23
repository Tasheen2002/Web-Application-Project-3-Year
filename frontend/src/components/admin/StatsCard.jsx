const StatsCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change} from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;