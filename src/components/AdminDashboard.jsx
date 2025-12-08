import React from 'react';
import AdminNavbar from './AdminNavbar';
import { Users, Building, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600 font-medium">
                <TrendingUp size={14} />
                <span>{trend}</span>
                <span className="text-gray-400 font-normal ml-1">vs last month</span>
            </div>
        )}
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />

            <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="mt-2 text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Users"
                        value="152"
                        icon={Users}
                        color="bg-blue-500"
                        trend="+12%"
                    />
                    <StatCard
                        title="Active Cabins"
                        value="45"
                        icon={Building}
                        color="bg-emerald-500"
                        trend="+3"
                    />
                    <StatCard
                        title="Total Bookings"
                        value="1,240"
                        icon={Calendar}
                        color="bg-indigo-500"
                        trend="+18%"
                    />
                    <StatCard
                        title="Revenue"
                        value="$48.2k"
                        icon={DollarSign}
                        color="bg-violet-500"
                        trend="+8.4%"
                    />
                </div>

                {/* Recent Activity / Placeholder Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Area Placeholder */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <span className="text-gray-400 font-medium">Chart Visualization Placeholder</span>
                        </div>
                    </div>

                    {/* Pending Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Actions</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">New booking for Cabin A{i}</p>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;