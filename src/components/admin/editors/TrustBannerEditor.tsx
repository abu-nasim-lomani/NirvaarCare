"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function TrustBannerEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    // Because localData might be directly the array, we check its type.
    const items = Array.isArray(localData) ? localData : [];
    const [activeIdx, setActiveIdx] = useState(0);

    const updateProp = (idx: number, propPath: string, value: string) => {
        const newData = [...items];
        const item = { ...newData[idx] };

        const keys = propPath.split(".");
        if (keys.length === 2) {
            item[keys[0]] = { ...item[keys[0]], [keys[1]]: value };
        } else {
            item[keys[0]] = value;
        }

        newData[idx] = item;
        setLocalData(newData);
    };

    const addNewItem = () => {
        const template = {
            id: Date.now(),
            icon: "heart",
            number: "১০০+",
            enNumber: "100+",
            text: { bn: "নতুন আইটেম", en: "New Item" },
            sub: { bn: "সাবটেক্সট", en: "Subtext" },
        };
        setLocalData([...items, template]);
        setActiveIdx(items.length);
    };

    const deleteItem = (idx: number) => {
        const newData = items.filter((_, i) => i !== idx);
        setLocalData(newData);
        setActiveIdx(Math.max(0, idx - 1));
    };

    if (!items.length) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">
                    Trust Items ({items.length})
                </h3>
                <button
                    onClick={addNewItem}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
                >
                    <Plus size={14} /> Add Item
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {items.map((_: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIdx(idx)}
                        className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            activeIdx === idx
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Item {idx + 1}
                    </button>
                ))}
            </div>

            {/* Active Form */}
            {items[activeIdx] && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">
                            Editing Item {activeIdx + 1}
                        </h4>
                        <button
                            onClick={() => deleteItem(activeIdx)}
                            className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded"
                            title="Delete Item"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Icon Type
                            </label>
                            <select
                                value={items[activeIdx].icon}
                                onChange={(e) => updateProp(activeIdx, "icon", e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500"
                            >
                                <option value="heart">Heart</option>
                                <option value="shield-check">Shield Check</option>
                                <option value="stethoscope">Stethoscope</option>
                                <option value="zap">Zap (Speed)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Number (EN)
                            </label>
                            <input
                                type="text"
                                value={items[activeIdx].enNumber}
                                onChange={(e) => updateProp(activeIdx, "enNumber", e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Number (BN)
                            </label>
                            <input
                                type="text"
                                value={items[activeIdx].number}
                                onChange={(e) => updateProp(activeIdx, "number", e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Main Text
                        </label>
                        <input
                            type="text"
                            placeholder="EN"
                            value={items[activeIdx].text?.en || ""}
                            onChange={(e) => updateProp(activeIdx, "text.en", e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2"
                        />
                        <input
                            type="text"
                            placeholder="BN"
                            value={items[activeIdx].text?.bn || ""}
                            onChange={(e) => updateProp(activeIdx, "text.bn", e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Subtext
                        </label>
                        <input
                            type="text"
                            placeholder="EN"
                            value={items[activeIdx].sub?.en || ""}
                            onChange={(e) => updateProp(activeIdx, "sub.en", e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2"
                        />
                        <input
                            type="text"
                            placeholder="BN"
                            value={items[activeIdx].sub?.bn || ""}
                            onChange={(e) => updateProp(activeIdx, "sub.bn", e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
