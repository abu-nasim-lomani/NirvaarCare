"use client";

import { useState } from "react";
import PersonnelTable from "@/components/admin/PersonnelTable";
import { Users, Stethoscope } from "lucide-react";

const TABS = [
    { key: "caregiver", label: "Caregivers", icon: Users, description: "On-field nurses and home care attendants." },
    { key: "doctor", label: "Doctors", icon: Stethoscope, description: "Tele-consultation and visiting physicians." },
] as const;

export default function CaregiversPage() {
    const [activeTab, setActiveTab] = useState<"caregiver" | "doctor">("caregiver");

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Personnel & Roster</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your field team. Create accounts, update details, or revoke access for Caregivers and Doctors.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-1.5 w-fit">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            activeTab === key
                                ? "bg-white dark:bg-gray-900 text-emerald-600 shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4">
                {TABS.find(t => t.key === activeTab)?.description}
            </p>

            {/* Table Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 lg:p-8">
                <PersonnelTable roleName={activeTab} />
            </div>
        </div>
    );
}
