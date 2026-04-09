"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { CheckCircle2, CircleDashed, Clock, FileWarning, Search, XCircle, FileText, ChevronDown } from "lucide-react";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    const statuses = ["Pending", "Processing", "Hold", "Complete", "Cancelled"];

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("service_bookings")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching bookings:", error);
        } else {
            setBookings(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic UI update
        const previousBookings = [...bookings];
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));

        const { error } = await supabase
            .from("service_bookings")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
            setBookings(previousBookings); // revert
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending": return <Clock className="w-4 h-4 text-amber-500" />;
            case "Processing": return <CircleDashed className="w-4 h-4 text-blue-500 animate-spin-slow" />;
            case "Hold": return <FileWarning className="w-4 h-4 text-orange-500" />;
            case "Complete": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case "Cancelled": return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
            case "Processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "Hold": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
            case "Complete": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
            case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
        }
    };

    const filteredBookings = bookings.filter(b => 
        (b.requester_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (b.patient_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (b.service_name_en?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Bookings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage incoming service pre-registrations.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search name or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm dark:text-white transition"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Service</th>
                                <th className="px-6 py-4 font-medium">Requester Info</th>
                                <th className="px-6 py-4 font-medium">Patient Info</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading bookings...</td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No bookings found.</td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {format(new Date(booking.created_at), "MMM d, yyyy h:mm a")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {booking.service_name_en}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 dark:text-white">{booking.requester_name}</span>
                                                <span className="text-gray-500 text-xs">{booking.requester_phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 dark:text-white">{booking.patient_name}</span>
                                                <span className="text-gray-500 text-xs">{booking.booking_data?.patBookingType || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block">
                                                <select
                                                    value={booking.status || "Pending"}
                                                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                                                    className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-xs font-medium border outline-none cursor-pointer ${getStatusColor(booking.status || "Pending")}`}
                                                >
                                                    {statuses.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    {getStatusIcon(booking.status || "Pending")}
                                                </div>
                                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedBooking(booking)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition"
                                            >
                                                <FileText className="w-4 h-4" /> View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950/50">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Booking Details</h3>
                                <p className="text-xs text-gray-500">ID: {selectedBooking.id}</p>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Service Type</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.service_name_en}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status || "Pending")}`}>
                                        {getStatusIcon(selectedBooking.status || "Pending")} {selectedBooking.status || "Pending"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Requester Details */}
                                <div>
                                    <h4 className="font-bold text-emerald-600 dark:text-emerald-400 border-b border-emerald-100 dark:border-emerald-900/30 pb-2 mb-3 text-sm tracking-wider uppercase">Requester Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                        <div><span className="block text-gray-500 mb-1 text-xs">Name</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.reqName || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Phone</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.reqPhone || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Based Location</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.reqLocation || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Relation to Patient</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.reqRelation || "-"}</span></div>
                                        <div className="md:col-span-2"><span className="block text-gray-500 mb-1 text-xs">Best Time to Call</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.reqBestTime || "-"}</span></div>
                                    </div>
                                </div>

                                {/* Patient Details */}
                                <div>
                                    <h4 className="font-bold text-teal-600 dark:text-teal-400 border-b border-teal-100 dark:border-teal-900/30 pb-2 mb-3 text-sm tracking-wider uppercase">Patient Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                        <div><span className="block text-gray-500 mb-1 text-xs">Name</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patName || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Age & Gender</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patAge ? `${selectedBooking.booking_data?.patAge} yrs` : "-"}, {selectedBooking.booking_data?.patGender || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Blood Group</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patBloodGroup || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Phone</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patPhone || "-"}</span></div>
                                        <div className="md:col-span-2"><span className="block text-gray-500 mb-1 text-xs">Address</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patAddress || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Mobility Status</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patMobility || "-"}</span></div>
                                        <div><span className="block text-gray-500 mb-1 text-xs">Booking Type</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patBookingType || "-"}</span></div>
                                        
                                        {selectedBooking.booking_data?.patMedicalCond?.length > 0 && (
                                            <div className="md:col-span-2">
                                                <span className="block text-gray-500 mb-1 text-xs">Medical Conditions</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{selectedBooking.booking_data?.patMedicalCond?.join(', ')}</span>
                                            </div>
                                        )}
                                        
                                        {selectedBooking.booking_data?.patNotes && (
                                            <div className="md:col-span-2">
                                                <span className="block text-gray-500 mb-1 text-xs">Special Instructions</span>
                                                <p className="font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mt-1">{selectedBooking.booking_data?.patNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dynamic Service Details */}
                                <div>
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-indigo-900/30 pb-2 mb-3 text-sm tracking-wider uppercase">Service Requirements</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                        {Object.entries(selectedBooking.booking_data || {}).map(([key, value]) => {
                                            // Skip Base properties
                                            if (key.startsWith('req') || key.startsWith('pat')) return null;
                                            
                                            // Ignore empty values
                                            if (!value || (Array.isArray(value) && value.length === 0)) return null;
                                            if (value === "Select...") return null;

                                            // Format the camel case key to Title Case nicely
                                            const formattedKey = key
                                                .replace(/([A-Z])/g, ' $1')
                                                .replace(/^./, str => str.toUpperCase())
                                                .replace('Diag ', 'Diagnostic: ')
                                                .replace('Doc ', 'Doctor: ')
                                                .replace('Med ', 'Medicine: ')
                                                .replace('Emg ', 'Emergency: ');

                                            return (
                                                <div key={key} className={typeof value === 'string' && value.length > 50 ? "md:col-span-2" : ""}>
                                                    <span className="block text-gray-500 mb-1 text-xs">{formattedKey}</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {Array.isArray(value) ? value.join(', ') : String(value)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
