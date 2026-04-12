"use client";

import React, { useState } from "react";
import { Users, AlertTriangle, Activity, CheckCircle2, Navigation, HeartPulse, Building2, TrendingUp, Clock, CalendarDays } from "lucide-react";

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent mb-2">
          Operations Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor live dispatches, personnel status, and system alerts.
        </p>
      </div>

      {/* Top Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Active Services</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={14} className="mr-1" />
            <span>+12% from yesterday</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">On-Duty Caregivers</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">18 <span className="text-sm font-normal text-gray-400">/ 45</span></p>
          <div className="mt-2 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
            <CheckCircle2 size={14} className="mr-1" />
            <span>All assignments covered</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-amber-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Pending Dispatches</h3>
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
          <div className="mt-2 flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertTriangle size={14} className="mr-1" />
            <span>Requires manager attention</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-purple-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Partner Orders</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
              <Building2 size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
          <div className="mt-2 flex items-center text-xs font-medium text-purple-600 dark:text-purple-400">
            <Navigation size={14} className="mr-1" />
            <span>3 waiting for pickup</span>
          </div>
        </div>
      </div>

      {/* Main Grid area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Activities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Dispatches</h2>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">View Map</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start lg:items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors bg-gray-50/50 dark:bg-gray-800/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                      <HeartPulse className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Senior Care #OP-{8420 + i}</h4>
                      <p className="text-xs text-gray-500 mt-1">Patient: Rahim Uddin • Location: Dhanmondi</p>
                    </div>
                  </div>
                  <div className="hidden lg:block text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                      In Progress
                    </span>
                    <p className="text-xs text-gray-500 mt-1.5">CG: Amina Khatun (On Site)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/20 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="text-red-500" size={20} />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">System Alerts</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse"></div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-red-100">Caregiver Delayed</h4>
                  <p className="text-xs text-gray-600 dark:text-red-200/70 mt-1">Booking #8419 assignment 'Hassan Ali' has not checked in. 15 mins overdue.</p>
                  <button className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline">Re-assign immediately</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CalendarDays size={100} />
            </div>
            <h2 className="text-lg font-bold mb-2 relative z-10">Schedule Roster</h2>
            <p className="text-sm text-emerald-100 font-medium mb-6 max-w-[200px] relative z-10">Review tomorrow's caregiver placement requirements.</p>
            <button className="w-full py-3 bg-white text-teal-800 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md relative z-10">
              Open Planner
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
