"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Menu, HeartPulse } from "lucide-react";

export default function FrontendDashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 font-sans pt-20">
            {/* Dynamic Sidebar Server/Client Hydration */}
            <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative w-full min-w-0">
                
                {/* Mobile Topbar */}
                <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                            <HeartPulse size={18} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">Portal</span>
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Dashboard Page Content wrapper */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
