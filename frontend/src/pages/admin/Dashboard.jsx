import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { adminAPI } from "../../services/api";
import StatsCard from "../../components/admin/StatsCard";
import RecentOrders from "../../components/admin/RecentOrders";
import SalesChart from "../../components/admin/SalesChart";
import ProductsManagement from "./ProductsManagement";
import CategoriesManagement from "./CategoriesManagement";
import OrdersManagement from "./OrdersManagement";
import UsersManagement from "./UsersManagement";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Settings,
  Grid,
  List,
  Plus,
} from "lucide-react";

// Dashboard Overview Component
const DashboardOverview = () => {
  const { data: stats, isLoading } = useQuery(
    "dashboardStats",
    () => adminAPI.getDashboardStats(),
    {
      select: (response) => response.data.stats,
    }
  );

  const { data: recentOrders } = useQuery(
    "recentOrders",
    () => adminAPI.getRecentOrders(),
    {
      select: (response) => response.data.orders,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`,
      change: "+12%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toLocaleString() || "0",
      change: "+8%",
      changeType: "positive",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString() || "0",
      change: "+3%",
      changeType: "positive",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      change: "+15%",
      changeType: "positive",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Categories",
      href: "/admin/categories",
      icon: List,
      current: location.pathname.startsWith("/admin/categories"),
    },
    {
      name: "Overview",
      href: "/admin",
      icon: Grid,
      current:
        location.pathname === "/admin" || location.pathname === "/admin/",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      current: location.pathname.startsWith("/admin/products"),
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: location.pathname.startsWith("/admin/orders"),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: location.pathname.startsWith("/admin/users"),
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      current: location.pathname.startsWith("/admin/analytics"),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h2>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.current
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 ${
                          item.current
                            ? "text-blue-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <List className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <h1 className="text-lg font-medium text-gray-900">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<DashboardOverview />} />
                  <Route path="/products" element={<ProductsManagement />} />
                  <Route
                    path="/categories"
                    element={<CategoriesManagement />}
                  />
                  <Route path="/orders" element={<OrdersManagement />} />
                  <Route path="/users" element={<UsersManagement />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// All admin page components are now imported from separate files

export default Dashboard;
