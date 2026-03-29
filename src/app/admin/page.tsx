import { BarChart3, Users, MousePointerClick, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-6 p-6 md:p-10 max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back, Admin</h1>
                    <p className="text-gray-500 dark:text-gray-400">Here's what's happening on Nirvaar Care today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Views", value: "8,432", change: "+12.5%", icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "Active Users", value: "1,249", change: "+5.2%", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                    { label: "Total Clicks", value: "24,802", change: "+18.2%", icon: MousePointerClick, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
                    { label: "Conversion Rate", value: "4.6%", change: "+2.1%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="text-emerald-500 font-medium">{stat.change}</span>
                                <span className="text-gray-400 ml-2">vs last week</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm min-h-[400px] flex flex-col justify-center items-center">
                    <BarChart3 className="text-gray-200 dark:text-gray-800 w-32 h-32 mb-4" />
                    <p className="text-gray-400 font-medium">Analytics Chart Module</p>
                    <p className="text-xs text-gray-500">(Connect Google Analytics)</p>
                </div>
                <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">New Emergency Call Logged</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{`${i * 15} minutes ago`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
