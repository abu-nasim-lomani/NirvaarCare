"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Settings2, Home, LogOut, Menu, X, Inbox, Users, Building2, ShieldAlert, Activity, FlaskConical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// NOTE: The layout uses self-contained sticky sidebar + scrollable main.
// No overflow-hidden on wrapper to avoid freezing clicks/scroll.

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [role, setRole] = useState<'admin' | 'manager' | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        if (pathname === "/admin/login") return;
        const fetchRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
                setRole(data?.role as any);
            }
        };
        fetchRole();
    }, [pathname, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    // Login page — render children directly, no sidebar/topbar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">

            {/* Mobile Topbar */}
            <div className="md:hidden fixed top-0 inset-x-0 flex items-center justify-between p-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50 h-16">
                <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Settings2 className="text-emerald-500 w-5 h-5" /> Nirvaar CMS
                </h2>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR — sticky on desktop, fixed slide-in on mobile */}
            <aside className={`
                fixed md:sticky md:top-0 top-16 left-0 z-40 h-screen md:h-[100dvh]
                w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
                flex flex-col flex-shrink-0 overflow-y-auto
                transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Settings2 className="text-emerald-500" /> Nirvaar CMS
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase font-semibold tracking-wider">
                        {role === 'manager' ? 'Operations Hub' : 'Admin Panel'}
                    </p>
                </div>

                <nav className="p-4 space-y-1 flex-grow">
                    <Link href={role === 'manager' ? '/admin/manager' : '/admin'} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                        <LayoutDashboard size={20} />
                        {role === 'manager' ? 'Operations Overview' : 'Overview'}
                    </Link>

                    <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                        <Inbox size={20} />
                        Master Booking List
                    </Link>

                    {/* Manager & Admin shared operational links */}
                    {(role === 'manager' || role === 'admin') && (
                        <>
                            <Link href="/admin/manager/operations" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                                <Activity size={20} className="text-emerald-500" /> Live Operations
                            </Link>
                            <Link href="/admin/manager/caregivers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                                <Users size={20} /> Personnel & Roster
                            </Link>
                            <Link href="/admin/manager/partners" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                                <Building2 size={20} /> Partner Coordination
                            </Link>
                            <Link href="/admin/manager/alerts" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                                <ShieldAlert size={20} /> System Alerts
                            </Link>
                        </>
                    )}

                    {/* Admin-only CMS links */}
                    {role === 'admin' && (
                        <>
                            <div className="pt-4 pb-2 px-4">
                                <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Content Management</p>
                            </div>
                            <Link href="/admin/customize" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                                <Settings2 size={20} /> Customize Homepage
                            </Link>
                            <Link href="/admin/services" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium ml-4 border-l-2 border-emerald-100 dark:border-emerald-900">
                                <LayoutDashboard size={16} /> Service Details Page
                            </Link>
                            <Link href="/admin/services/diagnostic" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium ml-8 border-l-2 border-emerald-100 dark:border-emerald-900 text-sm">
                                <FlaskConical size={14} /> Diagnostic Service CMS
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors font-medium">
                        <Home size={20} /> Visit Live Site
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors font-medium text-left">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT — takes remaining width, scrolls naturally */}
            <main className="flex-1 min-h-screen pt-16 md:pt-0 bg-gray-50 dark:bg-gray-900/50">
                {children}
            </main>
        </div>
    );
}