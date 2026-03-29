"use client";

export default function EmergencyCTAEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const data = localData || {};

    const updateGlobalProp = (propPath: string, value: string) => {
        const newData = { ...data };
        const keys = propPath.split(".");
        if (keys.length === 2) {
            newData[keys[0]] = { ...newData[keys[0]], [keys[1]]: value };
        } else {
            newData[keys[0]] = value;
        }
        setLocalData(newData);
    };

    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm border-b pb-2">Emergency CTA Settings</h4>
                
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Title (EN)</label>
                            <textarea rows={2} value={data.title?.en || ""} onChange={(e) => updateGlobalProp("title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-red-500 resize-y" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Title (BN)</label>
                            <textarea rows={2} value={data.title?.bn || ""} onChange={(e) => updateGlobalProp("title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-red-500 resize-y" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Description (EN)</label>
                            <textarea rows={3} value={data.description?.en || ""} onChange={(e) => updateGlobalProp("description.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-red-500 resize-y" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Description (BN)</label>
                            <textarea rows={3} value={data.description?.bn || ""} onChange={(e) => updateGlobalProp("description.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-red-500 resize-y" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                    <div>
                        <label className="block text-xs font-bold text-red-600 mb-1">Call Target (Phone Link)</label>
                        <input type="text" placeholder="+88017..." value={data.phone || ""} onChange={(e) => updateGlobalProp("phone", e.target.value)} className="w-full text-sm border border-red-200 bg-red-50 rounded-md px-3 py-2 outline-none focus:border-red-600" />
                        <span className="text-xs text-gray-400">Used for the href="tel:..." link on mobile devices.</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Button Text (EN)</label>
                            <input type="text" value={data.buttonText?.en || ""} onChange={(e) => updateGlobalProp("buttonText.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Button Text (BN)</label>
                            <input type="text" value={data.buttonText?.bn || ""} onChange={(e) => updateGlobalProp("buttonText.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-red-500" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
