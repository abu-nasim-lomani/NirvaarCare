"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Settings2, Home, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex text-gray-900 dark:text-gray-100 flex-col md:flex-row font-sans overflow-hidden">
            
            {/* Mobile Topbar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50">
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Settings2 className="text-emerald-500 w-5 h-5" /> Nirvaar CMS
                </h2>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-300 hover:text-emerald-600"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed md:relative top-0 left-0 z-40 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-0 md:translate-x-0 md:border-r-0 overflow-hidden"}
                `}
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between min-w-[256px]">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2 block">
                            <Settings2 className="text-emerald-500" /> Nirvaar CMS
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Admin Dashboard Panel</p>
                    </div>
                </div>
                
                <nav className="p-4 space-y-2 flex-grow">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                        <LayoutDashboard size={20} />
                        Overview
                    </Link>
                    <Link href="/admin/customize" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                        <Settings2 size={20} />
                        Customize Homepage
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors font-medium">
                        <Home size={20} />
                        Visit Live Site
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors font-medium text-left">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-auto bg-gray-50 dark:bg-gray-900/50 flex flex-col">
                {/* Desktop Topbar for toggle */}
                <div className="hidden md:flex items-center p-4 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-lg text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>
                </div>
                
                <div className="flex-1 w-full h-full flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
