"use client";

import { AlertTriangle } from "lucide-react";

export default function BetaWatermark() {
    return (
        <div className="fixed bottom-4 left-4 z-[9999] pointer-events-none select-none">
            <div className="flex items-center gap-2 bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur-md border border-amber-500/30 dark:border-amber-400/20 px-3 py-1.5 rounded-full shadow-lg">
                <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400">
                    Beta Version
                </span>
            </div>
        </div>
    );
}
